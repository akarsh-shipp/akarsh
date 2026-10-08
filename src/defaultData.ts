import { CropRateItem, ProductItem, ShopConfig } from './types';

export const DEFAULT_SHOP_CONFIG: ShopConfig = {
  shopName: "Canara Traders",
  shopNameKn: "ಕೆನರಾ ಟ್ರೇಡರ್ಸ್",
  ownerName: "Akarsh Yermetti",
  phone: "9876543211",
  whatsapp: "9876543211",
  address: "Sri Nilaya Complex, Near Rajesh Bar, Sullia – 574239",
  addressKn: "ಶ್ರೀ ನಿಲಯ ಕಾಂಪ್ಲೆಕ್ಸ್, ರಾಜೇಶ್ ಬಾರ್ ಹತ್ತಿರ, ಸುಳ್ಯ – 574239",
  announcement: "Daily buying rates updated based on Mangaluru & CAMPCO market prices. Best rates guaranteed for fresh and dry produce.",
  announcementKn: "ಕ್ಯಾಂಪ್ಕೋ ಮತ್ತು ಮಂಗಳೂರು ಮಾರುಕಟ್ಟೆ ಆಧಾರಿತ ಇಂದಿನ ತಾಜಾ ಖರೀದಿ ದರಗಳು. ರೈತರಿಗೆ ನೇರ ನಗದು ಪಾವತಿ.",
  updatedAt: new Date().toISOString()
};

export const DEFAULT_CROP_RATES: CropRateItem[] = [
  // Arecanut
  {
    id: "areca_new",
    categoryId: "arecanut",
    categoryName: "Arecanut",
    categoryNameKn: "ಅಡಿಕೆ",
    name: "New Arecanut",
    nameKn: "ಹೊಸ ಅಡಿಕೆ",
    price: 460,
    unit: "₹ / ಕೆಜಿ",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/A_close_up_of_Areca_nut.JPG?width=400",
    sortOrder: 1,
    updatedAt: new Date().toISOString()
  },
  {
    id: "areca_old",
    categoryId: "arecanut",
    categoryName: "Arecanut",
    categoryNameKn: "ಅಡಿಕೆ",
    name: "Old Arecanut",
    nameKn: "ಹಳೆ ಅಡಿಕೆ",
    price: 520,
    unit: "₹ / ಕೆಜಿ",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/A_close_up_of_Areca_nut.JPG?width=400",
    sortOrder: 2,
    updatedAt: new Date().toISOString()
  },
  {
    id: "areca_koka",
    categoryId: "arecanut",
    categoryName: "Arecanut",
    categoryNameKn: "ಅಡಿಕೆ",
    name: "Koka",
    nameKn: "ಕೋಕಾ",
    price: 260,
    unit: "₹ / ಕೆಜಿ",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/A_close_up_of_Areca_nut.JPG?width=400",
    sortOrder: 3,
    updatedAt: new Date().toISOString()
  },
  {
    id: "areca_patara",
    categoryId: "arecanut",
    categoryName: "Arecanut",
    categoryNameKn: "ಅಡಿಕೆ",
    name: "Patara",
    nameKn: "ಪಟಾರ",
    price: 300,
    unit: "₹ / ಕೆಜಿ",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/A_close_up_of_Areca_nut.JPG?width=400",
    sortOrder: 4,
    updatedAt: new Date().toISOString()
  },
  {
    id: "areca_karigotu",
    categoryId: "arecanut",
    categoryName: "Arecanut",
    categoryNameKn: "ಅಡಿಕೆ",
    name: "Karigotu",
    nameKn: "ಕರಿಗೋಟು",
    price: 200,
    unit: "₹ / ಕೆಜಿ",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/A_close_up_of_Areca_nut.JPG?width=400",
    sortOrder: 5,
    updatedAt: new Date().toISOString()
  },
  // Coconut
  {
    id: "coconut_raw",
    categoryId: "coconut",
    categoryName: "Coconut",
    categoryNameKn: "ತೆಂಗಿನಕಾಯಿ",
    name: "Raw Coconut",
    nameKn: "ಹಸಿ ತೆಂಗಿನಕಾಯಿ",
    price: 55,
    unit: "₹ / ಕೆಜಿ",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Cocos_nucifera_plantation_in_continental_India_(Nagesh).jpg?width=400",
    sortOrder: 6,
    updatedAt: new Date().toISOString()
  },
  {
    id: "coconut_dry",
    categoryId: "coconut",
    categoryName: "Coconut",
    categoryNameKn: "ತೆಂಗಿನಕಾಯಿ",
    name: "Dry Coconut (Kobbari)",
    nameKn: "ತೆಂಗಿನಕಾಯಿ",
    price: 48,
    unit: "₹ / ಕೆಜಿ",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Cocos_nucifera_plantation_in_continental_India_(Nagesh).jpg?width=400",
    sortOrder: 7,
    updatedAt: new Date().toISOString()
  },
  // Black Pepper
  {
    id: "pepper_black",
    categoryId: "pepper",
    categoryName: "Black Pepper",
    categoryNameKn: "ಕರಿಮೆಣಸು",
    name: "Black Pepper (Dry)",
    nameKn: "ಕರಿಮೆಣಸು",
    price: 660,
    unit: "₹ / ಕೆಜಿ",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Tellicherry_Black_Peppercorns.jpg?width=400",
    sortOrder: 8,
    updatedAt: new Date().toISOString()
  },
  // Rubber
  {
    id: "rubber_grade1",
    categoryId: "rubber",
    categoryName: "Rubber",
    categoryNameKn: "ರಬ್ಬರ್",
    name: "Grade 1 RSS-4",
    nameKn: "ಗ್ರೇಡ್ 1",
    price: 177,
    unit: "₹ / ಕೆಜಿ",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Rubber_plantation%2C_Kerala.jpg?width=400",
    sortOrder: 9,
    updatedAt: new Date().toISOString()
  },
  {
    id: "rubber_grade2",
    categoryId: "rubber",
    categoryName: "Rubber",
    categoryNameKn: "ರಬ್ಬರ್",
    name: "Grade 2 RSS-5",
    nameKn: "ಗ್ರೇಡ್ 2",
    price: 160,
    unit: "₹ / ಕೆಜಿ",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Rubber_plantation%2C_Kerala.jpg?width=400",
    sortOrder: 10,
    updatedAt: new Date().toISOString()
  },
  {
    id: "rubber_scrap",
    categoryId: "rubber",
    categoryName: "Rubber",
    categoryNameKn: "ರಬ್ಬರ್",
    name: "Rubber Scrap",
    nameKn: "ರಬ್ಬರ್ ಸ್ಕ್ರಾಪ್",
    price: 72,
    unit: "₹ / ಕೆಜಿ",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Rubber_plantation%2C_Kerala.jpg?width=400",
    sortOrder: 11,
    updatedAt: new Date().toISOString()
  },
  // Cocoa
  {
    id: "cocoa_beans",
    categoryId: "cocoa",
    categoryName: "Cocoa",
    categoryNameKn: "ಕೊಕ್ಕೋ",
    name: "Cocoa Beans",
    nameKn: "ಕೊಕ್ಕೋ",
    price: 100,
    unit: "₹ / ಕೆಜಿ",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Cacao-pod-k4636-14.jpg?width=400",
    sortOrder: 12,
    updatedAt: new Date().toISOString()
  }
];

export const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: "iffco_npk",
    name: "IFFCO 10:26:26 Complex",
    nameKn: "ಇಫ್ಕೋ ಕಾಂಪ್ಲೆಕ್ಸ್",
    category: "Fertilizer",
    price: 1300,
    packSize: "50 kg",
    isAvailable: true,
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/An_IFFCO_Farmer_service_centre.jpg?width=400",
    updatedAt: new Date().toISOString()
  },
  {
    id: "urea_neem",
    name: "Neem Coated Urea",
    nameKn: "ಯೂರಿಯಾ",
    category: "Fertilizer",
    price: 300,
    packSize: "50 kg",
    isAvailable: true,
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Sample_of_Urea.jpg?width=400",
    updatedAt: new Date().toISOString()
  },
  {
    id: "rock_phosphate",
    name: "Rock Phosphate",
    nameKn: "ರಾಕ್ ಫಾಸ್ಫೇಟ್",
    category: "Soil Conditioner",
    price: 659,
    packSize: "50 kg",
    isAvailable: true,
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Phosphate_Mine_Panorama.jpg?width=400",
    updatedAt: new Date().toISOString()
  },
  {
    id: "potash_mop",
    name: "Muriate of Potash (MOP)",
    nameKn: "ಪೊಟ್ಯಾಶ್",
    category: "Fertilizer",
    price: 1100,
    packSize: "50 kg",
    isAvailable: true,
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Potassium_chloride.jpg?width=400",
    updatedAt: new Date().toISOString()
  },
  {
    id: "biophite",
    name: "Biophite Liquid Nutrient",
    nameKn: "ಬಯೋಫೈಟ್",
    category: "Nutrient",
    price: 2213,
    packSize: "5 Litre",
    isAvailable: true,
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Flexible_intermediate_bulk_containers-Fertilizer.jpg?width=400",
    updatedAt: new Date().toISOString()
  },
  {
    id: "roundup",
    name: "Roundup Systemic Herbicide",
    nameKn: "ರೌಂಡಪ್ ಕಳೆನಾಶಕ",
    category: "Plant Protection",
    price: 570,
    packSize: "1 Litre",
    isAvailable: true,
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Pesticide_spraying_in_spring.jpg?width=400",
    updatedAt: new Date().toISOString()
  },
  {
    id: "karate",
    name: "Karate Insecticide",
    nameKn: "ಕರಾಟೆ ಕ್ರಿಮಿನಾಶಕ",
    category: "Plant Protection",
    price: 979,
    packSize: "1 Litre",
    isAvailable: true,
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Tractor_spraying_pesticides_IMG_5235.jpg?width=400",
    updatedAt: new Date().toISOString()
  },
  {
    id: "hydrated_lime",
    name: "Hydrated Lime",
    nameKn: "ಸುಣ್ಣ (ಬೋರ್ಡೋ ದ್ರಾವಣಕ್ಕೆ)",
    category: "Plant Protection",
    price: 849,
    packSize: "5 kg",
    isAvailable: true,
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Calcium_hydroxide.jpg?width=400",
    updatedAt: new Date().toISOString()
  },
  {
    id: "copper_sulphate",
    name: "Copper Sulphate",
    nameKn: "ಮೈಲುತುತ್ತು (Blue Vitriol)",
    category: "Plant Protection",
    price: 2400,
    packSize: "5 kg",
    isAvailable: true,
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Copper_Sulfate_Crystals.jpg?width=400",
    updatedAt: new Date().toISOString()
  },
  {
    id: "gum_spreader",
    name: "Sticker & Spreader Gum",
    nameKn: "ಗಮ್ (ಸ್ಪ್ರೇ ಅಂಟಿಸಲು)",
    category: "Adjuvant",
    price: 585,
    packSize: "500 ml",
    isAvailable: true,
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Empty_fertilizer_bags_Huwei.jpg?width=400",
    updatedAt: new Date().toISOString()
  },
  {
    id: "factamfos",
    name: "Factamfos 20:20:0:13",
    nameKn: "ಫ್ಯಾಕ್ಟಮ್‌ಫಾಸ್",
    category: "Fertilizer",
    price: 2150,
    packSize: "50 kg",
    isAvailable: true,
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Fertilizer-_NPK-MS.jpg?width=400",
    updatedAt: new Date().toISOString()
  }
];
