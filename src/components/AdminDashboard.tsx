import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Shield,
  LogIn,
  LogOut,
  Database,
  RefreshCw,
  Plus,
  Trash2,
  Phone,
  MessageSquare,
  AlertCircle,
  Save,
  CheckCircle,
  Store,
  Tag,
  Clock,
  ExternalLink,
  Layers,
  Inbox,
  Settings,
  TrendingUp,
  Search,
  Check,
  XCircle,
  Languages
} from 'lucide-react';
import { User } from 'firebase/auth';
import { signInWithGoogle, logOut } from '../firebase';
import {
  updateCropPrice,
  saveCropRate,
  toggleProductAvailability,
  saveProduct,
  deleteProduct,
  saveShopConfig,
  resetDatabaseToDefaults,
  subscribeToInquiries,
  updateInquiryStatus
} from '../services/dbService';
import { CropRateItem, ProductItem, ShopConfig, FarmerInquiry } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AdminDashboardProps {
  user: User | null;
  rates: CropRateItem[];
  products: ProductItem[];
  config: ShopConfig;
  isDbConnected: boolean;
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  rates,
  products,
  config,
  isDbConnected,
  onBackToStore
}) => {
  const { lang, setLang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'rates' | 'products' | 'inquiries' | 'config'>('rates');
  const [inquiries, setInquiries] = useState<FarmerInquiry[]>([]);
  const [editingPrice, setEditingPrice] = useState<Record<string, number>>({});
  const [editingProdPrice, setEditingProdPrice] = useState<Record<string, number>>({});
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [savingRateId, setSavingRateId] = useState<string | null>(null);
  const [savingProdId, setSavingProdId] = useState<string | null>(null);
  const [editingConfig, setEditingConfig] = useState<ShopConfig>(config);

  // Search in admin
  const [cropSearch, setCropSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // New product form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameKn, setNewProdNameKn] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(100);
  const [newProdPack, setNewProdPack] = useState('50 kg');
  const [newProdCategory, setNewProdCategory] = useState('Fertilizer');

  useEffect(() => {
    setEditingConfig(config);
  }, [config]);

  // Subscribe to farmer inquiries only when user is authenticated
  useEffect(() => {
    if (!user) {
      setInquiries([]);
      return;
    }

    try {
      const unsub = subscribeToInquiries(
        (data) => setInquiries(data),
        (err) => console.warn('Inquiries subscription err (may require permissions):', err)
      );
      return () => {
        if (unsub) unsub();
      };
    } catch (e) {
      console.warn('Inquiries err:', e);
    }
  }, [user]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      showToast(lang === 'kn' ? 'ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ!' : 'Signed in successfully with Google!');
    } catch (error) {
      console.error(error);
      showToast(lang === 'kn' ? 'ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ.' : 'Login failed. Please retry.', 'error');
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      showToast(lang === 'kn' ? 'ಸೈನ್ ಔಟ್ ಆಗಿದೆ.' : 'Signed out.');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSyncDefaults = async () => {
    if (!user) {
      showToast(lang === 'kn' ? 'ಡೇಟಾಬೇಸ್ ಸಿಂಕ್ ಮಾಡಲು ಮೊದಲು Google ಲಾಗಿನ್ ಆಗಿ.' : 'Please login with Google first.', 'error');
      return;
    }
    setSyncing(true);
    try {
      await resetDatabaseToDefaults();
      showToast(lang === 'kn' ? 'ಎಲ್ಲಾ ದರಗಳು ಮತ್ತು ಉತ್ಪನ್ನಗಳನ್ನು Firestore ಡೇಟಾಬೇಸ್‌ಗೆ ಯಶಸ್ವಿಯಾಗಿ ಸಿಂಕ್ ಮಾಡಲಾಗಿದೆ!' : 'Default crop rates and inventory synced to Firestore database!');
    } catch (error) {
      console.error(error);
      showToast(lang === 'kn' ? 'ಸಿಂಕ್ ಮಾಡುವಲ್ಲಿ ದೋಷ ಉಂಟಾಗಿದೆ.' : 'Error during database sync.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleSavePrice = async (rateId: string) => {
    const newP = editingPrice[rateId];
    if (newP === undefined || newP < 0) return;
    setSavingRateId(rateId);
    try {
      await updateCropPrice(rateId, newP);
      showToast(lang === 'kn' ? `ದರ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ: ₹${newP}` : `Price updated: ₹${newP}`);
    } catch (error) {
      console.error(error);
      showToast(lang === 'kn' ? 'ದರ ನವೀಕರಿಸಲು ದೋಷ.' : 'Failed to update rate.', 'error');
    } finally {
      setSavingRateId(null);
    }
  };

  const adjustPriceDelta = (rateId: string, currentPrice: number, delta: number) => {
    const current = editingPrice[rateId] ?? currentPrice;
    const next = Math.max(0, current + delta);
    setEditingPrice(prev => ({ ...prev, [rateId]: next }));
  };

  const handleToggleProduct = async (prodId: string, current: boolean) => {
    try {
      await toggleProductAvailability(prodId, !current);
      showToast(lang === 'kn' ? 'ದಾಸ್ತಾನು ಸ್ಥಿತಿ ಬದಲಾಗಿದೆ.' : 'Inventory stock status toggled.');
    } catch (error) {
      console.error(error);
      showToast(lang === 'kn' ? 'ಅಪ್‌ಡೇಟ್ ದೋಷ.' : 'Failed to toggle stock.', 'error');
    }
  };

  const handleSaveProductPrice = async (prod: ProductItem) => {
    const p = editingProdPrice[prod.id];
    if (p === undefined) return;
    setSavingProdId(prod.id);
    try {
      await saveProduct({ ...prod, price: p });
      showToast(lang === 'kn' ? `ಉತ್ಪನ್ನ ಬೆಲೆ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ: ₹${p}` : `Product price updated: ₹${p}`);
    } catch (error) {
      console.error(error);
      showToast(lang === 'kn' ? 'ಬೆಲೆ ನವೀಕರಿಸಲು ದೋಷ.' : 'Failed to update product price.', 'error');
    } finally {
      setSavingProdId(null);
    }
  };

  const handleAddNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    const newId = `prod_${Date.now()}`;
    try {
      await saveProduct({
        id: newId,
        name: newProdName.trim(),
        nameKn: newProdNameKn.trim(),
        category: newProdCategory,
        price: Number(newProdPrice) || 0,
        packSize: newProdPack.trim() || '1 Unit',
        isAvailable: true,
        updatedAt: new Date().toISOString()
      });
      setShowAddProduct(false);
      setNewProdName('');
      setNewProdNameKn('');
      showToast(lang === 'kn' ? 'ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಲಾಗಿದೆ!' : 'New product created and synced!');
    } catch (error) {
      console.error(error);
      showToast(lang === 'kn' ? 'ಉತ್ಪನ್ನ ಸೇರಿಸುವಲ್ಲಿ ದೋಷ.' : 'Failed to create product.', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(lang === 'kn' ? 'ಈ ಉತ್ಪನ್ನವನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ?' : 'Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      showToast(lang === 'kn' ? 'ಉತ್ಪನ್ನ ಅಳಿಸಲಾಗಿದೆ.' : 'Product deleted.');
    } catch (error) {
      console.error(error);
      showToast(lang === 'kn' ? 'ಅಳಿಸುವಲ್ಲಿ ದೋಷ.' : 'Failed to delete product.', 'error');
    }
  };

  const handleSaveShopConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveShopConfig(editingConfig);
      showToast(lang === 'kn' ? 'ಅಂಗಡಿ ಮಾಹಿತಿ ಮತ್ತು ಸೂಚನೆ ನವೀಕರಿಸಲಾಗಿದೆ!' : 'Shop information and notice saved!');
    } catch (error) {
      console.error(error);
      showToast(lang === 'kn' ? 'ನವೀಕರಿಸುವಲ್ಲಿ ದೋಷ.' : 'Failed to save settings.', 'error');
    }
  };

  const handleStatusChange = async (inqId: string, status: 'pending' | 'contacted' | 'completed') => {
    try {
      await updateInquiryStatus(inqId, status);
      showToast(lang === 'kn' ? 'ಸ್ಥಿತಿ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ!' : 'Inquiry status updated!');
    } catch (error) {
      console.error(error);
      showToast(lang === 'kn' ? 'ಸ್ಥಿತಿ ಬದಲಾವಣೆಯಲ್ಲಿ ದೋಷ.' : 'Failed to change status.', 'error');
    }
  };

  const pendingInquiriesCount = inquiries.filter(i => i.status === 'pending').length;

  const filteredRates = rates.filter(r => {
    if (!cropSearch.trim()) return true;
    const q = cropSearch.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.nameKn.includes(q) || r.categoryNameKn.includes(q);
  });

  const filteredProducts = products.filter(p => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.nameKn && p.nameKn.includes(q)) || (p.category && p.category.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-[#f4eee0] flex flex-col text-[#241c15]">
      {/* Top Admin App Header */}
      <header className="sticky top-0 z-40 bg-[#20332a] text-white border-b-4 border-[#c98a2b] shadow-md w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
          {/* Back button and page title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-[#efe7d2] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0"
              title="Return to customer store view"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#c98a2b]" />
              <span className="hidden sm:inline">{t.backToStore}</span>
              <span className="sm:hidden">{lang === 'kn' ? 'ಮುಖಪುಟ' : 'Store'}</span>
            </button>

            <div className="h-5 w-px bg-white/20 hidden sm:block"></div>

            <div className="flex items-center gap-1.5 min-w-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#c98a2b] shrink-0" />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-bold leading-tight truncate">
                  {lang === 'kn' ? 'ಅಂಗಡಿ ನಿರ್ವಹಣಾ ಪುಟ' : 'Shop Admin'}
                </h1>
                <p className="text-[11px] text-[#c98a2b] italic hidden sm:block">
                  Canara Traders, Sullia — Live Firestore Control
                </p>
              </div>
            </div>
          </div>

          {/* Auth, Language & DB status controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Language Toggle in Admin */}
            <div className="flex items-center bg-black/40 border border-white/15 rounded-md p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang('kn')}
                className={`px-1.5 sm:px-2 py-0.5 rounded transition-colors text-[11px] sm:text-xs ${
                  lang === 'kn' ? 'bg-[#c98a2b] text-[#20332a]' : 'text-[#efe7d2] hover:text-white'
                }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-1.5 sm:px-2 py-0.5 rounded transition-colors text-[11px] sm:text-xs ${
                  lang === 'en' ? 'bg-[#c98a2b] text-[#20332a]' : 'text-[#efe7d2] hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/30 border border-white/10 text-xs">
              <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className="text-[#efe7d2]">
                {isDbConnected ? 'Firestore Online' : 'Connecting...'}
              </span>
            </div>

            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="hidden md:inline-block text-xs bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded font-medium max-w-[150px] truncate">
                  {user.email || user.displayName}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700/40 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors min-h-[32px]"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{lang === 'kn' ? 'ಲಾಗೌಟ್' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="bg-[#c98a2b] hover:bg-[#a86f1c] text-[#20332a] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-sm transition-all min-h-[32px]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Google {lang === 'kn' ? 'ಲಾಗಿನ್' : 'Login'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Quick Summary Metric Cards */}
      <div className="bg-[#2f4a3d] text-white border-b border-[#c98a2b]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs font-en-body">
            <div className="bg-black/25 border border-white/10 rounded-lg p-3">
              <div className="text-[#c98a2b] font-semibold text-[11px] uppercase">
                {lang === 'kn' ? 'ಬೆಳೆ ದರಗಳು (Rates)' : 'Crop Purchase Rates'}
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono mt-0.5 text-white">{rates.length}</div>
              <div className="text-[10px] text-[#efe7d2]/70 mt-0.5">Areca, Coconut, Rubber...</div>
            </div>

            <div className="bg-black/25 border border-white/10 rounded-lg p-3">
              <div className="text-[#c98a2b] font-semibold text-[11px] uppercase">
                {lang === 'kn' ? 'ಉತ್ಪನ್ನಗಳು (Products)' : 'Shop Products'}
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono mt-0.5 text-white">{products.length}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">
                {products.filter(p => p.isAvailable).length} {lang === 'kn' ? 'ಲಭ್ಯವಿದೆ (In Stock)' : 'In Stock'}
              </div>
            </div>

            <div className="bg-black/25 border border-white/10 rounded-lg p-3">
              <div className="text-[#c98a2b] font-semibold text-[11px] uppercase">
                {lang === 'kn' ? 'ರೈತರ ವಿಚಾರಣೆಗಳು (Inquiries)' : 'Farmer Inquiries'}
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono mt-0.5 text-white flex items-center gap-2">
                <span>{inquiries.length}</span>
                {pendingInquiriesCount > 0 && (
                  <span className="text-xs bg-amber-500 text-black px-1.5 py-0.2 rounded-full font-bold">
                    {pendingInquiriesCount} {lang === 'kn' ? 'ಬಾಕಿ' : 'Pending'}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#efe7d2]/70 mt-0.5">Crop Sell Leads</div>
            </div>

            <div className="bg-black/25 border border-white/10 rounded-lg p-3 flex flex-col justify-between">
              <div>
                <div className="text-[#c98a2b] font-semibold text-[11px] uppercase">
                  {lang === 'kn' ? 'ಡೇಟಾಬೇಸ್ ಸಿಂಕ್' : 'Database Sync'}
                </div>
                <div className="text-xs text-[#efe7d2] mt-1">Firestore Realtime</div>
              </div>
              <button
                onClick={handleSyncDefaults}
                disabled={syncing}
                className="mt-2 inline-flex items-center justify-center gap-1.5 bg-[#c98a2b] hover:bg-[#a86f1c] text-[#20332a] px-2.5 py-1 rounded text-[11px] font-bold transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? (lang === 'kn' ? 'ಸಿಂಕ್...' : 'Syncing...') : (lang === 'kn' ? 'ಮರುಹೊಂದಿಸಿ (Sync Defaults)' : 'Sync Defaults')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation Bar */}
      <div className="sticky top-[58px] z-30 bg-[#efe7d2] border-b border-[#241c15]/15 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('rates')}
              className={`px-4 py-2 rounded-md transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'rates'
                  ? 'bg-[#2f4a3d] text-[#f6f1e2] shadow-sm'
                  : 'bg-white/80 text-[#5c4033] hover:bg-white border border-[#241c15]/10'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#c98a2b]" />
              <span>{lang === 'kn' ? 'ಇಂದಿನ ಬೆಳೆ ದರ ಪರಿಷ್ಕರಣೆ' : 'Crop Rates'} ({rates.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-md transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'bg-[#2f4a3d] text-[#f6f1e2] shadow-sm'
                  : 'bg-white/80 text-[#5c4033] hover:bg-white border border-[#241c15]/10'
              }`}
            >
              <Store className="w-4 h-4 text-[#c98a2b]" />
              <span>{lang === 'kn' ? 'ಉತ್ಪನ್ನಗಳು & ದಾಸ್ತಾನು' : 'Inventory & Stock'} ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 rounded-md transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'inquiries'
                  ? 'bg-[#2f4a3d] text-[#f6f1e2] shadow-sm'
                  : 'bg-white/80 text-[#5c4033] hover:bg-white border border-[#241c15]/10'
              }`}
            >
              <Inbox className="w-4 h-4 text-[#c98a2b]" />
              <span>{lang === 'kn' ? 'ರೈತರ ವಿಚಾರಣೆಗಳು' : 'Farmer Inquiries'}</span>
              {pendingInquiriesCount > 0 && (
                <span className="bg-[#8b3a3a] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {pendingInquiriesCount} {lang === 'kn' ? 'ಹೊಸದು' : 'New'}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`px-4 py-2 rounded-md transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'config'
                  ? 'bg-[#2f4a3d] text-[#f6f1e2] shadow-sm'
                  : 'bg-white/80 text-[#5c4033] hover:bg-white border border-[#241c15]/10'
              }`}
            >
              <Settings className="w-4 h-4 text-[#c98a2b]" />
              <span>{lang === 'kn' ? 'ಅಂಗಡಿ ವಿವರಗಳು & ಪ್ರಕಟಣೆ' : 'Shop Details & Notice'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Banner */}
      {statusMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div
            className={`p-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs ${
              statusMessage.type === 'success'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-red-100 text-red-900 border border-red-300'
            }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ==================== TAB 1: CROP RATES ==================== */}
        {activeTab === 'rates' && (
          <div className="space-y-5">
            <div className="bg-white border border-[#241c15]/15 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-kn-head text-[#20332a]">
                  {lang === 'kn' ? 'ದೈನಂದಿನ ಬೆಳೆ ಖರೀದಿ ದರ ಪರಿಷ್ಕರಣೆ' : 'Daily Crop Purchase Rates Editor'}
                </h2>
                <p className="text-xs sm:text-sm text-[#5c4033] mt-1 font-kn-body">
                  {lang === 'kn'
                    ? "ಇಲ್ಲಿ ದರ ಬದಲಾಯಿಸಿ 'ಉಳಿಸಿ' ಕ್ಲಿಕ್ ಮಾಡಿದರೆ, ತಕ್ಷಣವೇ ಎಲ್ಲಾ ರೈತರ ಮೊಬೈಲ್ ಮತ್ತು ಮುಖಪುಟದಲ್ಲಿ ಲೈವ್ ಆಗಿ ನವೀಕರಣಗೊಳ್ಳುತ್ತದೆ."
                    : 'Modifying rates here updates live prices across all farmer devices and the homepage instantaneously via Firestore.'}
                </p>
              </div>

              {/* Search bar */}
              <div className="relative w-full md:w-64 shrink-0">
                <input
                  type="text"
                  value={cropSearch}
                  onChange={(e) => setCropSearch(e.target.value)}
                  placeholder={lang === 'kn' ? 'ಬೆಳೆ ಹುಡುಕಿ (Areca, Coconut...)' : 'Search crop grade...'}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-hidden focus:border-[#c98a2b]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Crop Rates Cards Grid / List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRates.map((rate) => {
                const currentInput = editingPrice[rate.id] ?? rate.price;
                const isModified = editingPrice[rate.id] !== undefined && editingPrice[rate.id] !== rate.price;
                const isSaving = savingRateId === rate.id;
                const primaryName = lang === 'kn' ? rate.nameKn : rate.name;
                const secondaryName = lang === 'kn' ? rate.name : rate.nameKn;
                const categoryTitle = lang === 'kn' ? rate.categoryNameKn : rate.categoryName;

                return (
                  <div
                    key={rate.id}
                    className={`bg-white border rounded-xl p-4 transition-all shadow-xs flex flex-col justify-between gap-3 ${
                      isModified ? 'border-[#c98a2b] ring-2 ring-[#c98a2b]/20' : 'border-[#241c15]/15'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#2f4a3d]/10 text-[#2f4a3d] font-en-body uppercase">
                            {categoryTitle}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#20332a] font-kn-head mt-1">
                          {primaryName}
                        </h3>
                        <div className="text-xs text-gray-500 font-en-body">
                          {secondaryName} · Unit: {rate.unit || 'kg'}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-gray-400 font-en-body">
                          {lang === 'kn' ? 'ಪ್ರಸ್ತುತ ಲೈವ್ ದರ' : 'Current Live Price'}
                        </div>
                        <div className="text-xl font-extrabold text-[#20332a] font-mono tabular-nums">
                          ₹{rate.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Quick increment / decrement and input row */}
                    <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                      <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-1.5 overflow-x-auto py-0.5">
                        <button
                          type="button"
                          onClick={() => adjustPriceDelta(rate.id, rate.price, -10)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center transition-colors shrink-0"
                          title="Decrease by ₹10"
                        >
                          -10
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustPriceDelta(rate.id, rate.price, -5)}
                          className="w-7 h-7 sm:w-7 sm:h-8 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center transition-colors shrink-0"
                          title="Decrease by ₹5"
                        >
                          -5
                        </button>

                        <div className="flex items-center rounded border border-gray-300 overflow-hidden bg-white shadow-inner shrink-0">
                          <span className="bg-gray-50 px-1.5 sm:px-2 text-xs font-bold text-gray-500">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={currentInput}
                            onChange={(e) =>
                              setEditingPrice({
                                ...editingPrice,
                                [rate.id]: Number(e.target.value)
                              })
                            }
                            className="w-16 sm:w-20 px-1.5 py-1 text-sm sm:text-base font-bold text-[#20332a] font-mono focus:outline-hidden"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => adjustPriceDelta(rate.id, rate.price, 5)}
                          className="w-7 h-7 sm:w-7 sm:h-8 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center transition-colors shrink-0"
                          title="Increase by ₹5"
                        >
                          +5
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustPriceDelta(rate.id, rate.price, 10)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center transition-colors shrink-0"
                          title="Increase by ₹10"
                        >
                          +10
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSavePrice(rate.id)}
                        disabled={isSaving}
                        className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded text-xs font-bold transition-all shadow-xs min-h-[36px] ${
                          isModified
                            ? 'bg-[#c98a2b] hover:bg-[#a86f1c] text-[#20332a] animate-pulse'
                            : 'bg-[#2f4a3d] hover:bg-[#20332a] text-white'
                        }`}
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>
                          {isSaving
                            ? (lang === 'kn' ? 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...' : 'Saving...')
                            : isModified
                            ? (lang === 'kn' ? 'ದರ ಅಪ್‌ಡೇಟ್ ಮಾಡಿ' : 'Update Rate')
                            : (lang === 'kn' ? 'ಉಳಿಸಿ' : 'Save')}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: PRODUCTS ==================== */}
        {activeTab === 'products' && (
          <div className="space-y-5">
            <div className="bg-white border border-[#241c15]/15 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-kn-head text-[#20332a]">
                  {lang === 'kn' ? 'ಉತ್ಪನ್ನಗಳು & ದಾಸ್ತಾನು ನಿರ್ವಹಣೆ' : 'Products & Stock Management'}
                </h2>
                <p className="text-xs sm:text-sm text-[#5c4033] mt-1 font-kn-body">
                  {lang === 'kn'
                    ? 'ಅಂಗಡಿಯಲ್ಲಿ ಲಭ್ಯವಿರುವ ರಸಗೊಬ್ಬರ, ಪೋಷಕಾಂಶ ಮತ್ತು ಕೀಟನಾಶಕಗಳ ಬೆಲೆ ಹಾಗೂ ಸ್ಟಾಕ್ ಸ್ಥಿತಿ.'
                    : 'Manage retail prices and toggle in-stock / out-of-stock indicators for farm inputs.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-56">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder={lang === 'kn' ? 'ಉತ್ಪನ್ನ ಹುಡುಕಿ...' : 'Search products...'}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-hidden"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="bg-[#2f4a3d] hover:bg-[#20332a] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4 text-[#c98a2b]" />
                  <span>{lang === 'kn' ? 'ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಿ' : 'Add Product'}</span>
                </button>
              </div>
            </div>

            {/* Add product expandable card */}
            {showAddProduct && (
              <form
                onSubmit={handleAddNewProduct}
                className="bg-amber-50/80 border-2 border-[#c98a2b] rounded-xl p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-[#c98a2b]/30 pb-2">
                  <h3 className="font-bold text-sm text-[#20332a] font-kn-head">
                    {lang === 'kn' ? 'ಹೊಸ ಕೃಷಿ ಸಾಮಗ್ರಿ ಸೇರಿಸಿ' : 'Add New Agricultural Product'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="text-xs text-gray-500 hover:text-gray-800"
                  >
                    ✕ {lang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Product Title (English) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zinc Sulphate 21%"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-hidden text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ಕನ್ನಡ ಹೆಸರು (Kannada Name)</label>
                    <input
                      type="text"
                      placeholder="e.g. ಜಿಂಕ್ ಸಲ್ಫೇಟ್"
                      value={newProdNameKn}
                      onChange={(e) => setNewProdNameKn(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-hidden text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{lang === 'kn' ? 'ಮಾರಾಟ ಬೆಲೆ (₹) *' : 'Selling Price (₹) *'}</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 850"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-hidden text-sm font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{lang === 'kn' ? 'ಪ್ಯಾಕಿಂಗ್ (Pack Size) *' : 'Pack Size *'}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 50 kg / 1 Litre"
                      value={newProdPack}
                      onChange={(e) => setNewProdPack(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-hidden text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{lang === 'kn' ? 'ವರ್ಗ (Category)' : 'Category'}</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-hidden text-sm"
                    >
                      <option value="Fertilizer">Fertilizer (ಗೊಬ್ಬರ)</option>
                      <option value="Nutrient">Nutrient (ಪೋಷಕಾಂಶ)</option>
                      <option value="Plant Protection">Plant Protection (ರಕ್ಷಣೆ)</option>
                      <option value="Soil Conditioner">Soil Conditioner (ಸುಧಾರಕ)</option>
                      <option value="Adjuvant">Adjuvant (ಗಮ್/ಸ್ಪ್ರೆಡರ್)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-bold"
                  >
                    {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2f4a3d] hover:bg-[#20332a] text-white rounded text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#c98a2b]" />
                    <span>{lang === 'kn' ? 'ಉತ್ಪನ್ನ ಸೇರಿಸಿ' : 'Add Product'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Products Table / Cards */}
            <div className="bg-white border border-[#241c15]/15 rounded-xl overflow-hidden shadow-xs">
              <div className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const inputPrice = editingProdPrice[p.id] ?? p.price;
                  const isSaving = savingProdId === p.id;
                  const displayName = lang === 'kn' && p.nameKn ? `${p.nameKn} (${p.name})` : p.name;

                  return (
                    <div
                      key={p.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-12 rounded object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                            <Store className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-[#20332a] font-en-head">
                              {displayName}
                            </h4>
                            {p.category && (
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-en-body">
                                {p.category}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#8b3a3a] font-medium font-kn-body mt-0.5">
                            {lang === 'kn' ? 'ಪ್ಯಾಕಿಂಗ್' : 'Pack'}: <span className="text-gray-600">{p.packSize}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stock Toggle & Price Editor Controls */}
                      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        {/* Price Input */}
                        <div className="flex items-center rounded border border-gray-300 overflow-hidden bg-white">
                          <span className="bg-gray-50 px-2 py-1 text-xs font-bold text-gray-500">₹</span>
                          <input
                            type="number"
                            value={inputPrice}
                            onChange={(e) =>
                              setEditingProdPrice({
                                ...editingProdPrice,
                                [p.id]: Number(e.target.value)
                              })
                            }
                            className="w-20 px-2 py-1 text-sm font-bold text-[#20332a] font-mono focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveProductPrice(p)}
                            disabled={isSaving}
                            className="bg-[#2f4a3d] hover:bg-[#20332a] text-white px-2.5 py-1 text-xs font-bold flex items-center gap-1 transition-colors"
                            title="Save new price"
                          >
                            <Save className="w-3 h-3 text-[#c98a2b]" />
                          </button>
                        </div>

                        {/* Stock toggle button */}
                        <button
                          type="button"
                          onClick={() => handleToggleProduct(p.id, p.isAvailable)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                            p.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                              : 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300'
                          }`}
                        >
                          {p.isAvailable ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>{lang === 'kn' ? 'ಲಭ್ಯವಿದೆ (In Stock)' : 'In Stock'}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>{lang === 'kn' ? 'ಖಾಲಿಯಾಗಿದೆ (Out)' : 'Out of Stock'}</span>
                            </>
                          )}
                        </button>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: INQUIRIES ==================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-5">
            <div className="bg-white border border-[#241c15]/15 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-kn-head text-[#20332a]">
                  {lang === 'kn' ? 'ರೈತರ ಬೆಳೆ ಮಾರಾಟ ವಿಚಾರಣೆಗಳು' : 'Farmer Crop Selling Leads'}
                </h2>
                <p className="text-xs sm:text-sm text-[#5c4033] mt-1 font-kn-body">
                  {lang === 'kn'
                    ? 'ಮುಖಪುಟದಿಂದ ರೈತರು ಸಲ್ಲಿಸಿದ ಬೆಳೆ ವಿವರಗಳು. ತಕ್ಷಣವೇ ಅವರಿಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ WhatsApp ಮೂಲಕ ದರ ತಿಳಿಸಿ.'
                    : 'Leads submitted by farmers via the storefront. Call or message via WhatsApp directly.'}
                </p>
              </div>

              <div className="text-xs font-en-body text-gray-500">
                {lang === 'kn' ? 'ಒಟ್ಟು ವಿಚಾರಣೆಗಳು:' : 'Total Inquiries:'} <strong className="text-[#20332a] font-mono">{inquiries.length}</strong>
              </div>
            </div>

            {!user ? (
              <div className="bg-white border border-[#241c15]/15 rounded-xl p-8 sm:p-12 text-center text-[#20332a] shadow-xs">
                <Shield className="w-12 h-12 text-[#c98a2b] mx-auto mb-3" />
                <h3 className="text-lg font-bold font-kn-head">
                  {lang === 'kn' ? 'ರೈತರ ವಿಚಾರಣೆಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಲಾಗಿನ್ ಅಗತ್ಯವಿದೆ' : 'Sign In Required to View Farmer Leads'}
                </h3>
                <p className="text-xs sm:text-sm text-[#5c4033] mt-1 max-w-md mx-auto font-kn-body">
                  {lang === 'kn'
                    ? 'ರೈತರ ಫೋನ್ ನಂಬರ್ ಮತ್ತು ವೈಯಕ್ತಿಕ ವಿವರಗಳ ಸುರಕ್ಷತೆಗಾಗಿ, ಕೇವಲ ಲಾಗಿನ್ ಆದ ಅಂಗಡಿ ನಿರ್ವಾಹಕರು ಮಾತ್ರ ಈ ಮಾಹಿತಿಯನ್ನು ವೀಕ್ಷಿಸಬಹುದು.'
                    : 'To protect farmer privacy and contact details, please sign in with Google to view customer inquiries.'}
                </p>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="mt-4 bg-[#c98a2b] hover:bg-[#a86f1c] text-[#20332a] font-bold px-6 py-2.5 rounded-lg text-sm inline-flex items-center gap-2 shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'Google ಮೂಲಕ ಲಾಗಿನ್ ಆಗಿ' : 'Sign In with Google'}</span>
                </button>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-500 text-sm">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-semibold text-gray-700">
                  {lang === 'kn' ? 'ಯಾವುದೇ ಹೊಸ ವಿಚಾರಣೆಗಳು ಬಂದಿಲ್ಲ' : 'No inquiries received yet'}
                </p>
                <p className="text-xs mt-1">
                  {lang === 'kn'
                    ? 'ಮುಖಪುಟದಲ್ಲಿ ರೈತರು ಫಾರ್ಮ್ ಭರ್ತಿ ಮಾಡಿದ ತಕ್ಷಣ ಇಲ್ಲಿ ಪ್ರಕಟಗೊಳ್ಳುತ್ತದೆ.'
                    : 'Submissions through the farmer inquiry form on the storefront will appear here live.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`bg-white border rounded-xl p-4 sm:p-5 transition-all shadow-xs space-y-3 ${
                      inq.status === 'pending'
                        ? 'border-amber-400 ring-2 ring-amber-400/20'
                        : 'border-[#241c15]/15'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-lg font-bold text-[#20332a] font-kn-head">
                          {inq.farmerName}
                        </span>
                        {inq.village && (
                          <span className="text-xs text-gray-500 ml-2">
                            {lang === 'kn' ? 'ಸ್ಥಳ:' : 'Location:'} <strong>{inq.village}</strong>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 font-mono">
                          {new Date(inq.createdAt).toLocaleDateString()} {new Date(inq.createdAt).toLocaleTimeString()}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            inq.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inq.status === 'contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {inq.status === 'pending' ? (lang === 'kn' ? 'ಹೊಸದು' : 'Pending') : inq.status === 'contacted' ? (lang === 'kn' ? 'ಸಂಪರ್ಕಿಸಲಾಗಿದೆ' : 'Contacted') : (lang === 'kn' ? 'ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Completed')}
                        </span>
                      </div>
                    </div>

                    {/* Inquiry Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div className="p-3 bg-[#f6f1e2]/60 rounded-lg">
                        <span className="text-gray-500 text-xs block">
                          {lang === 'kn' ? 'ಮಾರಾಟಕ್ಕೆ ನೀಡಿದ ಬೆಳೆ:' : 'Offered Crop:'}
                        </span>
                        <strong className="text-[#20332a] text-base">{inq.cropType}</strong>
                      </div>

                      <div className="p-3 bg-[#f6f1e2]/60 rounded-lg">
                        <span className="text-gray-500 text-xs block">
                          {lang === 'kn' ? 'ಅಂದಾಜು ಪ್ರಮಾಣ / ತೂಕ:' : 'Quantity / Weight:'}
                        </span>
                        <strong className="text-[#20332a] text-base">{inq.estimatedQuantity || (lang === 'kn' ? 'ತಿಳಿಸಿಲ್ಲ' : 'Not specified')}</strong>
                      </div>

                      {inq.notes && (
                        <div className="sm:col-span-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 text-xs">
                          <span className="text-gray-400 block mb-0.5">
                            {lang === 'kn' ? 'ರೈತರ ಹೆಚ್ಚುವರಿ ಟಿಪ್ಪಣಿ:' : 'Farmer Notes:'}
                          </span>
                          <p>{inq.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Bar: Call, WhatsApp & Status change */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`tel:${inq.phone}`}
                          className="inline-flex items-center gap-1.5 bg-[#2f4a3d] hover:bg-[#20332a] text-white px-3.5 py-1.5 rounded text-xs font-bold transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#c98a2b]" />
                          <span>{lang === 'kn' ? 'ಕರೆ:' : 'Call:'} {inq.phone}</span>
                        </a>

                        <a
                          href={`https://wa.me/91${inq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            lang === 'kn'
                              ? `ನಮಸ್ಕಾರ ${inq.farmerName} ಅವರೇ, ಕೆನರಾ ಟ್ರೇಡರ್ಸ್ ಸುಳ್ಯದಿಂದ ಆಕರ್ಷ್ ಯೆರ್ಮೆಟ್ಟಿ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ. ನೀವು ಸಲ್ಲಿಸಿದ "${inq.cropType}" ವಿಚಾರಣೆಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಸಂದೇಶ ಕಳುಹಿಸುತ್ತಿದ್ದೇನೆ.`
                              : `Hello ${inq.farmerName}, this is Akarsh Yermetti from Canara Traders Sullia regarding your "${inq.cropType}" selling inquiry.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebd5a] text-[#0b3d24] px-3.5 py-1.5 rounded text-xs font-bold transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-gray-400 text-[11px]">{lang === 'kn' ? 'ಸ್ಥಿತಿ ಬದಲಾಯಿಸಿ:' : 'Set Status:'}</span>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(inq.id, 'contacted')}
                          className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                        >
                          {lang === 'kn' ? 'ಸಂಪರ್ಕಿಸಲಾಗಿದೆ' : 'Contacted'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(inq.id, 'completed')}
                          className="px-2.5 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold"
                        >
                          {lang === 'kn' ? 'ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Completed'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 4: SHOP CONFIG ==================== */}
        {activeTab === 'config' && (
          <div className="max-w-2xl bg-white border border-[#241c15]/15 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-kn-head text-[#20332a]">
                {lang === 'kn' ? 'ಅಂಗಡಿ ಮಾಹಿತಿ ಮತ್ತು ದೈನಂದಿನ ಪ್ರಕಟಣೆ' : 'Shop Details & Daily Notice'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5c4033] mt-1 font-kn-body">
                {lang === 'kn'
                  ? 'ಮುಖಪುಟದಲ್ಲಿ ತೋರಿಸಲಾಗುವ ಅಂಗಡಿ ವಿವರಗಳು, ವಿಳಾಸ ಹಾಗೂ ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ಪ್ರಕಟಣೆ.'
                  : 'Configure proprietor information, contact numbers, address, and daily broadcast announcements.'}
              </p>
            </div>

            <form onSubmit={handleSaveShopConfig} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#20332a] mb-1 font-kn-body">
                  ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ಸೂಚನೆ / ಪ್ರಕಟಣೆ (Daily Notice in Kannada)
                </label>
                <textarea
                  rows={3}
                  value={editingConfig.announcementKn || ''}
                  onChange={(e) => setEditingConfig({ ...editingConfig, announcementKn: e.target.value })}
                  placeholder="ಉದಾ: ಕ್ಯಾಂಪ್ಕೋ ದರದಂತೆ ಇಂದಿನ ಅಡಿಕೆ ಖರೀದಿ ಪ್ರಾರಂಭವಾಗಿದೆ..."
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-hidden focus:border-[#c98a2b] font-kn-body text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-[#20332a] mb-1 font-en-body">
                  Market Announcement (English)
                </label>
                <textarea
                  rows={2}
                  value={editingConfig.announcement || ''}
                  onChange={(e) => setEditingConfig({ ...editingConfig, announcement: e.target.value })}
                  placeholder="Daily purchase rates based on Mangaluru & CAMPCO markets..."
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-hidden focus:border-[#c98a2b] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#20332a] mb-1 font-kn-body">{lang === 'kn' ? 'ಮಾಲೀಕರ ಹೆಸರು' : 'Owner Name'}</label>
                  <input
                    type="text"
                    value={editingConfig.ownerName}
                    onChange={(e) => setEditingConfig({ ...editingConfig, ownerName: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#20332a] mb-1 font-kn-body">{lang === 'kn' ? 'ಅಂಗಡಿ ಹೆಸರು' : 'Shop Name'}</label>
                  <input
                    type="text"
                    value={editingConfig.shopName}
                    onChange={(e) => setEditingConfig({ ...editingConfig, shopName: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#20332a] mb-1 font-kn-body">{lang === 'kn' ? 'ಫೋನ್ ಸಂಖ್ಯೆ' : 'Phone Number'}</label>
                  <input
                    type="text"
                    value={editingConfig.phone}
                    onChange={(e) => setEditingConfig({ ...editingConfig, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#20332a] mb-1 font-kn-body">WhatsApp {lang === 'kn' ? 'ಸಂಖ್ಯೆ' : 'Number'}</label>
                  <input
                    type="text"
                    value={editingConfig.whatsapp}
                    onChange={(e) => setEditingConfig({ ...editingConfig, whatsapp: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#20332a] mb-1 font-kn-body">{lang === 'kn' ? 'ವಿಳಾಸ (Address)' : 'Shop Address'}</label>
                <textarea
                  rows={2}
                  value={editingConfig.address}
                  onChange={(e) => setEditingConfig({ ...editingConfig, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#2f4a3d] hover:bg-[#20332a] text-white font-bold px-6 py-2.5 rounded-md text-sm transition-transform hover:-translate-y-0.5 shadow-sm"
                >
                  <Save className="w-4 h-4 text-[#c98a2b]" />
                  <span>{lang === 'kn' ? 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
