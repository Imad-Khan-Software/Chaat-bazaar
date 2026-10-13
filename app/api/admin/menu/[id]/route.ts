import { NextResponse } from 'next/server';
import { hasAdminSession } from '@/src/lib/adminAuth';
import { getAdminSupabase } from '@/src/lib/adminSupabase';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Sign in to manage the menu.' }, { status: 401 });
  }

  let body: { isAvailable?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter a valid availability value.' }, { status: 400 });
  }
  if (typeof body.isAvailable !== 'boolean') {
    return NextResponse.json({ error: 'Availability must be true or false.' }, { status: 400 });
  }

  const { id } = await context.params;
  try {
    const { data, error } = await getAdminSupabase()
      .from('MenuItem')
      .update({ isAvailable: body.isAvailable })
      .eq('id', id)
      .select('id')
      .maybeSingle();
    if (error) {
      console.error('Unable to update menu item availability:', error.message);
      return NextResponse.json({ error: 'Could not update item availability.' }, { status: 503 });
    }
    if (!data) return NextResponse.json({ error: 'Menu item not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin menu configuration error:', error);
    return NextResponse.json({ error: 'Menu management is not configured on the server.' }, { status: 503 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Sign in to manage the menu.' }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const { data, error } = await getAdminSupabase()
      .from('MenuItem')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();
    if (error) {
      console.error('Unable to delete menu item:', error.message);
      return NextResponse.json({ error: 'Could not delete this menu item.' }, { status: 503 });
    }
    if (!data) return NextResponse.json({ error: 'Menu item not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin menu configuration error:', error);
    return NextResponse.json({ error: 'Menu management is not configured on the server.' }, { status: 503 });
  }
}
