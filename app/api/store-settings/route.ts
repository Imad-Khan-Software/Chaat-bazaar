import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/src/lib/adminSupabase';
import {
  DEFAULT_STORE_SETTINGS,
  isStoreSettingsMigrationMissing,
} from '@/src/lib/storeSettings';

export async function GET() {
  try {
    const { data, error } = await getAdminSupabase()
      .from('store_settings')
      .select('delivery_price, place_image_url, store_name, phone, email, location_url, is_open')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Unable to load public store settings:', error.message);
      const message = isStoreSettingsMigrationMissing(error)
        ? 'Store settings are not initialized. Run supabase/migrations/20261012_store_settings.sql in the Supabase SQL Editor.'
        : 'Store settings are temporarily unavailable.';
      return NextResponse.json({ error: message }, { status: 503 });
    }

    const deliveryPrice = Number(data.delivery_price);
    return NextResponse.json(
      {
        id: 'default',
        storeName: data.store_name || DEFAULT_STORE_SETTINGS.storeName,
        phone: data.phone || DEFAULT_STORE_SETTINGS.phone,
        email: data.email || DEFAULT_STORE_SETTINGS.email,
        locationUrl: data.location_url || DEFAULT_STORE_SETTINGS.locationUrl,
        deliveryFee: Number.isFinite(deliveryPrice) && deliveryPrice >= 0
          ? deliveryPrice
          : DEFAULT_STORE_SETTINGS.deliveryFee,
        isOpen: data.is_open ?? true,
        placePhotoUrl: data.place_image_url || null,
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  } catch (error) {
    console.error('Public store settings configuration error:', error);
    return NextResponse.json({ error: 'Store settings are not configured on the server.' }, { status: 503 });
  }
}
