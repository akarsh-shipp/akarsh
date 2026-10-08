import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { CropRateItem, ProductItem, ShopConfig, FarmerInquiry } from '../types';
import { DEFAULT_CROP_RATES, DEFAULT_PRODUCTS, DEFAULT_SHOP_CONFIG } from '../defaultData';

const CROP_RATES_COLLECTION = 'crop_rates';
const PRODUCTS_COLLECTION = 'products';
const SHOP_CONFIG_COLLECTION = 'shop_config';
const INQUIRIES_COLLECTION = 'farmer_inquiries';
const CONFIG_DOC_ID = 'main';

/**
 * Real-time listener for crop rates
 */
export function subscribeToCropRates(
  onData: (rates: CropRateItem[]) => void,
  onError?: (err: unknown) => void
) {
  const q = query(collection(db, CROP_RATES_COLLECTION), orderBy('sortOrder', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: CropRateItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<CropRateItem, 'id'>) });
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, CROP_RATES_COLLECTION);
    }
  );
}

/**
 * Real-time listener for products
 */
export function subscribeToProducts(
  onData: (products: ProductItem[]) => void,
  onError?: (err: unknown) => void
) {
  const q = query(collection(db, PRODUCTS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: ProductItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<ProductItem, 'id'>) });
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
    }
  );
}

/**
 * Real-time listener for shop configuration
 */
export function subscribeToShopConfig(
  onData: (config: ShopConfig) => void,
  onError?: (err: unknown) => void
) {
  const docRef = doc(db, SHOP_CONFIG_COLLECTION, CONFIG_DOC_ID);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data() as ShopConfig);
      } else {
        onData(DEFAULT_SHOP_CONFIG);
      }
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, `${SHOP_CONFIG_COLLECTION}/${CONFIG_DOC_ID}`);
    }
  );
}

/**
 * Real-time listener for farmer inquiries (for admin/store desk)
 */
export function subscribeToInquiries(
  onData: (inquiries: FarmerInquiry[]) => void,
  onError?: (err: unknown) => void
) {
  // CRITICAL: farmer_inquiries is protected by security rules and requires authentication.
  // Never initiate a listener if auth is null.
  if (!auth.currentUser) {
    onData([]);
    return () => {};
  }

  const q = query(collection(db, INQUIRIES_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: FarmerInquiry[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<FarmerInquiry, 'id'>) });
      });
      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, INQUIRIES_COLLECTION);
    }
  );
}

/**
 * Seed initial database records if empty
 */
export async function seedInitialDatabaseIfEmpty(): Promise<boolean> {
  try {
    const ratesSnap = await getDocs(collection(db, CROP_RATES_COLLECTION));
    let seeded = false;

    if (ratesSnap.empty) {
      console.log('Seeding initial crop rates into Firestore...');
      for (const rate of DEFAULT_CROP_RATES) {
        const { id, ...data } = rate;
        await setDoc(doc(db, CROP_RATES_COLLECTION, id), data);
      }
      seeded = true;
    }

    const prodsSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (prodsSnap.empty) {
      console.log('Seeding initial products into Firestore...');
      for (const prod of DEFAULT_PRODUCTS) {
        const { id, ...data } = prod;
        await setDoc(doc(db, PRODUCTS_COLLECTION, id), data);
      }
      seeded = true;
    }

    const configDoc = await getDoc(doc(db, SHOP_CONFIG_COLLECTION, CONFIG_DOC_ID));
    if (!configDoc.exists()) {
      console.log('Seeding initial shop configuration...');
      await setDoc(doc(db, SHOP_CONFIG_COLLECTION, CONFIG_DOC_ID), DEFAULT_SHOP_CONFIG);
      seeded = true;
    }

    return seeded;
  } catch (error) {
    console.warn('Seeding initial data error (may require authentication depending on rules):', error);
    return false;
  }
}

/**
 * Force reset/sync to defaults (for shop owner)
 */
export async function resetDatabaseToDefaults(): Promise<void> {
  const path = `${CROP_RATES_COLLECTION} / ${PRODUCTS_COLLECTION}`;
  try {
    for (const rate of DEFAULT_CROP_RATES) {
      const { id, ...data } = rate;
      await setDoc(doc(db, CROP_RATES_COLLECTION, id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    }

    for (const prod of DEFAULT_PRODUCTS) {
      const { id, ...data } = prod;
      await setDoc(doc(db, PRODUCTS_COLLECTION, id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    }

    await setDoc(doc(db, SHOP_CONFIG_COLLECTION, CONFIG_DOC_ID), {
      ...DEFAULT_SHOP_CONFIG,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update single crop rate price
 */
export async function updateCropPrice(rateId: string, newPrice: number): Promise<void> {
  const docPath = `${CROP_RATES_COLLECTION}/${rateId}`;
  try {
    const docRef = doc(db, CROP_RATES_COLLECTION, rateId);
    await updateDoc(docRef, {
      price: newPrice,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

/**
 * Update entire crop rate record
 */
export async function saveCropRate(rate: CropRateItem): Promise<void> {
  const docPath = `${CROP_RATES_COLLECTION}/${rate.id}`;
  try {
    const { id, ...data } = rate;
    const docRef = doc(db, CROP_RATES_COLLECTION, id);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Toggle product availability
 */
export async function toggleProductAvailability(productId: string, isAvailable: boolean): Promise<void> {
  const docPath = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      isAvailable,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

/**
 * Save product item (create or update)
 */
export async function saveProduct(product: ProductItem): Promise<void> {
  const docPath = `${PRODUCTS_COLLECTION}/${product.id}`;
  try {
    const { id, ...data } = product;
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Delete product item
 */
export async function deleteProduct(productId: string): Promise<void> {
  const docPath = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

/**
 * Save shop configuration
 */
export async function saveShopConfig(config: ShopConfig): Promise<void> {
  const docPath = `${SHOP_CONFIG_COLLECTION}/${CONFIG_DOC_ID}`;
  try {
    const docRef = doc(db, SHOP_CONFIG_COLLECTION, CONFIG_DOC_ID);
    await setDoc(docRef, {
      ...config,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Submit farmer inquiry (publicly accessible)
 */
export async function submitFarmerInquiry(
  inquiry: Omit<FarmerInquiry, 'id' | 'createdAt' | 'status'>
): Promise<string> {
  const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docPath = `${INQUIRIES_COLLECTION}/${inquiryId}`;
  try {
    const newDoc: FarmerInquiry = {
      ...inquiry,
      id: inquiryId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const { id, ...data } = newDoc;
    await setDoc(doc(db, INQUIRIES_COLLECTION, inquiryId), data);
    return inquiryId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

/**
 * Update inquiry status (for shop manager)
 */
export async function updateInquiryStatus(
  inquiryId: string,
  status: 'pending' | 'contacted' | 'completed'
): Promise<void> {
  const docPath = `${INQUIRIES_COLLECTION}/${inquiryId}`;
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, inquiryId);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}
