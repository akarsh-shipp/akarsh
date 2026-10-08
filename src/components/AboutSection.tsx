import React from 'react';
import { CheckCircle2, TrendingUp, Sparkles, Store } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-14 sm:py-20 bg-[#f6f1e2] border-b border-[#241c15]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7">
            <span className="text-[#8b3a3a] font-semibold text-xs uppercase tracking-wider font-en-body flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{t.aboutTag}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-kn-head text-[#20332a] leading-tight text-balance">
              {t.aboutTitle}
            </h2>
            
            <p className="mt-4 text-[#5c4033] text-sm sm:text-base lg:text-lg leading-relaxed font-kn-body">
              {t.aboutDesc1}
            </p>

            <p className="mt-3 text-[#5c4033] text-xs sm:text-sm lg:text-base leading-relaxed font-kn-body">
              {t.aboutDesc2}
            </p>

            {/* Feature Highlights */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-[#241c15]/10 text-sm">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#2e7d5b] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#20332a]">{t.feature1Title}</h4>
                  <p className="text-xs text-[#5c4033]">{t.feature1Desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#2e7d5b] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#20332a]">{t.feature2Title}</h4>
                  <p className="text-xs text-[#5c4033]">{t.feature2Desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Store className="w-5 h-5 text-[#c98a2b] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#20332a]">{t.feature3Title}</h4>
                  <p className="text-xs text-[#5c4033]">{t.feature3Desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <TrendingUp className="w-5 h-5 text-[#2e7d5b] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#20332a]">{t.feature4Title}</h4>
                  <p className="text-xs text-[#5c4033]">{t.feature4Desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Photo banner */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-[#efe7d2] group">
              <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Barkur_coconut_plantation_irrigation.JPG?width=800"
                alt="Plantation"
                className="w-full h-72 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[#c98a2b] text-xs font-bold uppercase tracking-wider font-en-body">
                  {t.aboutBannerSub}
                </span>
                <span className="font-kn-head text-lg font-bold">
                  {t.aboutBannerTitle}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
