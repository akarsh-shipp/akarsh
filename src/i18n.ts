export type Language = 'kn' | 'en';

export interface Translations {
  // Navigation
  brandName: string;
  brandSub: string;
  tagline: string;
  navAbout: string;
  navRates: string;
  navProducts: string;
  navInquiry: string;
  navContact: string;
  navAdmin: string;
  dbConnected: string;
  dbConnecting: string;

  // Hero
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroOwner: string;
  heroNotice: string;
  heroBtnRates: string;
  heroBtnWa: string;
  heroBtnSell: string;
  heroBtnCall: string;

  // About
  aboutTag: string;
  aboutTitle: string;
  aboutDesc1: string;
  aboutDesc2: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  aboutBannerTitle: string;
  aboutBannerSub: string;

  // Rate Board
  ratesTag: string;
  ratesTitle: string;
  ratesDesc: string;
  ratesDailyUpdate: string;
  ratesUpdatedToday: string;
  ratesVarieties: string;
  ratesView: string;
  ratesHide: string;
  ratesUnitKg: string;
  ratesSellBtn: string;
  ratesAdminEdit: string;

  // Calculator
  calcTag: string;
  calcTitle: string;
  calcDesc: string;
  calcSelectCrop: string;
  calcWeight: string;
  calcUnitQuintal: string;
  calcUnitKg: string;
  calcEstimatedTotal: string;
  calcSellAtRate: string;

  // Products
  prodTag: string;
  prodTitle: string;
  prodDesc: string;
  prodSearchPlaceholder: string;
  prodAll: string;
  prodPack: string;
  prodInStock: string;
  prodOutOfStock: string;
  prodWaInquiry: string;
  prodNotFound: string;
  prodClearFilter: string;

  // Inquiry
  inqTag: string;
  inqTitle: string;
  inqDesc: string;
  inqSuccessTitle: string;
  inqSuccessDesc: string;
  inqSuccessId: string;
  inqSuccessWa: string;
  inqSubmitAnother: string;
  inqFarmerName: string;
  inqFarmerNamePlaceholder: string;
  inqPhone: string;
  inqPhonePlaceholder: string;
  inqCropType: string;
  inqCropTypePlaceholder: string;
  inqQuantity: string;
  inqQuantityPlaceholder: string;
  inqVillage: string;
  inqVillagePlaceholder: string;
  inqNotes: string;
  inqNotesPlaceholder: string;
  inqSubmitBtn: string;
  inqSubmitting: string;
  inqErrorRequired: string;
  inqErrorServer: string;

  // Contact
  contactTag: string;
  contactTitle: string;
  contactDesc: string;
  contactShop: string;
  contactOwner: string;
  contactAddress: string;
  contactHours: string;
  contactHoursVal: string;
  contactPhone: string;
  contactCopied: string;
  contactCallBtn: string;
  contactWaBtn: string;
  contactLocationTitle: string;
  contactLocationDesc: string;
  contactAdminCardTitle: string;
  contactAdminCardDesc: string;
  contactAdminCardBtn: string;

  // Footer & Floating
  footerRights: string;
  adminFloatingText: string;
  backToStore: string;
}

export const translations: Record<Language, Translations> = {
  kn: {
    brandName: 'ಕೆನರಾ ಟ್ರೇಡರ್ಸ್',
    brandSub: 'Canara Traders',
    tagline: 'ರೈತರಿಂದ ನೇರವಾಗಿ ನಿಮಗೆ · Farmer · Shop · Consumer',
    navAbout: 'ಪರಿಚಯ',
    navRates: 'ಬೆಳೆ ದರ',
    navProducts: 'ಉತ್ಪನ್ನಗಳು',
    navInquiry: 'ಮಾರಾಟ ವಿಚಾರಣೆ',
    navContact: 'ಸಂಪರ್ಕಿಸಿ',
    navAdmin: 'ಅಂಗಡಿ ನಿರ್ವಹಣೆ (Admin)',
    dbConnected: 'ಲೈವ್ ಡೇಟಾಬೇಸ್',
    dbConnecting: 'ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...',

    heroEyebrow: 'FARMER · SHOP · CONSUMER — ಸುಳ್ಯ ಮಾರುಕಟ್ಟೆ',
    heroTitle: 'ರೈತರಿಂದ ನೇರವಾಗಿ ನಿಮ್ಮ ಮನೆಗೆ',
    heroSubtitle: 'ಅಡಿಕೆ, ತೆಂಗು, ಕರಿಮೆಣಸು, ರಬ್ಬರ್ ಮತ್ತು ಕೊಕ್ಕೋ ಖರೀದಿಯಲ್ಲಿ ಸುಳ್ಯದ ವಿಶ್ವಾಸಾರ್ಹ ಪಾಲುದಾರ.',
    heroOwner: 'ಮಾಲೀಕರು: ಆಕರ್ಷ್ ಯೆರ್ಮೆಟ್ಟಿ',
    heroNotice: 'ಇಂದಿನ ಸೂಚನೆ',
    heroBtnRates: 'ಇಂದಿನ ದರ ನೋಡಿ',
    heroBtnWa: 'WhatsApp ಸಂಪರ್ಕ',
    heroBtnSell: '🌾 ಬೆಳೆ ಮಾರಾಟ',
    heroBtnCall: 'ಕರೆ ಮಾಡಿ',

    aboutTag: 'WHO WE ARE · ನಮ್ಮ ಬಗ್ಗೆ',
    aboutTitle: 'ಒಂದೇ ಅಂಗಡಿ, ಎರಡು ಮಹತ್ವದ ಕೆಲಸಗಳು',
    aboutDesc1: 'ಕೆನರಾ ಟ್ರೇಡರ್ಸ್ ಸುಳ್ಯದಲ್ಲಿ ರೈತರು ಬೆಳೆದ ಅಡಿಕೆ, ತೆಂಗಿನಕಾಯಿ, ಕರಿಮೆಣಸು, ರಬ್ಬರ್ ಮತ್ತು ಕೊಕ್ಕೋ ಬೆಳೆಗಳನ್ನು ನೇರವಾಗಿ ಸ್ಪರ್ಧಾತ್ಮಕ ಮಾರುಕಟ್ಟೆ ದರದಲ್ಲಿ ಖರೀದಿಸುತ್ತದೆ — ಇದರಿಂದ ರೈತರಿಗೆ ಸೂಕ್ತ ಬೆಲೆ ಸಿಗುತ್ತದೆ ಮತ್ತು ಮಧ್ಯವರ್ತಿಗಳ ಶೋಷಣೆ ತಪ್ಪುತ್ತದೆ.',
    aboutDesc2: 'ಅದೇ ಸಮಯದಲ್ಲಿ, ನಿಮ್ಮ ಕೃಷಿ ತೋಟಗಳಿಗೆ ಬೇಕಾದ ಉತ್ತಮ ಗುಣಮಟ್ಟದ ರಸಗೊಬ್ಬರಗಳು (IFFCO, ಯೂರಿಯಾ, ಪೊಟ್ಯಾಶ್, ಫ್ಯಾಕ್ಟಮ್‌ಫಾಸ್), ಸಸ್ಯ ಸಂರಕ್ಷಣಾ ಔಷಧಗಳು, ಸುಣ್ಣ ಮತ್ತು ಮೈಲುತುತ್ತನ್ನು ನ್ಯಾಯಯುತ ಬೆಲೆಗೆ ಒದಗಿಸುತ್ತೇವೆ.',
    feature1Title: 'ನೇರ ನಗದು / ಬ್ಯಾಂಕ್ ಪಾವತಿ',
    feature1Desc: 'ತೂಕ ಮತ್ತು ಗ್ರೇಡ್ ಆದ ತಕ್ಷಣ ಪಾರದರ್ಶಕ ಪಾವತಿ',
    feature2Title: 'ದೈನಂದಿನ ಮಾರುಕಟ್ಟೆ ದರ',
    feature2Desc: 'ಕ್ಯಾಂಪ್ಕೋ ಮತ್ತು ಪ್ರಮುಖ ಮಂಡಿಗಳ ಇಂದಿನ ದರ',
    feature3Title: 'ಅಧಿಕೃತ ಗೊಬ್ಬರ & ಔಷಧ',
    feature3Desc: 'ನಕಲಿ ಮುಕ್ತ, ಕಂಪನಿ ಪ್ಯಾಕ್ ಆದ ಕೃಷಿ ಸಾಮಾಗ್ರಿಗಳು',
    feature4Title: 'ಲೈವ್ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ದರಗಳು',
    feature4Desc: 'ಬೆಲೆ ಬದಲಾದ ತಕ್ಷಣ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಲಭ್ಯ',
    aboutBannerTitle: 'ಮಲೆನಾಡು & ಕರಾವಳಿ ರೈತರ ವಿಶ್ವಾಸಾರ್ಹ ತಾಣ',
    aboutBannerSub: 'SULLIA, DAKSHINA KANNADA',

    ratesTag: 'ಬೆಲೆ ಪಟ್ಟಿ · LIVE PURCHASE BOARD',
    ratesTitle: 'ಇಂದಿನ ಬೆಳೆ ಖರೀದಿ ದರ',
    ratesDesc: 'ಕೆಳಗಿನ ದರಗಳು ಕೆನರಾ ಟ್ರೇಡರ್ಸ್ ಇಂದು ರೈತರಿಂದ ನೇರವಾಗಿ ಖರೀದಿಸುವ ನಿಖರ ದರಗಳಾಗಿವೆ.',
    ratesDailyUpdate: 'ದಿನನಿತ್ಯ ನವೀಕರಿಸಲಾಗುತ್ತದೆ',
    ratesUpdatedToday: 'ಇಂದು ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ',
    ratesVarieties: 'ಪ್ರಭೇದಗಳು',
    ratesView: 'ದರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    ratesHide: 'ಮರೆಮಾಡಿ',
    ratesUnitKg: 'ಕೆಜಿ',
    ratesSellBtn: 'ಮಾರಾಟ',
    ratesAdminEdit: 'ದರ ಬದಲಾಯಿಸಿ (Admin)',

    calcTag: 'ರೈತರ ಕ್ಯಾಲ್ಕುಲೇಟರ್ · ESTIMATED PAYOUT CALCULATOR',
    calcTitle: 'ನಿಮ್ಮ ಬೆಳೆಯ ಒಟ್ಟು ಮೊತ್ತವನ್ನು ಲೆಕ್ಕ ಹಾಕಿ',
    calcDesc: 'ನಿಮ್ಮ ಬಳಿ ಇರುವ ಅಂದಾಜು ತೂಕವನ್ನು ನಮೂದಿಸಿ ಮತ್ತು ಇಂದಿನ ದರದಂತೆ ಒಟ್ಟು ಆದಾಯವನ್ನು ತಿಳಿಯಿರಿ.',
    calcSelectCrop: 'ಬೆಳೆ ಮತ್ತು ಗ್ರೇಡ್ ಆಯ್ಕೆಮಾಡಿ',
    calcWeight: 'ತೂಕ / ಪ್ರಮಾಣ',
    calcUnitQuintal: 'ಕ್ವಿಂಟಾಲ್ (100 kg)',
    calcUnitKg: 'ಕೆಜಿ (Kg)',
    calcEstimatedTotal: 'ಅಂದಾಜು ಒಟ್ಟು ಮೊತ್ತ',
    calcSellAtRate: 'ಈ ದರದಲ್ಲಿ ಮಾರಾಟ',

    prodTag: 'FARM INPUTS & AGRICULTURAL CHEMICALS · ಕೃಷಿ ಸಾಮಾಗ್ರಿಗಳು',
    prodTitle: 'ನಾವು ಪೂರೈಸುವ ಉತ್ಪನ್ನಗಳು',
    prodDesc: 'ರಸಗೊಬ್ಬರಗಳು, ಲಘು ಪೋಷಕಾಂಶಗಳು ಮತ್ತು ಸಸ್ಯ ಸಂರಕ್ಷಣಾ ಔಷಧಗಳು — ನಿಖರ ಪ್ಯಾಕಿಂಗ್ ಮತ್ತು ದಾಸ್ತಾನು.',
    prodSearchPlaceholder: 'ಉತ್ಪನ್ನ ಹುಡುಕಿ / Search (IFFCO, Urea...)',
    prodAll: 'ಎಲ್ಲವೂ',
    prodPack: 'ಪ್ಯಾಕಿಂಗ್',
    prodInStock: 'ಲಭ್ಯವಿದೆ',
    prodOutOfStock: 'ಖಾಲಿಯಾಗಿದೆ',
    prodWaInquiry: 'WhatsApp ವಿಚಾರಣೆ',
    prodNotFound: 'ಯಾವುದೇ ಉತ್ಪನ್ನ ಕಂಡುಬಂದಿಲ್ಲ',
    prodClearFilter: 'ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ',

    inqTag: 'FARMER CROP INQUIRY · ರೈತರ ನೇರ ಮಾರಾಟ',
    inqTitle: 'ನಿಮ್ಮ ಬೆಳೆ ಮಾರಾಟಕ್ಕೆ ವಿಚಾರಣೆ ಸಲ್ಲಿಸಿ',
    inqDesc: 'ನಿಮ್ಮ ಬಳಿ ಮಾರಾಟಕ್ಕೆ ಲಭ್ಯವಿರುವ ಬೆಳೆಯ ವಿವರಗಳನ್ನು ತಿಳಿಸಿ. ಕೆನರಾ ಟ್ರೇಡರ್ಸ್ ಮಾಲೀಕರು ನಿಮ್ಮೊಂದಿಗೆ ತಕ್ಷಣವೇ ಸಂಪರ್ಕ ಸಾಧಿಸುತ್ತಾರೆ.',
    inqSuccessTitle: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ವಿಚಾರಣೆ ದಾಖಲಾಗಿದೆ.',
    inqSuccessDesc: 'ಕೆನರಾ ಟ್ರೇಡರ್ಸ್ ತಂಡವು ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆಗೆ ಶೀಘ್ರದಲ್ಲೇ ಕರೆ ಮಾಡಲಿದೆ.',
    inqSuccessId: 'ವಿಚಾರಣೆ ಸಂಖ್ಯೆ',
    inqSuccessWa: 'WhatsApp ನಲ್ಲೂ ಕಳುಹಿಸಿ',
    inqSubmitAnother: 'ಮತ್ತೊಂದು ವಿಚಾರಣೆ ಸಲ್ಲಿಸಿ',
    inqFarmerName: 'ರೈತರ ಹೆಸರು (Farmer Name)',
    inqFarmerNamePlaceholder: 'ಉದಾ: ಮಹಾಬಲ ಭಟ್, ಸುಳ್ಯ',
    inqPhone: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (Phone Number)',
    inqPhonePlaceholder: 'ಉದಾ: 9876543210',
    inqCropType: 'ಬೆಳೆಯ ಹೆಸರು & ಗ್ರೇಡ್ (Crop & Grade)',
    inqCropTypePlaceholder: 'ಉದಾ: ಅಡಿಕೆ - ಹೊಸ ಅಡಿಕೆ / ಕೊಕ್ಕೋ',
    inqQuantity: 'ಅಂದಾಜು ಪ್ರಮಾಣ (Quantity)',
    inqQuantityPlaceholder: 'ಉದಾ: 5 ಕ್ವಿಂಟಾಲ್ / 300 ಕೆಜಿ',
    inqVillage: 'ಗ್ರಾಮ / ಸ್ಥಳ (Village / Location)',
    inqVillagePlaceholder: 'ಉದಾ: ಬೆಳ್ಳಾರೆ, ಪಂಜ, ಸುಳ್ಯ, ಕಡಬ...',
    inqNotes: 'ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ / ಟಿಪ್ಪಣಿ (ತೇವಾಂಶ, ಸ್ಥಿತಿ)',
    inqNotesPlaceholder: 'ಉದಾ: ಚೆನ್ನಾಗಿ ಒಣಗಿಸಿದ ಅಡಿಕೆ, ತಕ್ಷಣ ರವಾನೆಗೆ ಸಿದ್ಧವಿದೆ...',
    inqSubmitBtn: 'ವಿಚಾರಣೆ ಸಲ್ಲಿಸಿ (Submit Inquiry)',
    inqSubmitting: 'ವಿಚಾರಣೆ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
    inqErrorRequired: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು, ಫೋನ್ ಸಂಖ್ಯೆ ಮತ್ತು ಬೆಳೆ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.',
    inqErrorServer: 'ವಿಚಾರಣೆ ಸಲ್ಲಿಸುವಲ್ಲಿ ದೋಷ ಉಂಟಾಗಿದೆ. ದಯವಿಟ್ಟು ನೇರವಾಗಿ ಕರೆ ಅಥವಾ WhatsApp ಮಾಡಿ.',

    contactTag: 'ಸಂಪರ್ಕ ಮಾಹಿತಿ · GET IN TOUCH',
    contactTitle: 'ಸಂಪರ್ಕಿಸಿ & ಅಂಗಡಿಗೆ ಭೇಟಿ ನೀಡಿ',
    contactDesc: 'ದೈನಂದಿನ ಬೆಲೆಗಳು, ಸಗಟು ಖರೀದಿ ಹಾಗೂ ಕೃಷಿ ಸಾಮಾಗ್ರಿಗಳಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ.',
    contactShop: 'ಅಂಗಡಿ (Shop)',
    contactOwner: 'ಮಾಲೀಕರು (Owner)',
    contactAddress: 'ವಿಳಾಸ (Address)',
    contactHours: 'ಸಮಯ (Hours)',
    contactHoursVal: 'ಸೋಮ - ಶನಿ: 8:00 AM – 7:30 PM | ಭಾನುವಾರ: 8:30 AM – 1:30 PM',
    contactPhone: 'ಫೋನ್ (Mobile)',
    contactCopied: 'Copied!',
    contactCallBtn: 'ಈಗ ಕರೆ ಮಾಡಿ',
    contactWaBtn: 'WhatsApp Message',
    contactLocationTitle: 'ಸುಳ್ಯ ತಾಲೂಕಿನ ಕೇಂದ್ರ ಸ್ಥಳದಲ್ಲಿ',
    contactLocationDesc: 'ಶ್ರೀ ನಿಲಯ ಕಾಂಪ್ಲೆಕ್ಸ್, ರಾಜೇಶ್ ಬಾರ್ ಹತ್ತಿರ, ಸುಳ್ಯ ಪಟ್ಟಣ. ರೈತರಿಗೆ ವಾಹನ ಸಾಗಾಟ ಮತ್ತು ಅನ್‌ಲೋಡಿಂಗ್‌ಗೆ ಸುಲಭ ಸೌಲಭ್ಯವಿದೆ.',
    contactAdminCardTitle: 'ಅಂಗಡಿ ನಿರ್ವಹಣಾ ಪುಟ (Admin Dashboard)',
    contactAdminCardDesc: 'ದರಗಳ ನವೀಕರಣ, ರಸಗೊಬ್ಬರಗಳ ದಾಸ್ತಾನು ಮತ್ತು ರೈತರ ವಿಚಾರಣೆಗಳ ನಿರ್ವಹಣೆಗೆ ನೇರ ಪ್ರವೇಶ.',
    contactAdminCardBtn: 'ಅಂಗಡಿ ನಿರ್ವಹಣಾ ಪುಟ ತೆರೆಯಿರಿ (Open Admin Page)',

    footerRights: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    adminFloatingText: 'Admin Page',
    backToStore: 'ಗ್ರಾಹಕರ ಮುಖಪುಟ (Storefront)'
  },
  en: {
    brandName: 'Canara Traders',
    brandSub: 'ಕೆನರಾ ಟ್ರೇಡರ್ಸ್',
    tagline: 'Direct from Farmers to You · Farmer · Shop · Consumer',
    navAbout: 'About',
    navRates: 'Crop Rates',
    navProducts: 'Products',
    navInquiry: 'Sell Crops',
    navContact: 'Contact',
    navAdmin: 'Admin Dashboard',
    dbConnected: 'Live Database',
    dbConnecting: 'Connecting...',

    heroEyebrow: 'FARMER · SHOP · CONSUMER — SULLIA MARKET',
    heroTitle: 'Directly From Farmers To Your Doorstep',
    heroSubtitle: 'Trusted partner in Sullia for purchasing Arecanut, Coconut, Black Pepper, Rubber, and Cocoa.',
    heroOwner: 'Proprietor: Akarsh Yermetti',
    heroNotice: "Today's Announcement",
    heroBtnRates: "View Today's Rates",
    heroBtnWa: 'WhatsApp Contact',
    heroBtnSell: '🌾 Sell Crop',
    heroBtnCall: 'Call Now',

    aboutTag: 'WHO WE ARE · ABOUT US',
    aboutTitle: 'One Store, Two Vital Missions',
    aboutDesc1: 'Canara Traders in Sullia directly purchases Arecanut, Coconut, Black Pepper, Rubber, and Cocoa from farmers at competitive market rates — ensuring fair prices and eliminating exploitative middlemen.',
    aboutDesc2: 'Simultaneously, we stock high-quality fertilizers (IFFCO, Urea, Potash, Factamfos), crop protection nutrients, lime, and copper sulphate at fair and transparent prices.',
    feature1Title: 'Instant Cash & Bank Payout',
    feature1Desc: 'Transparent immediate payment right after weighment and grading',
    feature2Title: 'Daily Market-Linked Rates',
    feature2Desc: 'Aligned with CAMPCO, Mangaluru, and Kochi APMC benchmarks',
    feature3Title: 'Genuine Fertilizers & Chemicals',
    feature3Desc: 'Original sealed brand packs with certified nutritional quality',
    feature4Title: 'Live Real-Time Database',
    feature4Desc: 'Prices reflect online instantaneously whenever modified by shop desk',
    aboutBannerTitle: 'Trusted Hub for Coastal & Malnad Farmers',
    aboutBannerSub: 'SULLIA, DAKSHINA KANNADA',

    ratesTag: 'PRICE BOARD · LIVE PURCHASE BOARD',
    ratesTitle: "Today's Crop Purchase Rates",
    ratesDesc: 'The rates below are the exact prices Canara Traders is buying directly from farmers today.',
    ratesDailyUpdate: 'Updated Daily',
    ratesUpdatedToday: 'Updated Today',
    ratesVarieties: 'grades available',
    ratesView: 'View Rates',
    ratesHide: 'Hide Rates',
    ratesUnitKg: 'kg',
    ratesSellBtn: 'Sell',
    ratesAdminEdit: 'Edit Rates (Admin)',

    calcTag: 'FARMER CALCULATOR · ESTIMATED PAYOUT CALCULATOR',
    calcTitle: 'Calculate Your Crop Payout Value',
    calcDesc: 'Enter your harvest weight and calculate your total estimated return at today’s purchase price.',
    calcSelectCrop: 'Select Crop & Grade',
    calcWeight: 'Harvest Weight',
    calcUnitQuintal: 'Quintal (100 kg)',
    calcUnitKg: 'Kg',
    calcEstimatedTotal: 'Estimated Total Value',
    calcSellAtRate: 'Sell at this Rate',

    prodTag: 'FARM INPUTS & AGRICULTURAL CHEMICALS',
    prodTitle: 'Products We Stock & Supply',
    prodDesc: 'Fertilizers, liquid nutrients, and plant protection — accurate pack sizes and real-time inventory.',
    prodSearchPlaceholder: 'Search products (IFFCO, Urea, Potash...)',
    prodAll: 'All Products',
    prodPack: 'Pack Size',
    prodInStock: 'In Stock',
    prodOutOfStock: 'Out of Stock',
    prodWaInquiry: 'WhatsApp Inquiry',
    prodNotFound: 'No matching products found',
    prodClearFilter: 'Clear Filter',

    inqTag: 'FARMER CROP INQUIRY · DIRECT SALE',
    inqTitle: 'Submit a Crop Selling Inquiry',
    inqDesc: 'Share details of crops you wish to sell. The proprietor of Canara Traders will reach out immediately.',
    inqSuccessTitle: 'Thank You! Your Inquiry is Logged.',
    inqSuccessDesc: 'The Canara Traders team will call your phone number shortly.',
    inqSuccessId: 'Inquiry Reference',
    inqSuccessWa: 'Send via WhatsApp as well',
    inqSubmitAnother: 'Submit Another Inquiry',
    inqFarmerName: 'Farmer Name',
    inqFarmerNamePlaceholder: 'e.g., Mahabala Bhat, Sullia',
    inqPhone: 'Mobile Phone Number',
    inqPhonePlaceholder: 'e.g., 9876543210',
    inqCropType: 'Crop Name & Grade',
    inqCropTypePlaceholder: 'e.g., Arecanut - New / Cocoa Beans',
    inqQuantity: 'Estimated Quantity',
    inqQuantityPlaceholder: 'e.g., 5 Quintals / 300 kg',
    inqVillage: 'Village / Taluk Location',
    inqVillagePlaceholder: 'e.g., Bellare, Panja, Sullia, Kadaba...',
    inqNotes: 'Additional Notes (Moisture, Quality, Transport)',
    inqNotesPlaceholder: 'e.g., Sun-dried arecanut, ready for immediate loading...',
    inqSubmitBtn: 'Submit Inquiry',
    inqSubmitting: 'Submitting Inquiry...',
    inqErrorRequired: 'Please provide your name, phone number, and crop details.',
    inqErrorServer: 'Error submitting inquiry. Please call or WhatsApp us directly.',

    contactTag: 'CONTACT INFO · GET IN TOUCH',
    contactTitle: 'Contact Us & Visit the Shop',
    contactDesc: 'Reach out directly for daily price inquiries, bulk purchases, and agricultural inputs.',
    contactShop: 'Shop',
    contactOwner: 'Proprietor',
    contactAddress: 'Address',
    contactHours: 'Business Hours',
    contactHoursVal: 'Mon - Sat: 8:00 AM – 7:30 PM | Sun: 8:30 AM – 1:30 PM',
    contactPhone: 'Mobile',
    contactCopied: 'Copied!',
    contactCallBtn: 'Call Now',
    contactWaBtn: 'WhatsApp Message',
    contactLocationTitle: 'Centrally Located in Sullia Town',
    contactLocationDesc: 'Sri Nilaya Complex, Near Rajesh Bar, Sullia. Ample vehicle parking and convenient unloading for farmers.',
    contactAdminCardTitle: 'Shop Admin Dashboard',
    contactAdminCardDesc: 'Direct portal to edit daily market rates, toggle fertilizer inventory, and review farmer leads.',
    contactAdminCardBtn: 'Open Admin Page',

    footerRights: 'All rights reserved.',
    adminFloatingText: 'Admin Page',
    backToStore: 'Back to Storefront'
  }
};
