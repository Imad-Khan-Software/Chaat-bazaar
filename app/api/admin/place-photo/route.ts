import { NextResponse } from 'next/server';
import { hasAdminSession } from '@/src/lib/adminAuth';
import { getAdminSupabase } from '@/src/lib/adminSupabase';
import { isStoreSettingsMigrationMissing } from '@/src/lib/storeSettings';

const MAX_PHOTO_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Sign in to upload a place photo.' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Choose a valid image file.' }, { status: 400 });
  }

  const photo = formData.get('photo');
  if (!(photo instanceof File)) {
    return NextResponse.json({ error: 'Choose a photo to upload.' }, { status: 400 });
  }
  const extension = ALLOWED_TYPES[photo.type];
  if (!extension || photo.size === 0 || photo.size > MAX_PHOTO_SIZE) {
    return NextResponse.json(
      { error: 'Use a JPEG, PNG, or WebP image no larger than 8 MB.' },
      { status: 400 },
    );
  }

  try {
    const supabase = getAdminSupabase();
    const objectPath = `place.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from('store-photos')
      .upload(objectPath, photo, {
        contentType: photo.type,
        cacheControl: '60',
        upsert: true,
      });

    if (uploadError) {
      console.error('Unable to upload store photo:', uploadError.message);
      const migrationMissing =
        isStoreSettingsMigrationMissing(uploadError) ||
        uploadError.message.toLowerCase().includes('bucket not found');
      const message = migrationMissing
        ? 'Place photo storage is not initialized. Run supabase/migrations/20261012_store_settings.sql in the Supabase SQL Editor.'
        : 'Could not upload the place photo.';
      return NextResponse.json({ error: message }, { status: 503 });
    }

    const { data } = supabase.storage.from('store-photos').getPublicUrl(objectPath);
    const photoUrl = `${data.publicUrl}?v=${Date.now()}`;
    const { error: updateError } = await supabase
      .from('store_settings')
      .update({ place_image_url: photoUrl })
      .eq('id', 1);

    if (updateError) {
      console.error('Unable to save store photo URL:', updateError.message);
      const message = isStoreSettingsMigrationMissing(updateError)
        ? 'The photo uploaded, but store settings are not initialized. Run supabase/migrations/20261012_store_settings.sql in the Supabase SQL Editor.'
        : 'The photo uploaded, but its public setting could not be saved.';
      return NextResponse.json({ error: message }, { status: 503 });
    }

    return NextResponse.json({ placePhotoUrl: photoUrl });
  } catch (error) {
    console.error('Store photo configuration error:', error);
    return NextResponse.json({ error: 'Photo storage is not configured on the server.' }, { status: 503 });
  }
}
