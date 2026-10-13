export const DEFAULT_DELIVERY_PRICE = 150;

export interface StoreSettings {
  id: string;
  storeName: string;
  phone: string;
  email: string;
  locationUrl: string;
  deliveryFee: number;
  isOpen: boolean;
  placePhotoUrl: string | null;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: 'default',
  storeName: 'Bismillah, Fruit Chaat',
  phone: '+92 319 6790442',
  email: 'anwarkhann5074@gmail.com',
  locationUrl: 'https://maps.app.goo.gl/uuFb6zCxt3HypATS8?g_st=aw',
  deliveryFee: DEFAULT_DELIVERY_PRICE,
  isOpen: true,
  placePhotoUrl: null,
};

export function isStoreSettingsMigrationMissing(error: { code?: string; message?: string }) {
  return (
    error.code === 'PGRST205' ||
    /could not find the table ['"]?public\.store_settings|store_settings.*schema cache/i.test(
      error.message || '',
    )
  );
}
