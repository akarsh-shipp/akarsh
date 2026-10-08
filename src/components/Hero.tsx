import React from 'react';
import { Phone, MessageSquare, ArrowDown, Sparkles, MapPin, Shield } from 'lucide-react';
import { ShopConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  config: ShopConfig;
  onOpenAdmin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onOpenAdmin }) => {
  const { lang, t } = useLanguage();

  const notice = lang === 'kn'
    ? (config.announcementKn || config.announcement)
    : (config.announcement || config.announcementKn);

  const address = lang === 'kn'
    ? (config.addressKn || config.address)
    : (config.address || config.addressKn);

  const shopName = lang === 'kn' ? config.shopNameKn : config.shopName;

  return (
    <header className="relative min-h-[58vh] sm:min-h-[64vh] flex items-end bg-[#20332a] overflow-hidden">
      {/* Background with plantation photo & dark gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out scale-105"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(24,32,26,0.50) 0%, rgba(20,26,20,0.70) 50%, rgba(15,20,15,0.96) 100%), url('https://commons.wikimedia.org/wiki/Special:FilePath/Areca_Nut_Plantation_in_Nagercoil%2C_Tamil_Nadu%2C_India._(4600092222).jpg?width=1600')`
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full z-10">
        {/* Eyebrow and Admin Quick Link */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-2 bg-[#c98a2b]/20 border border-[#c98a2b]/40 backdrop-blur-xs text-[#c98a2b] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-en-body">
            <Sparkles className="w-3.5 h-3.5 text-[#c98a2b] shrink-0" />
            <span>{t.heroEyebrow}</span>
          </div>

          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-xs text-[#efe7d2] hover:text-[#c98a2b] bg-black/40 hover:bg-black/60 border border-white/20 px-3 py-1 rounded-full backdrop-blur-xs transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-[#c98a2b]" />
            <span>{t.navAdmin}</span>
          </button>
        </div>

        {/* Main Title with balanced text wrap */}
        <h1 className="text-white text-2xl sm:text-4xl lg:text-5xl font-extrabold font-kn-head leading-tight max-w-3xl drop-shadow-md text-balance">
          {t.heroTitle}
        </h1>
        <p className="text-[#efe7d2] text-sm sm:text-lg lg:text-xl font-medium mt-2 max-w-2xl font-kn-body leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Owner & Location Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[#efe7d2] text-xs sm:text-sm border-t border-white/15 pt-3 break-words">
          <span className="font-bold text-[#c98a2b]">{shopName}</span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span>{lang === 'kn' ? 'ಮಾಲೀಕರು' : 'Proprietor'}: <strong className="text-white">{config.ownerName}</strong></span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="flex items-center gap-1 text-white/90">
            <MapPin className="w-3.5 h-3.5 text-[#c98a2b] shrink-0" />
            <span className="break-words">{address}</span>
          </span>
        </div>

        {/* Daily Announcement ticker */}
        {notice && (
          <div className="mt-4 bg-[#c98a2b]/20 border-l-4 border-[#c98a2b] p-3 rounded-r text-[#efe7d2] text-xs sm:text-sm max-w-3xl backdrop-blur-xs break-words">
            <strong className="text-[#c98a2b] mr-1.5">{t.heroNotice}:</strong>
            <span>{notice}</span>
          </div>
        )}

        {/* Action Buttons with high-fidelity responsive mobile stacking */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2.5 sm:gap-3 items-stretch sm:items-center">
          <a
            href="#crops"
            className="inline-flex items-center justify-center gap-2 bg-[#c98a2b] hover:bg-[#a86f1c] text-[#20332a] font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded shadow-md transition-transform hover:-translate-y-0.5 text-xs sm:text-base min-h-[44px]"
          >
            <span>{t.heroBtnRates}</span>
            <ArrowDown className="w-4 h-4 shrink-0" />
          </a>

          <a
            href={`https://wa.me/91${config.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
              lang === 'kn'
                ? 'ನಮಸ್ಕಾರ ಕೆನರಾ ಟ್ರೇಡರ್ಸ್, ಇಂದಿನ ಬೆಳೆ ದರ ಮತ್ತು ಸಾಮಾಗ್ರಿಗಳ ಬಗ್ಗೆ ವಿಚಾರಿಸಲು ಸಂದೇಶ ಕಳುಹಿಸುತ್ತಿದ್ದೇನೆ.'
                : 'Hello Canara Traders, I am contacting you regarding today crop rates and agricultural supplies.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-[#0b3d24] font-bold px-4 sm:px-5 py-2.5 sm:py-3 rounded shadow-md transition-transform hover:-translate-y-0.5 text-xs sm:text-base min-h-[44px]"
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>{t.heroBtnWa}</span>
          </a>

          <a
            href="#sell"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-xs font-semibold px-4 sm:px-5 py-2.5 sm:py-3 rounded transition-colors text-xs sm:text-base min-h-[44px]"
          >
            <span>{t.heroBtnSell}</span>
          </a>

          <a
            href={`tel:+91${config.phone.replace(/\D/g, '')}`}
            className="inline-flex items-center justify-center gap-2 bg-black/40 hover:bg-black/60 text-[#efe7d2] border border-white/20 px-4 py-2.5 sm:py-3 rounded text-xs sm:text-sm font-semibold transition-colors min-h-[44px] sm:col-span-2 lg:col-auto"
          >
            <Phone className="w-4 h-4 text-[#c98a2b] shrink-0" />
            <span>{t.heroBtnCall}: +91 {config.phone}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
