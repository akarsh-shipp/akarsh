import React, { useState } from 'react';
import { Database, Shield, Menu, X, ArrowRight, Languages } from 'lucide-react';
import { User } from 'firebase/auth';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  user: User | null;
  onOpenAdmin: () => void;
  isDbConnected: boolean;
  isAdminView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAdmin,
  isDbConnected,
  isAdminView = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, toggleLang, t } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 bg-[#2f4a3d] border-b-4 border-[#c98a2b] shadow-md">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
        {/* Zone 1: Clean Brand Wordmark */}
        <a href="#" className="flex flex-col leading-tight group min-w-0 flex-1 mr-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-bold text-lg sm:text-2xl text-white tracking-wide truncate">
              {lang === 'kn' ? 'ಕೆನರಾ ಟ್ರೇಡರ್ಸ್' : 'Canara Traders'}
            </span>
            <span className="shrink-0 text-[9px] sm:text-[11px] bg-[#c98a2b] text-[#20332a] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
              Sullia · ಸುಳ್ಯ
            </span>
          </div>
          <span className="italic text-[10px] sm:text-xs text-[#c98a2b] tracking-wider truncate block">
            {lang === 'kn' ? 'Canara Traders — ರೈತರಿಂದ ನೇರವಾಗಿ ನಿಮಗೆ' : 'Canara Traders — Farmer · Shop · Consumer'}
          </span>
        </a>

        {/* Zone 2: Desktop Navigation Links */}
        {!isAdminView && (
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-[#f6f1e2]">
            <a href="#about" className="hover:text-[#c98a2b] transition-colors py-1">
              {t.navAbout}
            </a>
            <a href="#crops" className="hover:text-[#c98a2b] transition-colors py-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c98a2b]"></span>
              <span>{t.navRates}</span>
            </a>
            <a href="#products" className="hover:text-[#c98a2b] transition-colors py-1">
              {t.navProducts}
            </a>
            <a href="#sell" className="hover:text-[#c98a2b] transition-colors py-1">
              {t.navInquiry}
            </a>
            <a href="#contact" className="hover:text-[#c98a2b] transition-colors py-1">
              {t.navContact}
            </a>
          </nav>
        )}

        {/* Zone 3: Actions - Language Toggle & Admin Button */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Language Switcher Segmented Control */}
          <div className="flex items-center bg-black/30 border border-white/15 rounded-lg p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setLang('kn')}
              className={`px-2.5 py-1 rounded transition-colors ${
                lang === 'kn'
                  ? 'bg-[#c98a2b] text-[#20332a] shadow-xs'
                  : 'text-[#efe7d2] hover:text-white'
              }`}
              title="ಕನ್ನಡದಲ್ಲಿ ವೀಕ್ಷಿಸಿ"
            >
              ಕನ್ನಡ
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded transition-colors ${
                lang === 'en'
                  ? 'bg-[#c98a2b] text-[#20332a] shadow-xs'
                  : 'text-[#efe7d2] hover:text-white'
              }`}
              title="View in English"
            >
              English
            </button>
          </div>

          {/* Live DB indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded bg-black/20 border border-white/10 text-xs">
            <span className={`inline-block w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-[#efe7d2]">
              {isDbConnected ? 'Live' : 'Syncing'}
            </span>
          </div>

          {/* Prominent Admin Page Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-xs bg-[#c98a2b] hover:bg-[#a86f1c] text-[#20332a] font-bold px-3 py-2 rounded shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
            title="Open Admin Page to edit prices & manage stock"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t.navAdmin}</span>
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex sm:hidden items-center gap-1.5 shrink-0">
          {/* Quick Mobile Language Button */}
          <button
            type="button"
            onClick={toggleLang}
            className="px-2 py-1 rounded bg-black/30 border border-white/20 text-[#efe7d2] hover:text-white font-bold text-[11px] flex items-center gap-1 min-h-[36px]"
            title="Switch Language"
          >
            <Languages className="w-3 h-3 text-[#c98a2b]" />
            <span>{lang === 'kn' ? 'Eng' : 'ಕನ್ನ'}</span>
          </button>

          {/* Quick Admin Button */}
          <button
            onClick={onOpenAdmin}
            className="px-2 py-1 rounded bg-[#c98a2b] text-[#20332a] font-bold text-[11px] flex items-center gap-1 min-h-[36px]"
            title="Admin Page"
            aria-label="Admin Page"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded text-[#f6f1e2] hover:bg-white/10 min-w-[38px] min-h-[38px] flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#24392f] border-t border-white/10 px-4 pt-3 pb-5 space-y-3">
          {/* Language Switcher inside Mobile Drawer */}
          <div className="flex items-center justify-between bg-black/30 p-2 rounded-lg border border-white/10">
            <span className="text-xs text-[#efe7d2] flex items-center gap-1.5 font-medium">
              <Languages className="w-4 h-4 text-[#c98a2b]" />
              <span>ಭಾಷೆ / Language:</span>
            </span>
            <div className="flex items-center bg-black/40 rounded p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang('kn')}
                className={`px-3 py-1 rounded ${lang === 'kn' ? 'bg-[#c98a2b] text-[#20332a]' : 'text-[#efe7d2]'}`}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded font-en-body ${lang === 'en' ? 'bg-[#c98a2b] text-[#20332a]' : 'text-[#efe7d2]'}`}
              >
                English
              </button>
            </div>
          </div>

          {/* Prominent Admin Page Banner inside Mobile Drawer */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="w-full p-3 rounded-lg bg-[#c98a2b] hover:bg-[#a86f1c] text-[#20332a] font-bold text-sm flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-2 text-left">
              <Shield className="w-5 h-5 shrink-0" />
              <div>
                <div className="leading-tight">{t.navAdmin}</div>
                <div className="text-[11px] font-normal opacity-85">
                  {lang === 'kn' ? 'ದರ ಬದಲಾವಣೆ, ಸ್ಟಾಕ್ ಮತ್ತು ವಿಚಾರಣೆಗಳು' : 'Price edits, stock & inquiries'}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-2 text-sm text-[#f6f1e2] pt-1">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded bg-black/20 hover:bg-black/40 min-h-[44px] flex items-center"
            >
              {t.navAbout}
            </a>
            <a
              href="#crops"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded bg-black/20 hover:bg-black/40 text-[#c98a2b] font-bold min-h-[44px] flex items-center"
            >
              {t.navRates}
            </a>
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded bg-black/20 hover:bg-black/40 min-h-[44px] flex items-center"
            >
              {t.navProducts}
            </a>
            <a
              href="#sell"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded bg-black/20 hover:bg-black/40 min-h-[44px] flex items-center"
            >
              {t.navInquiry}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded bg-black/20 hover:bg-black/40 col-span-2 min-h-[44px] flex items-center justify-center font-medium"
            >
              {t.navContact}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
