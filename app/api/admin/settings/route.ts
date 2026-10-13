import { NextResponse } from 'next/server';
import { hasAdminSession } from '@/src/lib/adminAuth';
import { getAdminSupabase } from '@/src/lib/adminSupabase';
import { isStoreSettingsMigrationMissing } from '@/src/lib/storeSettings';

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Sign in to manage store settings.' }, { status: 401 });
  }

  try {
    const { data, error } = await getAdminSupabase()
      .from('store_settings')
      .select('delivery_price, place_image_url, store_name, phone, email, location_url, is_open')
      .eq('id', 1)
      .single();
    if (error) {
      console.error('Unable to load admin store settings:', error.message);
      const message = isStoreSettingsMigrationMissing(error)
        ? 'Store settings are not initialized. Run supabase/migrations/20261012_store_settings.sql in the Supabase SQL Editor.'
        : 'Could not load store settings.';
      return NextResponse.json({ error: message }, { status: 503 });
    }
    return NextResponse.json({
      id: 'default',
      storeName: data.store_name,
      phone: data.phone,
      email: data.email,
      locationUrl: data.location_url,
      deliveryFee: Number(data.delivery_price),
      isOpen: data.is_open,
      placePhotoUrl: data.place_image_url || null,
    });
  } catch (error) {
    console.error('Store settings configuration error:', error);
    return NextResponse.json({ error: 'Store settings are not configured on the server.' }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Sign in to manage store settings.' }, { status: 401 });
  }

  let body: {
    storeName?: unknown;
    phone?: unknown;
    email?: unknown;
    locationUrl?: unknown;
    deliveryFee?: unknown;
    isOpen?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter valid store settings.' }, { status: 400 });
  }

  const storeName = typeof body.storeName === 'string' ? body.storeName.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const locationUrl = typeof body.locationUrl === 'string' ? body.locationUrl.trim() : '';
  const deliveryPrice = Number(body.deliveryFee);

  if (
    !storeName ||
    !phone ||
    !email ||
    !Number.isInteger(deliveryPrice) ||
    deliveryPrice < 0 ||
    deliveryPrice > 100_000 ||
    typeof body.isOpen !== 'boolean' ||
    (locationUrl !== '' && !URL.canParse(locationUrl))
  ) {
    return NextResponse.json({ error: 'Provide a valid business name, phone, email, delivery price, and location URL.' }, { status: 400 });
  }

  try {
    const { data, error } = await getAdminSupabase()
      .from('store_settings')
      .update({
        store_name: storeName,
        phone,
        email,
        location_url: locationUrl,
        delivery_price: deliveryPrice,
        is_open: body.isOpen,
      })
      .eq('id', 1)
      .select('delivery_price, place_image_url, store_name, phone, email, location_url, is_open')
      .single();
    if (error) {
      console.error('Unable to save delivery price:', error.message);
      const message = isStoreSettingsMigrationMissing(error)
        ? 'Store settings are not initialized. Run supabase/migrations/20261012_store_settings.sql in the Supabase SQL Editor.'
        : 'Could not save the delivery price.';
      return NextResponse.json({ error: message }, { status: 503 });
    }
    return NextResponse.json({
      settings: {
        id: 'default',
        storeName: data.store_name,
        phone: data.phone,
        email: data.email,
        locationUrl: data.location_url,
        deliveryFee: Number(data.delivery_price),
        isOpen: data.is_open,
        placePhotoUrl: data.place_image_url || null,
      },
    });
  } catch (error) {
    console.error('Store settings configuration error:', error);
    return NextResponse.json({ error: 'Store settings are not configured on the server.' }, { status: 503 });
  }
}
