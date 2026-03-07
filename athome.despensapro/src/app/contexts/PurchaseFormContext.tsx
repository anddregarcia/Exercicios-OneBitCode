import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface PurchaseItem {
  key?: string;
  itemId: string;
  brandId?: string;
  selected: boolean;
  price: string;
  quantity: string;
}

interface PurchaseFormData {
  selectedStore: string;
  purchaseDate: string;
  purchaseItems: PurchaseItem[];
}

interface PurchaseFormContextType {
  selectedStore: string;
  setSelectedStore: (store: string) => void;
  purchaseDate: string;
  setPurchaseDate: (date: string) => void;
  purchaseItems: PurchaseItem[];
  setPurchaseItems: (items: PurchaseItem[]) => void;
  clearForm: () => void;
}

const PurchaseFormContext = createContext<PurchaseFormContextType | undefined>(undefined);

const STORAGE_KEY = "purchase-form-data";

export function PurchaseFormProvider({ children }: { children: React.ReactNode }) {
  const [selectedStore, setSelectedStoreState] = useState("");
  const [purchaseDate, setPurchaseDateState] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [purchaseItems, setPurchaseItemsState] = useState<PurchaseItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: PurchaseFormData = JSON.parse(saved);
        setSelectedStoreState(data.selectedStore || "");
        setPurchaseDateState(data.purchaseDate || new Date().toISOString().split("T")[0]);
        setPurchaseItemsState(data.purchaseItems || []);
      }
    } catch (error) {
      console.error("Error loading purchase form data:", error);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      const data: PurchaseFormData = {
        selectedStore,
        purchaseDate,
        purchaseItems,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving purchase form data:", error);
    }
  }, [selectedStore, purchaseDate, purchaseItems]);

  const setSelectedStore = useCallback((store: string) => {
    setSelectedStoreState(store);
  }, []);

  const setPurchaseDate = useCallback((date: string) => {
    setPurchaseDateState(date);
  }, []);

  const setPurchaseItems = useCallback((items: PurchaseItem[]) => {
    setPurchaseItemsState(items);
  }, []);

  const clearForm = useCallback(() => {
    setSelectedStoreState("");
    setPurchaseDateState(new Date().toISOString().split("T")[0]);
    setPurchaseItemsState([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    selectedStore,
    setSelectedStore,
    purchaseDate,
    setPurchaseDate,
    purchaseItems,
    setPurchaseItems,
    clearForm,
  };

  return (
    <PurchaseFormContext.Provider value={value}>
      {children}
    </PurchaseFormContext.Provider>
  );
}

export function usePurchaseForm() {
  const context = useContext(PurchaseFormContext);
  if (context === undefined) {
    throw new Error("usePurchaseForm must be used within a PurchaseFormProvider");
  }
  return context;
}
