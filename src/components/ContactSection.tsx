import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Copy, Check, Clock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { ShopConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ContactSectionProps {
  config: ShopConfig;
  onOpenAdmin: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ config, onOpenAdmin }) => {
  const { lang, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const address = lang === 'kn'
    ? (config.addressKn || config.address)
    : (config.address || config.addressKn);

  const shopName = lang === 'kn' ? config.shopNameKn : config.shopName;

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(config.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = config.phone;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="contact" className="py-14 sm:py-20 bg-[#f6f1e2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Card */}
          <div className="lg:col-span-7 bg-white border border-[#241c15]/15 rounded-2xl p-5 sm:p-9 shadow-md">
            <div className="text-[#8b3a3a] font-semibold text-xs uppercase tracking-wider font-en-body mb-1">
              {t.contactTag}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#20332a] font-kn-head">
              {t.contactTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#5c4033] mt-1 font-kn-body">
              {t.contactDesc}
            </p>

            <div className="mt-6 divide-y divide-[#241c15]/10 text-xs sm:text-sm">
              {/* Shop Name */}
              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-[#8b3a3a] uppercase font-en-body min-w-[120px]">
                  {t.contactShop}
                </span>
                <span className="font-bold text-[#20332a] text-sm sm:text-base font-kn-head">
                  {shopName} <span className="font-en-head font-normal text-xs text-gray-500">({lang === 'kn' ? config.shopName : config.shopNameKn})</span>
                </span>
              </div>

              {/* Owner */}
              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-[#8b3a3a] uppercase font-en-body min-w-[120px]">
                  {t.contactOwner}
                </span>
                <span className="font-medium text-[#20332a] flex items-center gap-1.5 font-kn-body">
                  <User className="w-4 h-4 text-[#c98a2b] shrink-0" />
                  <strong>{config.ownerName}</strong>
                </span>
              </div>

              {/* Address */}
              <div className="py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                <span className="font-bold text-[#8b3a3a] uppercase font-en-body min-w-[120px]">
                  {t.contactAddress}
                </span>
                <span className="text-[#20332a] max-w-sm sm:text-right flex items-start gap-1.5 font-kn-body">
                  <MapPin className="w-4 h-4 text-[#c98a2b] shrink-0 mt-0.5" />
                  <span>{address}</span>
                </span>
              </div>

              {/* Timings */}
              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-[#8b3a3a] uppercase font-en-body min-w-[120px]">
                  {t.contactHours}
                </span>
                <span className="text-[#20332a] text-xs flex items-center gap-1.5 font-kn-body">
                  <Clock className="w-4 h-4 text-[#2e7d5b] shrink-0" />
                  <span>{t.contactHoursVal}</span>
                </span>
              </div>

              {/* Phone */}
              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-[#8b3a3a] uppercase font-en-body min-w-[120px]">
                  {t.contactPhone}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:+91${config.phone.replace(/\D/g, '')}`}
                    className="font-bold text-[#20332a] hover:text-[#c98a2b] text-base font-mono"
                  >
                    +91 {config.phone}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="p-1.5 text-gray-500 hover:text-[#20332a] bg-gray-100 rounded-md hover:bg-gray-200 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                    title="Copy phone number"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#2e7d5b]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  {copied && <span className="text-xs text-[#2e7d5b] font-medium font-en-body">{t.contactCopied}</span>}
                </div>
              </div>

              {/* WhatsApp */}
              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-[#8b3a3a] uppercase font-en-body min-w-[120px]">
                  WhatsApp
                </span>
                <span className="font-bold text-[#0b3d24] font-mono text-sm sm:text-base">
                  +91 {config.whatsapp}
                </span>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="mt-6 pt-4 border-t border-[#241c15]/10 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <a
                href={`tel:+91${config.phone.replace(/\D/g, '')}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2f4a3d] hover:bg-[#20332a] text-white font-bold px-5 py-2.5 rounded-lg text-xs sm:text-sm transition-transform hover:-translate-y-0.5 shadow-sm min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-[#c98a2b] shrink-0" />
                <span>{t.contactCallBtn}</span>
              </a>

              <a
                href={`https://wa.me/91${config.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  lang === 'kn'
                    ? 'ನಮಸ್ಕಾರ ಆಕರ್ಷ್ ಅವರೇ, ಕೆನರಾ ಟ್ರೇಡರ್ಸ್ ದರಗಳು ಹಾಗೂ ಕೃಷಿ ಸಾಮಾಗ್ರಿ ಬಗ್ಗೆ ವಿಚಾರಿಸಲು ಸಂದೇಶ ಕಳುಹಿಸುತ್ತಿದ್ದೇನೆ.'
                    : 'Hello Akarsh, I am reaching out to inquire about Canara Traders daily prices and farm inputs.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-[#0b3d24] font-bold px-5 py-2.5 rounded-lg text-xs sm:text-sm transition-transform hover:-translate-y-0.5 shadow-sm min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>{t.contactWaBtn}</span>
              </a>
            </div>
          </div>

          {/* Location Photo & Dedicated Admin Page Card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white/60">
              <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Areca_Nut_Plantation_in_Nagercoil%2C_Tamil_Nadu%2C_India._(4600092222).jpg?width=800"
                alt="Sullia Plantation"
                className="w-full h-56 sm:h-64 object-cover"
              />
              <div className="p-4 bg-[#20332a] text-white">
                <h3 className="font-bold text-sm text-[#c98a2b] font-kn-head">
                  {t.contactLocationTitle}
                </h3>
                <p className="text-xs text-[#efe7d2] mt-1 font-kn-body leading-relaxed">
                  {t.contactLocationDesc}
                </p>
              </div>
            </div>

            {/* High-Visibility Admin Page Card */}
            <div className="bg-[#efe7d2] border-2 border-[#c98a2b] rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#c98a2b]/20 text-[#20332a] shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#c98a2b]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#20332a] font-kn-head">
                    {t.contactAdminCardTitle}
                  </h3>
                  <p className="text-xs text-[#5c4033] mt-0.5 font-kn-body">
                    {t.contactAdminCardDesc}
                  </p>
                  <div className="mt-1 text-[11px] font-mono text-gray-500">
                    Direct access: <code className="bg-white px-1.5 py-0.5 rounded border border-[#241c15]/10">#admin</code>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenAdmin}
                className="w-full min-h-[44px] bg-[#2f4a3d] hover:bg-[#20332a] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{t.contactAdminCardBtn}</span>
                <ArrowRight className="w-4 h-4 text-[#c98a2b]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
