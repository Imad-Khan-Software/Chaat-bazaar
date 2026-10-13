'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Lock,
  Store,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
  Save,
  Phone,
  Mail,
  MapPin,
  Truck,
  Power,
  RefreshCw,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  Upload,
} from 'lucide-react';

interface StoreSettings {
  id: string;
  storeName: string;
  phone: string;
  email: string;
  locationUrl: string;
  deliveryFee: number;
  isOpen: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  prepTime?: string;
  kcal?: number;
  serves?: number;
  ingredients?: string[];
  isAvailable: boolean;
  category: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  id: 'default',
  storeName: 'Bismillah Chaat Bazaar',
  phone: '+92 319 6790442',
  email: 'anwarkhann5074@gmail.com',
  locationUrl: 'https://maps.app.goo.gl/uuFb6zCxt3HypATS8?g_st=aw',
  deliveryFee: 150,
  isOpen: true,
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'menu' | 'settings'>('menu');

  // Store Settings State
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  // Menu / Product Items State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuSuccess, setMenuSuccess] = useState('');
  const [menuError, setMenuError] = useState('');

  // Form State for Adding New Product
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: 'Chaat',
  });
  const [addingProduct, setAddingProduct] = useState(false);
  const [placePhotoUrl, setPlacePhotoUrl] = useState<string | null>(null);
  const [placePhoto, setPlacePhoto] = useState<File | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');
    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: passcode }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Admin sign-in failed.');
      setIsAuthenticated(true);
      setPasscode('');
      setAuthError('');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Admin sign-in failed.');
    }
  };

  // --- Fetch Store Settings ---
  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const response = await fetch('/api/admin/settings', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load store settings.');
      setSettings({
        id: 'default',
        storeName: data.storeName || DEFAULT_SETTINGS.storeName,
        phone: data.phone || DEFAULT_SETTINGS.phone,
        email: data.email || DEFAULT_SETTINGS.email,
        locationUrl: data.locationUrl || DEFAULT_SETTINGS.locationUrl,
        deliveryFee: Number(data.deliveryFee ?? DEFAULT_SETTINGS.deliveryFee),
        isOpen: data.isOpen ?? true,
      });
      setPlacePhotoUrl(data.placePhotoUrl || null);
    } catch (error) {
      setSettingsError(error instanceof Error ? error.message : 'Could not load store settings.');
    } finally {
      setSettingsLoading(false);
    }
  };

  // --- Fetch Menu Products ---
  const fetchMenuItems = async () => {
    setMenuLoading(true);
    try {
      const response = await fetch('/api/admin/menu', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch items.');
      setMenuItems(result.items as MenuItem[]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch items';
      setMenuError(msg);
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      try {
        const response = await fetch('/api/admin/session', { cache: 'no-store' });
        const result = await response.json();
        if (!active) return;
        if (!response.ok) throw new Error(result.error || 'Could not verify admin session.');
        setIsAuthenticated(Boolean(result.authenticated));
      } catch (error) {
        if (active) {
          setAuthError(error instanceof Error ? error.message : 'Could not verify admin session.');
          setIsAuthenticated(false);
        }
      }
    };
    void restoreSession();
    return () => {
      active = false;
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = window.setTimeout(() => {
        void fetchSettings();
        void fetchMenuItems();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // --- Save Store Settings ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSaveSuccess(false);
    setSettingsError('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to save settings.');
      setSettings(result.settings);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save settings';
      setSettingsError(msg);
    } finally {
      setSettingsLoading(false);
    }
  };

  const uploadPlacePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placePhoto) {
      setSettingsError('Choose a place photo before uploading.');
      return;
    }

    setSettingsLoading(true);
    setSettingsError('');
    try {
      const formData = new FormData();
      formData.set('photo', placePhoto);
      const response = await fetch('/api/admin/place-photo', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not upload place photo.');
      setPlacePhotoUrl(result.placePhotoUrl);
      setPlacePhoto(null);
      setSaveSuccess(true);
    } catch (error) {
      setSettingsError(error instanceof Error ? error.message : 'Could not upload place photo.');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/session', { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not sign out.');
      setIsAuthenticated(false);
      setMenuItems([]);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Could not sign out.');
    }
  };

  // --- Add New Product / Menu Item ---
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim() || !newItem.price) return;

    setAddingProduct(true);
    setMenuError('');
    setMenuSuccess('');

    try {
      const itemData = {
        name: newItem.name.trim(),
        description: newItem.description.trim(),
        price: parseFloat(newItem.price),
        image:
          newItem.imageUrl.trim() ||
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        category: newItem.category.trim() || 'Chaat',
      };

      const response = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not add dish.');

      setMenuSuccess(`"${newItem.name}" added to menu successfully!`);
      setNewItem({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: 'Chaat',
      });
      await fetchMenuItems();
      setTimeout(() => setMenuSuccess(''), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not add dish';
      setMenuError(msg);
    } finally {
      setAddingProduct(false);
    }
  };

  // --- Toggle Dish Availability ---
  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/menu/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not update availability.');
      setMenuItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isAvailable: !currentStatus } : item))
      );
    } catch (err) {
      setMenuError(err instanceof Error ? err.message : 'Could not update availability.');
    }
  };

  // --- Delete Dish ---
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) return;

    try {
      const response = await fetch(`/api/admin/menu/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not delete dish.');
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      setMenuSuccess(`Deleted "${name}"`);
      setTimeout(() => setMenuSuccess(''), 2500);
    } catch (err) {
      setMenuError(err instanceof Error ? err.message : 'Could not delete dish.');
    }
  };

  // Screen 1: Passcode Login
  if (isAuthenticated !== true) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 text-white">
        <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-serif font-bold text-center text-white mb-1">
            Admin Access
          </h2>
          <p className="text-xs text-neutral-400 text-center mb-6">
            {isAuthenticated === null ? 'Checking admin session…' : 'Enter admin PIN to manage dishes and store'}
          </p>

          {isAuthenticated !== null && <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 text-center tracking-widest"
              />
            </div>

            {authError && (
              <div className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 py-2 rounded-xl">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold py-2.5 rounded-xl text-xs transition active:scale-95"
            >
              Unlock Dashboard
            </button>
          </form>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-white">Store Administration</h1>
              <p className="text-xs text-neutral-400">Bismillah Chaat Bazaar Control Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchSettings();
                fetchMenuItems();
              }}
              className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${menuLoading || settingsLoading ? 'animate-spin' : ''}`} /> Refresh
            </button>

            <button
              onClick={handleLogout}
              className="bg-neutral-900 border border-neutral-800 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-neutral-400 px-3 py-2 rounded-xl text-xs transition"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 p-1.5 rounded-2xl max-w-md">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'menu'
                ? 'bg-amber-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" /> Menu Products ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" /> Store Settings
          </button>
        </div>

        {/* TAB 1: MENU & PRODUCTS MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            {/* Alerts */}
            {menuSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-2xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {menuSuccess}
              </div>
            )}
            {menuError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {menuError}
              </div>
            )}

            {/* Add New Product Form */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="font-serif font-bold text-lg text-white mb-1 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" /> Add New Dish to Menu
              </h3>
              <p className="text-xs text-neutral-400 mb-6">
                Publish a fresh chaat, gol gappy, or snack item instantly to the customer menu.
              </p>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-neutral-400 block mb-1">Dish Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Special Dahi Bhalla"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Price (PKR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 150"
                      min="1"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Chaat, Gol Gappay, Drinks"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Image URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://... or leave empty"
                      value={newItem.imageUrl}
                      onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Description / Ingredients</label>
                  <textarea
                    rows={2}
                    placeholder="Crispy papri, spiced chickpeas, sweet tamarind & chilled yogurt..."
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={addingProduct}
                  className="bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-50 text-neutral-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg"
                >
                  <Plus className="w-4 h-4" /> {addingProduct ? 'Adding Dish...' : 'Add Dish to Menu'}
                </button>
              </form>
            </div>

            {/* List of Existing Products */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="font-serif font-bold text-lg text-white mb-4">
                Current Menu Items ({menuItems.length})
              </h3>

              {menuLoading ? (
                <div className="text-center py-12 text-xs text-neutral-400">Loading dishes...</div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-12 text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
                  No items on the menu yet. Use the form above to add your first dish!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className={`bg-neutral-950/80 border rounded-2xl p-4 flex flex-col justify-between transition ${
                        item.isAvailable ? 'border-neutral-800' : 'border-neutral-800/50 opacity-60'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-sm text-white">{item.name}</h4>
                            <span className="text-[10px] text-neutral-400">{item.category}</span>
                          </div>
                          <span className="font-bold text-emerald-400 text-sm">
                            Rs. {item.price}
                          </span>
                        </div>

                        {item.description && (
                          <p className="text-xs text-neutral-400 line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-[10px] text-amber-400 pt-1">
                          <ImageIcon className="w-3 h-3" /> {item.category || 'Chaat'}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-800/80">
                        {/* Availability Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(item.id, item.isAvailable)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                            item.isAvailable
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {item.isAvailable ? (
                            <>
                              <Check className="w-3 h-3" /> Available
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3" /> Out of Stock
                            </>
                          )}
                        </button>

                        {/* Delete Dish */}
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(item.id, item.name)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-900 rounded-lg transition"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {saveSuccess && (
              <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Settings saved successfully!
              </div>
            )}

            {settingsError && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {settingsError}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Open / Closed Toggle */}
              <div className="flex items-center justify-between p-4 bg-neutral-950/80 border border-neutral-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Power className={`w-5 h-5 ${settings.isOpen ? 'text-emerald-400' : 'text-neutral-500'}`} />
                  <div>
                    <h4 className="text-sm font-bold text-white">Store Availability</h4>
                    <p className="text-[11px] text-neutral-400">
                      {settings.isOpen ? 'Store is open and taking customer orders' : 'Store is marked closed'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, isOpen: !settings.isOpen })}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    settings.isOpen
                      ? 'bg-emerald-500 text-neutral-950 hover:bg-emerald-600'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {settings.isOpen ? 'OPEN' : 'CLOSED'}
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1.5">Business Name</label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1.5">WhatsApp / Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1.5">Default Delivery Charge (PKR)</label>
                  <div className="relative">
                    <Truck className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="number"
                      min="0"
                      max="100000"
                      step="1"
                      value={settings.deliveryFee}
                      onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-neutral-400 block mb-1.5">Google Maps URL</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="url"
                      value={settings.locationUrl}
                      onChange={(e) => setSettings({ ...settings, locationUrl: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={settingsLoading}
                  className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-50 text-neutral-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg"
                >
                  <Save className="w-4 h-4" /> {settingsLoading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>

            <form onSubmit={uploadPlacePhoto} className="mt-8 border-t border-neutral-800 pt-6">
              <h3 className="font-serif text-lg font-bold text-white">Public Place Photo</h3>
              <p className="mb-4 mt-1 text-xs text-neutral-400">
                Upload a JPEG, PNG, or WebP image up to 8 MB. It will show on the public page.
              </p>
              {placePhotoUrl && (
                <div className="relative mb-4 h-48 overflow-hidden rounded-2xl border border-neutral-800">
                  <Image
                    src={placePhotoUrl}
                    alt="Current shop photo"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setPlacePhoto(event.target.files?.[0] || null)}
                  className="min-w-0 flex-1 text-xs text-neutral-300 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-800 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
                />
                <button
                  type="submit"
                  disabled={settingsLoading || !placePhoto}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 transition hover:bg-amber-600 disabled:opacity-50"
                >
                  <Upload className="mr-1 inline h-4 w-4" /> Upload photo
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}