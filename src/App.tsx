import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, testConnection } from './firebase';
import {
  subscribeToCropRates,
  subscribeToProducts,
  subscribeToShopConfig,
  seedInitialDatabaseIfEmpty
} from './services/dbService';
import { CropRateItem, ProductItem, ShopConfig } from './types';
import { DEFAULT_CROP_RATES, DEFAULT_PRODUCTS, DEFAULT_SHOP_CONFIG } from './defaultData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { RateBoard } from './components/RateBoard';
import { ProductsShelf } from './components/ProductsShelf';
import { InquiryForm } from './components/InquiryForm';
import { ContactSection } from './components/ContactSection';
import { AdminDashboard } from './components/AdminDashboard';
import { Shield, Database } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [rates, setRates] = useState<CropRateItem[]>(DEFAULT_CROP_RATES);
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [config, setConfig] = useState<ShopConfig>(DEFAULT_SHOP_CONFIG);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [selectedCropForSale, setSelectedCropForSale] = useState<string>('');

  // 1. Sync with URL hash for direct #admin route navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('store');
      }
    };

    // Check initial hash
    if (window.location.hash === '#admin') {
      setCurrentView('admin');
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = '#admin';
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStore = () => {
    window.location.hash = '';
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Initial Connection Test per Firebase Skill Guidelines
  useEffect(() => {
    async function checkServer() {
      const ok = await testConnection();
      setIsDbConnected(ok);
    }
    checkServer();
  }, []);

  // 3. Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // If an authenticated manager logs in, check if seed is needed
        seedInitialDatabaseIfEmpty();
      }
    });
    return () => unsubscribe();
  }, []);

  // 4. Real-time Firestore subscriptions for Rates, Products, and Config
  useEffect(() => {
    const unsubRates = subscribeToCropRates(
      (data) => {
        if (data.length > 0) {
          setRates(data);
        } else {
          setRates(DEFAULT_CROP_RATES);
        }
        setIsDbConnected(true);
      },
      (err) => {
        console.warn('Rates listener using fallback defaults:', err);
      }
    );

    const unsubProducts = subscribeToProducts(
      (data) => {
        if (data.length > 0) {
          setProducts(data);
        } else {
          setProducts(DEFAULT_PRODUCTS);
        }
        setIsDbConnected(true);
      },
      (err) => {
        console.warn('Products listener using fallback defaults:', err);
      }
    );

    const unsubConfig = subscribeToShopConfig(
      (data) => {
        setConfig(data || DEFAULT_SHOP_CONFIG);
        setIsDbConnected(true);
      },
      (err) => {
        console.warn('Config listener using fallback defaults:', err);
      }
    );

    return () => {
      unsubRates();
      unsubProducts();
      unsubConfig();
    };
  }, []);

  const handleSelectCropForSale = (cropName: string) => {
    setSelectedCropForSale(cropName);
    const el = document.getElementById('sell');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If viewing dedicated Admin Dashboard Page
  if (currentView === 'admin') {
    return (
      <AdminDashboard
        user={user}
        rates={rates}
        products={products}
        config={config}
        isDbConnected={isDbConnected}
        onBackToStore={navigateToStore}
      />
    );
  }

  // Customer Storefront View
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f1e2] text-[#241c15] selection:bg-[#c98a2b] selection:text-[#20332a] w-full max-w-full overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenAdmin={navigateToAdmin}
        isDbConnected={isDbConnected}
      />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* Hero Banner */}
        <Hero
          config={config}
          onOpenAdmin={navigateToAdmin}
        />

        {/* About Section: Who we are */}
        <AboutSection />

        {/* Live Crop Rate Board */}
        <RateBoard
          rates={rates}
          onSelectCropForSale={handleSelectCropForSale}
          isDbConnected={isDbConnected}
          onOpenAdmin={navigateToAdmin}
        />

        {/* Farm Inputs Products Shelf */}
        <ProductsShelf
          products={products}
          config={config}
          onOpenAdmin={navigateToAdmin}
        />

        {/* Farmer Selling Inquiry Form */}
        <InquiryForm
          selectedCrop={selectedCropForSale}
          onClearCropSelection={() => setSelectedCropForSale('')}
          config={config}
        />

        {/* Contact & Location Section */}
        <ContactSection
          config={config}
          onOpenAdmin={navigateToAdmin}
        />
      </main>

      {/* Footer */}
      <footer className="bg-[#20332a] text-[#cfd9ce] border-t-2 border-[#c98a2b] py-8 text-xs font-en-body">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="font-kn-head text-lg font-bold text-white tracking-wide">
              {config.shopNameKn} / {config.shopName}
            </span>
            <span className="text-[11px] text-[#efe7d2]/70 mt-0.5 font-kn-body">
              ರೈತರಿಂದ ನೇರವಾಗಿ ನಿಮಗೆ · Sullia, Dakshina Kannada – 574239
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[#efe7d2]/80">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#c98a2b]" />
              <span>Firestore Realtime</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={navigateToAdmin}
              className="text-[#c98a2b] hover:underline flex items-center gap-1 font-bold bg-black/30 hover:bg-black/50 px-2.5 py-1 rounded transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ಅಂಗಡಿ ನಿರ್ವಹಣಾ ಪುಟ (#admin)</span>
            </button>
          </div>

          <div className="text-center sm:text-right text-[11px] text-[#efe7d2]/50">
            &copy; {new Date().getFullYear()} {config.shopName}. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating Quick Admin Badge on Mobile & Desktop */}
      <aside aria-label="Admin Page Quick Access" className="fixed bottom-4 right-4 z-40">
        <button
          onClick={navigateToAdmin}
          className="group flex items-center gap-2 bg-[#20332a] hover:bg-black text-[#c98a2b] border-2 border-[#c98a2b] px-3.5 py-2.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
          title="Open Admin Page to update rates, stock, and inquiries"
        >
          <Shield className="w-4 h-4 text-[#c98a2b] group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold text-white">Admin Page</span>
          <span className="text-[10px] bg-[#c98a2b] text-[#20332a] font-extrabold px-1.5 py-0.2 rounded-full font-mono">
            #admin
          </span>
        </button>
      </aside>
    </div>
  );
}
