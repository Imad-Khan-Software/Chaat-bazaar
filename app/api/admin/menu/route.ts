import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { hasAdminSession } from '@/src/lib/adminAuth';
import { getAdminSupabase } from '@/src/lib/adminSupabase';

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Sign in to manage the menu.' }, { status: 401 });
  }

  try {
    const { data, error } = await getAdminSupabase()
      .from('MenuItem')
      .select('*')
      .order('name', { ascending: true });
    if (error) {
      console.error('Unable to load admin menu:', error.message);
      return NextResponse.json({ error: 'Could not load the menu.' }, { status: 503 });
    }
    return NextResponse.json({ items: data });
  } catch (error) {
    console.error('Admin menu configuration error:', error);
    return NextResponse.json({ error: 'Menu management is not configured on the server.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Sign in to manage the menu.' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter valid menu item details.' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const category = typeof body.category === 'string' ? body.category.trim() : '';
  const price = Number(body.price);
  if (!name || !description || !category || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: 'Provide a name, description, category, and valid price.' }, { status: 400 });
  }

  const ingredients = Array.isArray(body.ingredients)
    ? body.ingredients.filter((ingredient): ingredient is string => typeof ingredient === 'string')
    : [];

  try {
    const { data, error } = await getAdminSupabase()
      .from('MenuItem')
      .insert({
        id: randomUUID(),
        name,
        image: typeof body.image === 'string'
          ? body.image
          : typeof body.imageUrl === 'string'
            ? body.imageUrl
            : '',
        description,
        price,
        category,
        prepTime: typeof body.prepTime === 'string' ? body.prepTime : '10-15 mins',
        kcal: Number.isInteger(Number(body.kcal)) ? Number(body.kcal) : 200,
        serves: Number.isInteger(Number(body.serves)) ? Number(body.serves) : 1,
        ingredients,
        isAvailable: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Unable to add menu item:', error.message);
      return NextResponse.json({ error: 'Could not add this menu item.' }, { status: 503 });
    }
    return NextResponse.json({ item: data }, { status: 201 });
  } catch (error) {
    console.error('Admin menu configuration error:', error);
    return NextResponse.json({ error: 'Menu management is not configured on the server.' }, { status: 503 });
  }
}
