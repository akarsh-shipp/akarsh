import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, MessageSquare, Check, XCircle, Sparkles } from 'lucide-react';
import { ProductItem, ShopConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProductsShelfProps {
  products: ProductItem[];
  config: ShopConfig;
  onOpenAdmin?: () => void;
}

export const ProductsShelf: React.FC<ProductsShelfProps> = ({ products, config }) => {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract available categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        (p.nameKn && p.nameKn.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        p.packSize.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <section id="products" className="py-14 sm:py-20 bg-[#efe7d2] border-b border-[#241c15]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with responsive alignment */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#8b3a3a] font-semibold text-xs uppercase tracking-wider font-en-body">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{t.prodTag}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#20332a] mt-1 font-kn-head">
              {t.prodTitle}
            </h2>
            <p className="text-[#5c4033] text-xs sm:text-base mt-1.5 font-kn-body">
              {t.prodDesc}
            </p>
          </div>

          {/* Quick search input */}
          <div className="relative w-full md:w-72 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.prodSearchPlaceholder}
              className="w-full h-11 pl-9 pr-4 text-xs sm:text-sm bg-white border border-[#241c15]/20 rounded-md focus:outline-hidden focus:border-[#c98a2b] shadow-xs text-[#20332a]"
            />
            <Search className="w-4 h-4 text-[#5c4033] absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Category Filter Pills: scrollable horizontally on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 sm:mb-8 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#2f4a3d] text-[#f6f1e2] shadow-xs'
                : 'bg-white/80 text-[#5c4033] hover:bg-white border border-[#241c15]/10'
            }`}
          >
            {t.prodAll} ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#2f4a3d] text-[#f6f1e2] shadow-xs'
                  : 'bg-white/80 text-[#5c4033] hover:bg-white border border-[#241c15]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Responsive Shelf Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((product) => {
            const productName = lang === 'kn' && product.nameKn ? `${product.nameKn} (${product.name})` : product.name;
            const waMessage = encodeURIComponent(
              lang === 'kn'
                ? `ನಮಸ್ಕಾರ ಕೆನರಾ ಟ್ರೇಡರ್ಸ್, ನಾನು ನಿಮ್ಮಲ್ಲಿರುವ "${product.name} (${product.packSize}) - ₹${product.price}" ಬಗ್ಗೆ ವಿಚಾರಿಸಲು ಮತ್ತು ಖರೀದಿಸಲು ಬಯಸುತ್ತೇನೆ.`
                : `Hello Canara Traders, I want to inquire about purchasing "${product.name} (${product.packSize}) - ₹${product.price}".`
            );

            return (
              <div
                key={product.id}
                className="bg-[#f6f1e2] border border-[#241c15]/15 rounded-xl overflow-hidden flex flex-col shadow-xs hover:shadow-md transition-shadow group h-full"
              >
                {/* Product Photo */}
                <div className="h-36 sm:h-40 overflow-hidden bg-black/5 relative shrink-0">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#2f4a3d]/10 text-[#2f4a3d]">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                  )}

                  {/* Category badge */}
                  {product.category && (
                    <span className="absolute top-2 left-2 bg-[#20332a]/85 backdrop-blur-xs text-[#c98a2b] text-[10px] font-bold px-2 py-0.5 rounded uppercase font-en-body tracking-wider">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Product Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-en-head font-bold text-base sm:text-lg text-[#20332a] leading-snug">
                      {product.name}
                    </h3>
                    {product.nameKn && (
                      <p className="text-[#8b3a3a] text-xs font-semibold mt-0.5 font-kn-body">
                        {product.nameKn}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#241c15]/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg sm:text-xl font-extrabold text-[#20332a] font-mono tabular-nums">
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-[#5c4033] font-medium">
                          {t.prodPack}: {product.packSize}
                        </div>
                      </div>

                      {/* Stock availability badge */}
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          product.isAvailable
                            ? 'bg-[#2e7d5b]/15 text-[#2e7d5b]'
                            : 'bg-[#a8341f]/15 text-[#a8341f]'
                        }`}
                      >
                        {product.isAvailable ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d5b]"></span>
                            <span>{t.prodInStock}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>{t.prodOutOfStock}</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* WhatsApp Inquiry Button */}
                    <a
                      href={`https://wa.me/91${config.whatsapp.replace(/\D/g, '')}?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full min-h-[40px] inline-flex items-center justify-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366] text-[#0b3d24] hover:text-white border border-[#25D366]/40 text-xs font-bold py-2 rounded-md transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.prodWaInquiry}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white/40 rounded-xl border border-dashed border-[#241c15]/20">
            <ShoppingBag className="w-10 h-10 text-[#5c4033]/50 mx-auto mb-2" />
            <p className="text-sm font-medium text-[#5c4033]">{t.prodNotFound}</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 text-xs text-[#c98a2b] font-bold hover:underline"
            >
              {t.prodClearFilter}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
