import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, MessageSquare, Phone, User, MapPin, Scale, Sparkles, AlertCircle } from 'lucide-react';
import { submitFarmerInquiry } from '../services/dbService';
import { ShopConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface InquiryFormProps {
  selectedCrop: string;
  onClearCropSelection: () => void;
  config: ShopConfig;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({
  selectedCrop,
  onClearCropSelection,
  config
}) => {
  const { lang, t } = useLanguage();
  const [farmerName, setFarmerName] = useState('');
  const [phone, setPhone] = useState('');
  const [cropType, setCropType] = useState(selectedCrop || (lang === 'kn' ? 'ಅಡಿಕೆ - ಹೊಸ ಅಡಿಕೆ' : 'Arecanut - New'));
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [village, setVillage] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync if selectedCrop changes from props
  useEffect(() => {
    if (selectedCrop) {
      setCropType(selectedCrop);
    }
  }, [selectedCrop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim() || !phone.trim() || !cropType.trim()) {
      setErrorMessage(t.inqErrorRequired);
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const inqId = await submitFarmerInquiry({
        farmerName: farmerName.trim(),
        phone: phone.trim(),
        cropType: cropType.trim(),
        estimatedQuantity: estimatedQuantity.trim(),
        village: village.trim(),
        notes: notes.trim()
      });
      setSubmittedId(inqId);
    } catch (err: unknown) {
      console.error('Submission error:', err);
      setErrorMessage(t.inqErrorServer);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFarmerName('');
    setPhone('');
    setEstimatedQuantity('');
    setVillage('');
    setNotes('');
    setSubmittedId(null);
    onClearCropSelection();
  };

  return (
    <section id="sell" className="py-14 sm:py-20 bg-[#f6f1e2] border-b border-[#241c15]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-[#8b3a3a] font-semibold text-xs uppercase tracking-wider font-en-body mb-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{t.inqTag}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#20332a] font-kn-head">
            {t.inqTitle}
          </h2>
          <p className="text-[#5c4033] text-xs sm:text-base mt-2 font-kn-body">
            {t.inqDesc}
          </p>
        </div>

        <div className="bg-white border-2 border-[#2f4a3d]/20 rounded-2xl p-5 sm:p-9 shadow-md">
          {submittedId ? (
            <div className="text-center py-6 sm:py-8 space-y-4">
              <div className="w-16 h-16 bg-[#2e7d5b]/10 text-[#2e7d5b] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#20332a] font-kn-head">
                {t.inqSuccessTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#5c4033] max-w-lg mx-auto font-kn-body leading-relaxed break-words">
                {t.inqSuccessId}: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono break-all">{submittedId}</code>
                <br />
                {t.inqSuccessDesc} ({phone})
              </p>

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-2.5">
                <a
                  href={`https://wa.me/91${config.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                    lang === 'kn'
                      ? `ನಮಸ್ಕಾರ ಆಕರ್ಷ್ ಅವರೇ, ನಾನು ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ವಿಚಾರಣೆ ಸಲ್ಲಿಸಿದ್ದೇನೆ (ID: ${submittedId}). ಬೆಳೆ: ${cropType}, ತೂಕ: ${estimatedQuantity}, ಸ್ಥಳ: ${village}, ಹೆಸರು: ${farmerName}.`
                      : `Hello Akarsh, I submitted a crop selling inquiry on your website (ID: ${submittedId}). Crop: ${cropType}, Quantity: ${estimatedQuantity}, Location: ${village}, Name: ${farmerName}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-[#0b3d24] font-bold px-5 py-2.5 rounded-lg text-sm transition-colors min-h-[44px]"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>{t.inqSuccessWa}</span>
                </a>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-[#2f4a3d] hover:bg-[#20332a] text-[#f6f1e2] font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors min-h-[44px]"
                >
                  {t.inqSubmitAnother}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Farmer Name */}
                <div>
                  <label className="block text-xs font-bold text-[#20332a] mb-1 font-kn-body flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#c98a2b] shrink-0" />
                    <span>{t.inqFarmerName} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder={t.inqFarmerNamePlaceholder}
                    className="w-full bg-[#f6f1e2]/50 border border-[#241c15]/20 rounded-lg px-3.5 py-2.5 text-base sm:text-sm focus:outline-hidden focus:border-[#c98a2b]"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-[#20332a] mb-1 font-kn-body flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#c98a2b] shrink-0" />
                    <span>{t.inqPhone} *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.inqPhonePlaceholder}
                    className="w-full bg-[#f6f1e2]/50 border border-[#241c15]/20 rounded-lg px-3.5 py-2.5 text-base sm:text-sm font-mono focus:outline-hidden focus:border-[#c98a2b]"
                  />
                </div>

                {/* Crop Type */}
                <div>
                  <label className="block text-xs font-bold text-[#20332a] mb-1 font-kn-body flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#c98a2b] shrink-0" />
                    <span>{t.inqCropType} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    placeholder={t.inqCropTypePlaceholder}
                    className="w-full bg-[#f6f1e2]/50 border border-[#241c15]/20 rounded-lg px-3.5 py-2.5 text-base sm:text-sm focus:outline-hidden focus:border-[#c98a2b]"
                  />
                </div>

                {/* Estimated Quantity */}
                <div>
                  <label className="block text-xs font-bold text-[#20332a] mb-1 font-kn-body">
                    {t.inqQuantity}
                  </label>
                  <input
                    type="text"
                    value={estimatedQuantity}
                    onChange={(e) => setEstimatedQuantity(e.target.value)}
                    placeholder={t.inqQuantityPlaceholder}
                    className="w-full bg-[#f6f1e2]/50 border border-[#241c15]/20 rounded-lg px-3.5 py-2.5 text-base sm:text-sm focus:outline-hidden focus:border-[#c98a2b]"
                  />
                </div>
              </div>

              {/* Village Location */}
              <div>
                <label className="block text-xs font-bold text-[#20332a] mb-1 font-kn-body flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c98a2b] shrink-0" />
                  <span>{t.inqVillage}</span>
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder={t.inqVillagePlaceholder}
                  className="w-full bg-[#f6f1e2]/50 border border-[#241c15]/20 rounded-lg px-3.5 py-2.5 text-base sm:text-sm focus:outline-hidden focus:border-[#c98a2b]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#20332a] mb-1 font-kn-body">
                  {t.inqNotes}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.inqNotesPlaceholder}
                  className="w-full bg-[#f6f1e2]/50 border border-[#241c15]/20 rounded-lg px-3.5 py-2.5 text-base sm:text-sm focus:outline-hidden focus:border-[#c98a2b]"
                />
              </div>

              {/* Submit Button with touch target */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 bg-[#2f4a3d] hover:bg-[#20332a] text-[#f6f1e2] font-bold px-8 py-3 rounded-lg transition-transform hover:-translate-y-0.5 shadow-md disabled:opacity-50 text-sm sm:text-base font-kn-body"
                >
                  <Send className="w-4 h-4 text-[#c98a2b] shrink-0" />
                  <span>{submitting ? t.inqSubmitting : t.inqSubmitBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
