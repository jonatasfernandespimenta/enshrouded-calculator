import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Item, RecipeBook } from "./schemas";
import type { CraftingResult, RecipeOverrides } from "./resolveCrafting";
import { CraftingResolver } from "./resolveCrafting";

interface AppState {
  // Data
  recipeBook: RecipeBook | null;
  resolver: CraftingResolver | null;
  
  // Selection
  selectedItem: Item | null;
  targetQuantity: number;
  recipeOverrides: RecipeOverrides;
  
  // Calculation result
  craftingResult: CraftingResult | null;
  
  // UI State
  showBaseMaterialsOnly: boolean;
  groupByStation: boolean;
  collectedMaterials: Set<string>; // itemIds that have been collected
  expandedNodes: Set<string>; // itemIds that are expanded in tree
  
  // Actions
  loadRecipeBook: (recipeBook: RecipeBook) => void;
  selectItem: (item: Item | null) => void;
  setTargetQuantity: (quantity: number) => void;
  setRecipeOverride: (itemId: string, recipeId: string) => void;
  clearRecipeOverride: (itemId: string) => void;
  calculate: () => void;
  
  // UI Actions
  toggleBaseMaterialsOnly: () => void;
  toggleGroupByStation: () => void;
  toggleMaterialCollected: (itemId: string) => void;
  setMaterialCollected: (itemId: string, collected: boolean) => void;
  toggleNodeExpanded: (itemId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  
  // Utility
  reset: () => void;
  getCollectionProgress: () => { collected: number; total: number; percentage: number };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      recipeBook: null,
      resolver: null,
      selectedItem: null,
      targetQuantity: 1,
      recipeOverrides: {},
      craftingResult: null,
      showBaseMaterialsOnly: false,
      groupByStation: false,
      collectedMaterials: new Set(),
      expandedNodes: new Set(),

      // Load recipe book
      loadRecipeBook: (recipeBook) => {
        const resolver = new CraftingResolver(recipeBook);
        set({ recipeBook, resolver });
      },

      // Select item
      selectItem: (item) => {
        set({ selectedItem: item });
        
        // Auto-calculate if item is selected
        if (item) {
          get().calculate();
        } else {
          set({ craftingResult: null });
        }
      },

      // Set target quantity
      setTargetQuantity: (quantity) => {
        if (quantity < 1) quantity = 1;
        set({ targetQuantity: quantity });
        
        // Auto-recalculate
        if (get().selectedItem) {
          get().calculate();
        }
      },

      // Set recipe override
      setRecipeOverride: (itemId, recipeId) => {
        const { recipeOverrides } = get();
        set({
          recipeOverrides: {
            ...recipeOverrides,
            [itemId]: recipeId,
          },
        });
        
        // Auto-recalculate
        if (get().selectedItem) {
          get().calculate();
        }
      },

      // Clear recipe override
      clearRecipeOverride: (itemId) => {
        const { recipeOverrides } = get();
        const newOverrides = { ...recipeOverrides };
        delete newOverrides[itemId];
        set({ recipeOverrides: newOverrides });
        
        // Auto-recalculate
        if (get().selectedItem) {
          get().calculate();
        }
      },

      // Calculate crafting tree
      calculate: () => {
        const { selectedItem, targetQuantity, resolver, recipeOverrides } = get();
        
        if (!selectedItem || !resolver) {
          set({ craftingResult: null });
          return;
        }

        try {
          const result = resolver.resolve(
            selectedItem.id,
            targetQuantity,
            recipeOverrides
          );
          
          set({ craftingResult: result });
        } catch (error) {
          console.error("Failed to calculate crafting tree:", error);
          set({ craftingResult: null });
        }
      },

      // Toggle base materials only filter
      toggleBaseMaterialsOnly: () => {
        set((state) => ({
          showBaseMaterialsOnly: !state.showBaseMaterialsOnly,
        }));
      },

      // Toggle group by station
      toggleGroupByStation: () => {
        set((state) => ({
          groupByStation: !state.groupByStation,
        }));
      },

      // Toggle material collected
      toggleMaterialCollected: (itemId) => {
        const { collectedMaterials } = get();
        const newCollected = new Set(collectedMaterials);
        
        if (newCollected.has(itemId)) {
          newCollected.delete(itemId);
        } else {
          newCollected.add(itemId);
        }
        
        set({ collectedMaterials: newCollected });
      },

      // Set material collected state
      setMaterialCollected: (itemId, collected) => {
        const { collectedMaterials } = get();
        const newCollected = new Set(collectedMaterials);
        
        if (collected) {
          newCollected.add(itemId);
        } else {
          newCollected.delete(itemId);
        }
        
        set({ collectedMaterials: newCollected });
      },

      // Toggle node expanded
      toggleNodeExpanded: (itemId) => {
        const { expandedNodes } = get();
        const newExpanded = new Set(expandedNodes);
        
        if (newExpanded.has(itemId)) {
          newExpanded.delete(itemId);
        } else {
          newExpanded.add(itemId);
        }
        
        set({ expandedNodes: newExpanded });
      },

      // Expand all nodes
      expandAll: () => {
        const { craftingResult } = get();
        if (!craftingResult) return;
        
        const allItemIds = new Set<string>();
        
        const collectIds = (node: any) => {
          allItemIds.add(node.itemId);
          node.children?.forEach(collectIds);
        };
        
        collectIds(craftingResult.tree);
        set({ expandedNodes: allItemIds });
      },

      // Collapse all nodes
      collapseAll: () => {
        set({ expandedNodes: new Set() });
      },

      // Get collection progress
      getCollectionProgress: () => {
        const { craftingResult, collectedMaterials, showBaseMaterialsOnly } = get();
        
        if (!craftingResult) {
          return { collected: 0, total: 0, percentage: 0 };
        }
        
        const materials = showBaseMaterialsOnly
          ? craftingResult.baseMaterialsOnly
          : craftingResult.totals;
        
        const total = Object.keys(materials).length;
        const collected = Object.keys(materials).filter((id) =>
          collectedMaterials.has(id)
        ).length;
        
        const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;
        
        return { collected, total, percentage };
      },

      // Reset state
      reset: () => {
        set({
          selectedItem: null,
          targetQuantity: 1,
          recipeOverrides: {},
          craftingResult: null,
          showBaseMaterialsOnly: false,
          groupByStation: false,
          collectedMaterials: new Set(),
          expandedNodes: new Set(),
        });
      },
    }),
    {
      name: "enshrouded-calculator-storage",
      partialize: (state) => ({
        // Only persist these fields
        selectedItem: state.selectedItem,
        targetQuantity: state.targetQuantity,
        recipeOverrides: state.recipeOverrides,
        showBaseMaterialsOnly: state.showBaseMaterialsOnly,
        groupByStation: state.groupByStation,
        collectedMaterials: Array.from(state.collectedMaterials), // Convert Set to Array for JSON
        expandedNodes: Array.from(state.expandedNodes),
      }),
      merge: (persistedState: any, currentState) => {
        // Convert arrays back to Sets when hydrating
        return {
          ...currentState,
          ...persistedState,
          collectedMaterials: new Set(persistedState.collectedMaterials || []),
          expandedNodes: new Set(persistedState.expandedNodes || []),
        };
      },
    }
  )
);

// Hook to load recipe book on mount
export function useLoadRecipeBook() {
  const loadRecipeBook = useAppStore((state) => state.loadRecipeBook);
  const recipeBook = useAppStore((state) => state.recipeBook);

  return { loadRecipeBook, isLoaded: recipeBook !== null };
}
