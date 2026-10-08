import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  LogIn,
  LogOut,
  Database,
  RefreshCw,
  Edit2,
  Check,
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
  Sparkles
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

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  rates: CropRateItem[];
  products: ProductItem[];
  config: ShopConfig;
  isDbConnected: boolean;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  user,
  rates,
  products,
  config,
  isDbConnected
}) => {
  const [activeTab, setActiveTab] = useState<'rates' | 'products' | 'inquiries' | 'config'>('rates');
  const [inquiries, setInquiries] = useState<FarmerInquiry[]>([]);
  const [editingPrice, setEditingPrice] = useState<Record<string, number>>({});
  const [editingProdPrice, setEditingProdPrice] = useState<Record<string, number>>({});
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ShopConfig>(config);

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

  // Subscribe to farmer inquiries when admin modal opens and user is signed in
  useEffect(() => {
    if (!isOpen || !user) return;
    try {
      const unsub = subscribeToInquiries(
        (data) => setInquiries(data),
        (err) => console.warn('Inquiries subscription err (may require permissions):', err)
      );
      return () => unsub();
    } catch (e) {
      console.warn('Inquiries err:', e);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      showToast('ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ! / Signed in successfully.');
    } catch (error) {
      console.error(error);
      showToast('ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ / Login failed. Please retry.', 'error');
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      showToast('ಸೈನ್ ಔಟ್ ಆಗಿದೆ / Signed out.');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSyncDefaults = async () => {
    if (!user) {
      showToast('ಡೇಟಾಬೇಸ್ ಸಿಂಕ್ ಮಾಡಲು ಮೊದಲು ಲಾಗಿನ್ ಆಗಿ / Please login with Google first.', 'error');
      return;
    }
    setSyncing(true);
    try {
      await resetDatabaseToDefaults();
      showToast('ಎಲ್ಲಾ ದರಗಳು ಮತ್ತು ಉತ್ಪನ್ನಗಳನ್ನು Firestore ಡೇಟಾಬೇಸ್‌ಗೆ ಸಿಂಕ್ ಮಾಡಲಾಗಿದೆ!');
    } catch (error) {
      console.error(error);
      showToast('ಸಿಂಕ್ ಮಾಡುವಲ್ಲಿ ದೋಷ ಉಂಟಾಗಿದೆ / Sync error.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleSavePrice = async (rateId: string) => {
    const newP = editingPrice[rateId];
    if (newP === undefined || newP < 0) return;
    try {
      await updateCropPrice(rateId, newP);
      showToast(`ದರ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ: ₹${newP}`);
    } catch (error) {
      console.error(error);
      showToast('ದರ ನವೀಕರಿಸಲು ದೋಷ / Update failed.', 'error');
    }
  };

  const handleToggleProduct = async (prodId: string, current: boolean) => {
    try {
      await toggleProductAvailability(prodId, !current);
      showToast(`ದಾಸ್ತಾನು ಸ್ಥಿತಿ ಬದಲಾಗಿದೆ / Stock status updated.`);
    } catch (error) {
      console.error(error);
      showToast('ಅಪ್‌ಡೇಟ್ ದೋಷ / Failed to toggle stock.', 'error');
    }
  };

  const handleSaveProductPrice = async (prod: ProductItem) => {
    const p = editingProdPrice[prod.id];
    if (p === undefined) return;
    try {
      await saveProduct({ ...prod, price: p });
      showToast(`ಉತ್ಪನ್ನ ಬೆಲೆ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ: ₹${p}`);
    } catch (error) {
      console.error(error);
      showToast('ಬೆಲೆ ನವೀಕರಿಸಲು ದೋಷ.', 'error');
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
      showToast('ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಲಾಗಿದೆ!');
    } catch (error) {
      console.error(error);
      showToast('ಉತ್ಪನ್ನ ಸೇರಿಸುವಲ್ಲಿ ದೋಷ.', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('ಈ ಉತ್ಪನ್ನವನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ? / Delete product?')) return;
    try {
      await deleteProduct(id);
      showToast('ಉತ್ಪನ್ನ ಅಳಿಸಲಾಗಿದೆ / Deleted.');
    } catch (error) {
      console.error(error);
      showToast('ಅಳಿಸುವಲ್ಲಿ ದೋಷ.', 'error');
    }
  };

  const handleSaveShopConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveShopConfig(editingConfig);
      showToast('ಅಂಗಡಿ ಮಾಹಿತಿ ಮತ್ತು ಸೂಚನೆ ನವೀಕರಿಸಲಾಗಿದೆ!');
    } catch (error) {
      console.error(error);
      showToast('ನವೀಕರಿಸುವಲ್ಲಿ ದೋಷ.', 'error');
    }
  };

  const handleStatusChange = async (inqId: string, status: 'pending' | 'contacted' | 'completed') => {
    try {
      await updateInquiryStatus(inqId, status);
      showToast('ಸ್ಥಿತಿ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ!');
    } catch (error) {
      console.error(error);
      showToast('ಸ್ಥಿತಿ ಬದಲಾವಣೆಯಲ್ಲಿ ದೋಷ.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border-2 border-[#2f4a3d]">
        {/* Modal Header */}
        <div className="bg-[#2f4a3d] text-white px-5 py-4 flex items-center justify-between border-b-2 border-[#c98a2b]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#c98a2b]" />
            <div>
              <h3 className="font-bold text-base sm:text-lg font-kn-head">
                ಅಂಗಡಿ ವ್ಯವಸ್ಥಾಪಕ ಪೋರ್ಟಲ್ · Shop Manager Desk
              </h3>
              <p className="text-xs text-[#efe7d2] font-en-body">
                Canara Traders, Sullia — Live Firestore Control
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Status & Auth Bar */}
        <div className="bg-[#efe7d2] px-5 py-3 border-b border-[#241c15]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-[#20332a]">
              <Database className="w-3.5 h-3.5 text-[#c98a2b]" />
              Database: <span className="text-emerald-700">Online (Firestore)</span>
            </span>

            {user ? (
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium border border-emerald-300">
                ಅಧಿಕೃತ ಬಳಕೆದಾರ: {user.email || user.displayName}
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium border border-amber-300">
                ವೀಕ್ಷಕ ಮೋಡ್ (ಡೇಟಾಬೇಸ್ ಬರೆಯಲು Google ಲಾಗಿನ್ ಅಗತ್ಯವಿದೆ)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={handleSyncDefaults}
                  disabled={syncing}
                  className="bg-[#20332a] hover:bg-black text-[#c98a2b] font-bold px-3 py-1 rounded transition-colors flex items-center gap-1"
                  title="Push default crop rates and products into Firestore"
                >
                  <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...' : 'ಡೇಟಾಬೇಸ್ ಸಿಂಕ್'}</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-3 py-1 rounded transition-colors flex items-center gap-1 border border-red-200"
                >
                  <LogOut className="w-3 h-3" />
                  <span>ಲಾಗೌಟ್</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="bg-[#2f4a3d] hover:bg-[#20332a] text-[#efe7d2] font-bold px-3.5 py-1.5 rounded transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-[#c98a2b]" />
                <span>Google ಲಾಗಿನ್ (Akarsh / Staff)</span>
              </button>
            )}
          </div>
        </div>

        {/* Toast status banner */}
        {statusMessage && (
          <div
            className={`px-5 py-2 text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-red-50 text-red-800 border-b border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-[#f6f1e2] px-5 pt-3 border-b border-[#241c15]/10 flex gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-4 py-2 rounded-t-md transition-colors ${
              activeTab === 'rates'
                ? 'bg-white text-[#2f4a3d] border-t-2 border-[#c98a2b] shadow-xs'
                : 'text-[#5c4033] hover:text-[#20332a]'
            }`}
          >
            ಬೆಳೆ ದರ ಪರಿಷ್ಕರಣೆ ({rates.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-t-md transition-colors ${
              activeTab === 'products'
                ? 'bg-white text-[#2f4a3d] border-t-2 border-[#c98a2b] shadow-xs'
                : 'text-[#5c4033] hover:text-[#20332a]'
            }`}
          >
            ಉತ್ಪನ್ನಗಳು & ಸ್ಟಾಕ್ ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-t-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'inquiries'
                ? 'bg-white text-[#2f4a3d] border-t-2 border-[#c98a2b] shadow-xs'
                : 'text-[#5c4033] hover:text-[#20332a]'
            }`}
          >
            <span>ರೈತರ ವಿಚಾರಣೆಗಳು</span>
            {inquiries.filter(i => i.status === 'pending').length > 0 && (
              <span className="bg-[#8b3a3a] text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {inquiries.filter(i => i.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-t-md transition-colors ${
              activeTab === 'config'
                ? 'bg-white text-[#2f4a3d] border-t-2 border-[#c98a2b] shadow-xs'
                : 'text-[#5c4033] hover:text-[#20332a]'
            }`}
          >
            ಅಂಗಡಿ ಮಾಹಿತಿ & ಸೂಚನೆ
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 flex-1 overflow-y-auto bg-white">
          {/* TAB 1: CROP RATES */}
          {activeTab === 'rates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-[#20332a]">
                    ಇಂದಿನ ಖರೀದಿ ದರ ಪರಿಷ್ಕರಣೆ (Daily Crop Purchase Rates)
                  </h4>
                  <p className="text-xs text-gray-500">
                    ಇಲ್ಲಿ ನೀವು ಬದಲಾಯಿಸಿದ ದರಗಳು ತಕ್ಷಣವೇ ಎಲ್ಲಾ ರೈತರ ಮೊಬೈಲ್ ಮತ್ತು ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಲೈವ್ ಆಗುತ್ತವೆ.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
                {rates.map((rate) => {
                  const currentInput = editingPrice[rate.id] ?? rate.price;
                  return (
                    <div
                      key={rate.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {rate.categoryNameKn}
                        </span>
                        <div>
                          <div className="font-bold text-sm text-[#20332a]">
                            {rate.nameKn} <span className="font-normal text-xs text-gray-500">({rate.name})</span>
                          </div>
                          <div className="text-[11px] text-gray-400">
                            ಕೊನೆಯ ನವೀಕರಣ: {new Date(rate.updatedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded border border-gray-300 overflow-hidden">
                          <span className="bg-gray-100 px-2 py-1 text-xs text-gray-500 font-bold">₹</span>
                          <input
                            type="number"
                            value={currentInput}
                            onChange={(e) =>
                              setEditingPrice({
                                ...editingPrice,
                                [rate.id]: Number(e.target.value)
                              })
                            }
                            className="w-24 px-2 py-1 text-sm font-bold text-[#20332a] focus:outline-hidden"
                          />
                          <span className="bg-gray-100 px-2 py-1 text-xs text-gray-500">/ ಕೆಜಿ</span>
                        </div>

                        <button
                          onClick={() => handleSavePrice(rate.id)}
                          className="bg-[#2f4a3d] hover:bg-[#20332a] text-white text-xs font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                        >
                          <Save className="w-3 h-3 text-[#c98a2b]" />
                          <span>ಉಳಿಸಿ</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS & STOCK */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-[#20332a]">
                    ಉತ್ಪನ್ನಗಳ ಪಟ್ಟಿ ಮತ್ತು ದಾಸ್ತಾನು (Stock & Price Management)
                  </h4>
                  <p className="text-xs text-gray-500">
                    ದಾಸ್ತಾನು ಮುಗಿದ ಉತ್ಪನ್ನಗಳನ್ನು 'ಖಾಲಿಯಾಗಿದೆ' ಎಂದು ಗುರುತಿಸಬಹುದು.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="bg-[#2f4a3d] hover:bg-[#20332a] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#c98a2b]" />
                  <span>ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಿ</span>
                </button>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <form
                  onSubmit={handleAddNewProduct}
                  className="bg-amber-50/60 border border-amber-200 rounded-lg p-4 space-y-3"
                >
                  <h5 className="font-bold text-xs text-[#20332a] uppercase">ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಿ</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="ಉತ್ಪನ್ನ ಹೆಸರು (e.g. Zinc Sulphate)"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="bg-white border border-gray-300 rounded px-2.5 py-1.5 focus:outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="ಕನ್ನಡ ಹೆಸರು (e.g. ಜಿಂಕ್ ಸಲ್ಫೇಟ್)"
                      value={newProdNameKn}
                      onChange={(e) => setNewProdNameKn(e.target.value)}
                      className="bg-white border border-gray-300 rounded px-2.5 py-1.5 focus:outline-hidden"
                    />
                    <input
                      type="number"
                      required
                      placeholder="ಬೆಲೆ ₹"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="bg-white border border-gray-300 rounded px-2.5 py-1.5 focus:outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="ಪ್ಯಾಕ್ ಗಾತ್ರ (e.g. 25 kg / 1 L)"
                      value={newProdPack}
                      onChange={(e) => setNewProdPack(e.target.value)}
                      className="bg-white border border-gray-300 rounded px-2.5 py-1.5 focus:outline-hidden"
                    />
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="bg-white border border-gray-300 rounded px-2.5 py-1.5 focus:outline-hidden"
                    >
                      <option value="Fertilizer">Fertilizer (ಗೊಬ್ಬರ)</option>
                      <option value="Nutrient">Nutrient (ಪೋಷಕಾಂಶ)</option>
                      <option value="Plant Protection">Plant Protection (ರಕ್ಷಣೆ)</option>
                      <option value="Soil Conditioner">Soil Conditioner (ಸುಧಾರಕ)</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-[#2f4a3d] text-white px-4 py-1.5 rounded font-bold hover:bg-[#20332a]"
                      >
                        ಸೇರಿಸಿ
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddProduct(false)}
                        className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300"
                      >
                        ರದ್ದು
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Products List */}
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {products.map((p) => {
                  const inputPrice = editingProdPrice[p.id] ?? p.price;
                  return (
                    <div
                      key={p.id}
                      className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 text-xs"
                    >
                      <div>
                        <div className="font-bold text-sm text-[#20332a]">
                          {p.name} {p.nameKn && <span className="text-[#8b3a3a]">({p.nameKn})</span>}
                        </div>
                        <div className="text-gray-500">
                          {p.category || 'General'} · ಪ್ಯಾಕ್: {p.packSize}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded border border-gray-300 overflow-hidden">
                          <span className="bg-gray-100 px-1.5 py-1 text-gray-500 font-bold">₹</span>
                          <input
                            type="number"
                            value={inputPrice}
                            onChange={(e) =>
                              setEditingProdPrice({
                                ...editingProdPrice,
                                [p.id]: Number(e.target.value)
                              })
                            }
                            className="w-20 px-1.5 py-1 font-bold text-[#20332a] focus:outline-hidden"
                          />
                        </div>

                        <button
                          onClick={() => handleSaveProductPrice(p)}
                          className="bg-[#2f4a3d] hover:bg-[#20332a] text-white font-bold px-2 py-1 rounded"
                          title="Save price"
                        >
                          <Save className="w-3 h-3 text-[#c98a2b]" />
                        </button>

                        <button
                          onClick={() => handleToggleProduct(p.id, p.isAvailable)}
                          className={`px-2.5 py-1 rounded font-bold transition-colors ${
                            p.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {p.isAvailable ? '✓ ಲಭ್ಯವಿದೆ' : '✕ ಖಾಲಿಯಾಗಿದೆ'}
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-[#20332a]">
                    ರೈತರ ಬೆಳೆ ಮಾರಾಟ ವಿಚಾರಣೆಗಳು (Farmer Inquiries)
                  </h4>
                  <p className="text-xs text-gray-500">
                    ವೆಬ್‌ಸೈಟ್ ಮೂಲಕ ರೈತರು ಸಲ್ಲಿಸಿದ ಬೆಳೆ ವಿವರಗಳು ಮತ್ತು ಫೋನ್ ನಂಬರ್‌ಗಳು.
                  </p>
                </div>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg text-gray-500 text-xs">
                  ಯಾವುದೇ ಹೊಸ ವಿಚಾರಣೆಗಳು ಬಂದಿಲ್ಲ (No inquiries yet).
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="border border-gray-200 rounded-lg p-3.5 text-xs space-y-2 hover:border-[#c98a2b] transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                          <strong className="text-sm text-[#20332a] font-bold">{inq.farmerName}</strong>
                          {inq.village && <span className="text-gray-500">({inq.village})</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-400">
                            {new Date(inq.createdAt).toLocaleString()}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              inq.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inq.status === 'contacted'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                        <div>
                          <strong>ಬೆಳೆ:</strong> {inq.cropType}
                        </div>
                        {inq.estimatedQuantity && (
                          <div>
                            <strong>ತೂಕ:</strong> {inq.estimatedQuantity}
                          </div>
                        )}
                        {inq.notes && (
                          <div className="sm:col-span-2 text-gray-600 bg-gray-50 p-2 rounded">
                            <strong>ಟಿಪ್ಪಣಿ:</strong> {inq.notes}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${inq.phone}`}
                            className="bg-[#2f4a3d] text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 hover:bg-[#20332a]"
                          >
                            <Phone className="w-3 h-3 text-[#c98a2b]" />
                            <span>ಕರೆ: {inq.phone}</span>
                          </a>

                          <a
                            href={`https://wa.me/91${inq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `ನಮಸ್ಕಾರ ${inq.farmerName} ಅವರೇ, ಕೆನರಾ ಟ್ರೇಡರ್ಸ್‌ನಿಂದ ಆಕರ್ಷ್ ಯೆರ್ಮೆಟ್ಟಿ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ. ನಿಮ್ಮ "${inq.cropType}" ಮಾರಾಟ ವಿಚಾರಣೆಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಸಂದೇಶ ಕಳುಹಿಸುತ್ತಿದ್ದೇನೆ.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] text-[#0b3d24] px-2.5 py-1 rounded font-bold flex items-center gap-1 hover:bg-[#1ebd5a]"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </div>

                        {/* Status Change buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStatusChange(inq.id, 'contacted')}
                            className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px]"
                          >
                            ಸಂಪರ್ಕಿಸಲಾಗಿದೆ
                          </button>
                          <button
                            onClick={() => handleStatusChange(inq.id, 'completed')}
                            className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded text-[11px] font-bold"
                          >
                            ಪೂರ್ಣಗೊಂಡಿದೆ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SHOP CONFIG & ANNOUNCEMENT */}
          {activeTab === 'config' && (
            <form onSubmit={handleSaveShopConfig} className="space-y-4 max-w-xl">
              <div>
                <h4 className="font-bold text-base text-[#20332a]">
                  ಅಂಗಡಿ ಮಾಹಿತಿ ಮತ್ತು ದೈನಂದಿನ ಸೂಚನೆ
                </h4>
                <p className="text-xs text-gray-500">
                  ಮುಖಪುಟದಲ್ಲಿ ತೋರಿಸಲಾಗುವ ಮಾಲೀಕರ ವಿವರಗಳು ಹಾಗೂ ಮಾರುಕಟ್ಟೆ ಸಂದೇಶ.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    ಇಂದಿನ ಪ್ರಕಟಣೆ / ಮಾರುಕಟ್ಟೆ ಸೂಚನೆ (Kannada)
                  </label>
                  <textarea
                    rows={2}
                    value={editingConfig.announcementKn || ''}
                    onChange={(e) => setEditingConfig({ ...editingConfig, announcementKn: e.target.value })}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Announcement Notice (English)
                  </label>
                  <textarea
                    rows={2}
                    value={editingConfig.announcement || ''}
                    onChange={(e) => setEditingConfig({ ...editingConfig, announcement: e.target.value })}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ಮಾಲೀಕರ ಹೆಸರು</label>
                    <input
                      type="text"
                      value={editingConfig.ownerName}
                      onChange={(e) => setEditingConfig({ ...editingConfig, ownerName: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ಫೋನ್ ಸಂಖ್ಯೆ</label>
                    <input
                      type="text"
                      value={editingConfig.phone}
                      onChange={(e) => setEditingConfig({ ...editingConfig, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">WhatsApp ಸಂಖ್ಯೆ</label>
                    <input
                      type="text"
                      value={editingConfig.whatsapp}
                      onChange={(e) => setEditingConfig({ ...editingConfig, whatsapp: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ಅಂಗಡಿ ವಿಳಾಸ</label>
                    <input
                      type="text"
                      value={editingConfig.address}
                      onChange={(e) => setEditingConfig({ ...editingConfig, address: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#2f4a3d] hover:bg-[#20332a] text-white font-bold px-5 py-2 rounded text-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-[#c98a2b]" />
                  <span>ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
