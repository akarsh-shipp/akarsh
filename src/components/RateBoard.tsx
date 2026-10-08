import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Calculator, Clock, Database, ArrowRight, Shield } from 'lucide-react';
import { CropRateItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface RateBoardProps {
  rates: CropRateItem[];
  onSelectCropForSale: (cropName: string) => void;
  isDbConnected: boolean;
  onOpenAdmin?: () => void;
}

export const RateBoard: React.FC<RateBoardProps> = ({
  rates,
  onSelectCropForSale,
  isDbConnected,
  onOpenAdmin
}) => {
  const { lang, t } = useLanguage();

  // Collapsed state tracking for categories
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  
  // Rate calculator state
  const [calcCropId, setCalcCropId] = useState<string>('');
  const [calcWeight, setCalcWeight] = useState<string>('1');
  const [calcUnit, setCalcUnit] = useState<'kg' | 'quintal'>('quintal');

  // Group rates by category
  const categories = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      nameKn: string;
      imageUrl?: string;
      items: CropRateItem[];
    }>();

    rates.forEach((rate) => {
      const catId = rate.categoryId;
      if (!map.has(catId)) {
        map.set(catId, {
          id: catId,
          name: rate.categoryName,
          nameKn: rate.categoryNameKn,
          imageUrl: rate.imageUrl,
          items: []
        });
      }
      map.get(catId)!.items.push(rate);
    });

    return Array.from(map.values());
  }, [rates]);

  // Set default calculator crop once rates load
  React.useEffect(() => {
    if (rates.length > 0 && !calcCropId) {
      setCalcCropId(rates[0].id);
    }
  }, [rates, calcCropId]);

  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Selected crop for calculation
  const selectedCalcCrop = rates.find(r => r.id === calcCropId);
  const calculatedTotal = useMemo(() => {
    if (!selectedCalcCrop) return 0;
    const qty = parseFloat(calcWeight) || 0;
    const weightInKg = calcUnit === 'quintal' ? qty * 100 : qty;
    return weightInKg * selectedCalcCrop.price;
  }, [selectedCalcCrop, calcWeight, calcUnit]);

  // Most recent update timestamp
  const latestUpdate = useMemo(() => {
    if (rates.length === 0) return null;
    const timestamps = rates
      .map(r => new Date(r.updatedAt).getTime())
      .filter(t => !isNaN(t));
    if (timestamps.length === 0) return null;
    return new Date(Math.max(...timestamps));
  }, [rates]);

  return (
    <section id="crops" className="py-14 sm:py-20 bg-[#2f4a3d] text-[#f6f1e2] border-b-4 border-[#c98a2b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with responsive alignment */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-[#f6f1e2]/20">
          <div>
            <div className="flex items-center gap-2 text-[#c98a2b] font-semibold text-xs uppercase tracking-wider font-en-body">
              <span>{t.ratesTag}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c98a2b]"></span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                <Database className="w-3 h-3" />
                Firestore Live
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 font-kn-head">
              {t.ratesTitle}
            </h2>
            <p className="text-[#cfd9ce] text-xs sm:text-base mt-1.5 font-kn-body">
              {t.ratesDesc}
            </p>
          </div>

          {/* Time stamp badge & Admin shortcut */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-black/30 border border-[#c98a2b]/30 px-3 py-2 rounded-lg text-xs font-en-body text-[#efe7d2]">
              <Clock className="w-4 h-4 text-[#c98a2b] shrink-0" />
              <div>
                <div className="text-[10px] text-[#c98a2b] uppercase font-bold">{t.ratesDailyUpdate}</div>
                <div>{latestUpdate ? latestUpdate.toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : t.ratesUpdatedToday}</div>
              </div>
            </div>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#20332a] hover:bg-black text-[#c98a2b] border border-[#c98a2b]/40 px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                title="Edit rates in Admin page"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t.ratesAdminEdit}</span>
              </button>
            )}
          </div>
        </div>

        {/* Rate Groups list with high-fidelity alignment */}
        <div className="space-y-4 sm:space-y-6">
          {categories.map((cat) => {
            const isCollapsed = !!collapsedCategories[cat.id];
            const primaryCatName = lang === 'kn' ? cat.nameKn : cat.name;
            const secondaryCatName = lang === 'kn' ? cat.name : cat.nameKn;

            return (
              <div
                key={cat.id}
                className="bg-[#24392f] border border-[#f6f1e2]/20 rounded-xl overflow-hidden shadow-lg transition-all"
              >
                {/* Category Header Row */}
                <div className="p-3 sm:p-5 flex items-center justify-between gap-2 sm:gap-3 border-b border-[#f6f1e2]/15">
                  <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                    {cat.imageUrl && (
                      <img
                        src={cat.imageUrl}
                        alt={primaryCatName}
                        className="w-12 h-12 sm:w-18 sm:h-18 object-cover rounded-lg border border-[#c98a2b]/40 shrink-0 shadow-xs"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-1 sm:gap-1.5">
                        <h3 className="text-base sm:text-2xl font-bold text-white truncate">
                          {primaryCatName}
                        </h3>
                        <span className="text-[11px] sm:text-xs italic text-[#c98a2b] truncate">
                          ({secondaryCatName})
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-[#cfd9ce] mt-0.5 truncate">
                        {cat.items.length} {t.ratesVarieties} · {cat.items.map(i => (lang === 'kn' ? i.nameKn : i.name)).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Accordion toggle button */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className="inline-flex items-center gap-1 text-xs text-[#efe7d2] hover:text-[#c98a2b] bg-black/25 hover:bg-black/50 px-2 sm:px-3 py-1.5 rounded-md transition-colors font-medium border border-white/10 shrink-0 min-h-[34px]"
                  >
                    <span className="hidden sm:inline">{isCollapsed ? t.ratesView : t.ratesHide}</span>
                    {isCollapsed ? <ChevronDown className="w-3.5 h-3.5 text-[#c98a2b]" /> : <ChevronUp className="w-3.5 h-3.5 text-[#c98a2b]" />}
                  </button>
                </div>

                {/* Items rows with responsive alignment */}
                {!isCollapsed && (
                  <div className="divide-y divide-[#f6f1e2]/10 bg-black/10">
                    {cat.items.map((item) => {
                      const primaryItemName = lang === 'kn' ? item.nameKn : item.name;
                      const secondaryItemName = lang === 'kn' ? item.name : item.nameKn;

                      return (
                        <div
                          key={item.id}
                          className="px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-3 hover:bg-white/5 transition-colors"
                        >
                          {/* Crop Name on Left */}
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#c98a2b] shrink-0"></span>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-white text-xs sm:text-lg flex flex-wrap items-baseline gap-1">
                                <span className="truncate">{primaryItemName}</span>
                                <span className="text-[11px] sm:text-xs text-[#cfd9ce] font-normal hidden sm:inline">
                                  ({secondaryItemName})
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Price and Action on Right */}
                          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                            {/* Price Tag with tabular numerals */}
                            <div className="bg-[#c98a2b]/20 border border-[#c98a2b] px-2 sm:px-3 py-1 rounded text-right whitespace-nowrap">
                              <span className="text-[#c98a2b] font-extrabold text-xs sm:text-xl font-mono tabular-nums">
                                ₹{item.price.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[9px] sm:text-xs text-[#efe7d2] ml-0.5 sm:ml-1">
                                /{item.unit ? item.unit.replace(/₹\s*\/\s*/, '') : t.ratesUnitKg}
                              </span>
                            </div>

                            {/* Quick Sell button */}
                            <button
                              type="button"
                              onClick={() => onSelectCropForSale(`${primaryCatName} - ${primaryItemName}`)}
                              className="text-xs bg-[#c98a2b] hover:bg-[#a86f1c] text-[#20332a] font-bold px-2 sm:px-3 py-1.5 rounded transition-all flex items-center gap-1 shrink-0 min-h-[34px]"
                              title="Inquire to sell this crop"
                            >
                              <span>{t.ratesSellBtn}</span>
                              <ArrowRight className="w-3 h-3 hidden sm:inline" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Rate & Payout Calculator with clean responsive grid */}
        <div className="mt-10 sm:mt-12 bg-[#20332a] border-2 border-[#c98a2b]/60 rounded-xl p-4 sm:p-7 shadow-xl">
          <div className="flex items-center gap-2 text-[#c98a2b] text-xs font-bold uppercase tracking-wider font-en-body mb-2">
            <Calculator className="w-4 h-4 shrink-0" />
            <span>{t.calcTag}</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-bold text-white font-kn-head">
            {t.calcTitle}
          </h3>
          <p className="text-xs sm:text-sm text-[#cfd9ce] mt-1 font-kn-body">
            {t.calcDesc}
          </p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 items-end">
            {/* Crop Selector */}
            <div>
              <label className="block text-xs font-medium text-[#efe7d2] mb-1 font-kn-body">
                {t.calcSelectCrop}
              </label>
              <select
                value={calcCropId}
                onChange={(e) => setCalcCropId(e.target.value)}
                className="w-full h-11 bg-[#2f4a3d] border border-white/20 rounded-md px-3 text-white text-xs sm:text-sm focus:border-[#c98a2b] focus:outline-hidden"
              >
                {rates.map(r => (
                  <option key={r.id} value={r.id}>
                    {lang === 'kn' ? `${r.categoryNameKn} — ${r.nameKn}` : `${r.categoryName} — ${r.name}`} (₹{r.price}/{t.ratesUnitKg})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity and Unit */}
            <div>
              <label className="block text-xs font-medium text-[#efe7d2] mb-1 font-kn-body">
                {t.calcWeight}
              </label>
              <div className="flex rounded-md overflow-hidden h-11">
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(e.target.value)}
                  className="w-full bg-[#2f4a3d] border border-white/20 px-3 text-white text-sm font-mono focus:border-[#c98a2b] focus:outline-hidden"
                  placeholder="100"
                />
                <select
                  value={calcUnit}
                  onChange={(e) => setCalcUnit(e.target.value as 'kg' | 'quintal')}
                  className="bg-[#24392f] border-y border-r border-white/20 px-3 text-xs font-bold text-[#c98a2b] focus:outline-hidden shrink-0"
                >
                  <option value="quintal">{t.calcUnitQuintal}</option>
                  <option value="kg">{t.calcUnitKg}</option>
                </select>
              </div>
            </div>

            {/* Calculated Output Result */}
            <div className="bg-black/30 border border-[#c98a2b] rounded-md p-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 min-h-[44px]">
              <div>
                <div className="text-[10px] text-[#efe7d2]/70 uppercase font-bold">{t.calcEstimatedTotal}</div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#c98a2b] font-mono tabular-nums">
                  ₹{Math.round(calculatedTotal).toLocaleString('en-IN')}
                </div>
              </div>
              <button
                type="button"
                onClick={() => selectedCalcCrop && onSelectCropForSale(`${lang === 'kn' ? selectedCalcCrop.categoryNameKn : selectedCalcCrop.categoryName} - ${lang === 'kn' ? selectedCalcCrop.nameKn : selectedCalcCrop.name} (${calcWeight} ${calcUnit})`)}
                className="w-full sm:w-auto bg-[#c98a2b] hover:bg-[#a86f1c] text-[#20332a] text-xs font-bold px-3.5 py-2.5 rounded transition-colors shrink-0 text-center"
              >
                {t.calcSellAtRate}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
