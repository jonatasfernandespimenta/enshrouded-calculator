import type { Item, Recipe, RecipeBook } from "./schemas";

/**
 * A node in the crafting tree
 */
export interface CraftingTreeNode {
  itemId: string;
  itemName: string;
  requiredQuantity: number; // Total quantity needed at this level
  perCraft: number; // How much this recipe produces per craft
  craftsNeeded: number; // Number of times to craft this recipe
  recipeId?: string;
  station?: string;
  isBaseMaterial: boolean;
  children: CraftingTreeNode[];
}

/**
 * Aggregated material totals
 */
export interface MaterialTotals {
  [itemId: string]: {
    quantity: number;
    itemName: string;
    isBaseMaterial: boolean;
    station?: string;
  };
}

/**
 * Result of crafting resolution
 */
export interface CraftingResult {
  tree: CraftingTreeNode;
  totals: MaterialTotals;
  baseMaterialsOnly: MaterialTotals;
  byStation: Record<string, MaterialTotals>;
}

/**
 * Recipe overrides (for items with multiple recipes)
 */
export type RecipeOverrides = Record<string, string>; // itemId -> recipeId

/**
 * Crafting resolver class
 */
export class CraftingResolver {
  private itemsMap: Map<string, Item>;
  private recipesByOutputId: Map<string, Recipe[]>;

  constructor(recipeBook: RecipeBook) {
    this.itemsMap = new Map(recipeBook.items.map((item) => [item.id, item]));
    this.recipesByOutputId = new Map();

    // Index recipes by output item ID
    for (const recipe of recipeBook.recipes) {
      const existing = this.recipesByOutputId.get(recipe.outputItemId) || [];
      existing.push(recipe);
      this.recipesByOutputId.set(recipe.outputItemId, existing);
    }
  }

  /**
   * Get item by ID
   */
  getItem(itemId: string): Item | undefined {
    return this.itemsMap.get(itemId);
  }

  /**
   * Get all recipes for an item
   */
  getRecipes(itemId: string): Recipe[] {
    return this.recipesByOutputId.get(itemId) || [];
  }

  /**
   * Get a specific recipe by ID
   */
  getRecipeById(recipeId: string): Recipe | undefined {
    for (const recipes of this.recipesByOutputId.values()) {
      const found = recipes.find((r) => r.id === recipeId);
      if (found) return found;
    }
    return undefined;
  }

  /**
   * Resolve crafting tree for a target item
   */
  resolve(
    targetItemId: string,
    targetQuantity: number,
    overrides: RecipeOverrides = {}
  ): CraftingResult {
    const visited = new Set<string>();
    const tree = this.buildTree(targetItemId, targetQuantity, overrides, visited);

    const totals: MaterialTotals = {};
    const baseMaterialsOnly: MaterialTotals = {};
    const byStation: Record<string, MaterialTotals> = {};

    this.aggregateMaterials(tree, totals, baseMaterialsOnly, byStation);

    return {
      tree,
      totals,
      baseMaterialsOnly,
      byStation,
    };
  }

  /**
   * Build crafting tree recursively
   */
  private buildTree(
    itemId: string,
    requiredQuantity: number,
    overrides: RecipeOverrides,
    visited: Set<string>,
    depth: number = 0
  ): CraftingTreeNode {
    // Prevent infinite recursion (cycle detection)
    if (visited.has(itemId)) {
      console.warn(`Cycle detected for item: ${itemId}`);
      const item = this.getItem(itemId);
      return {
        itemId,
        itemName: item?.name || itemId,
        requiredQuantity,
        perCraft: 1,
        craftsNeeded: requiredQuantity,
        isBaseMaterial: true,
        children: [],
      };
    }

    // Prevent excessive depth (safety)
    if (depth > 50) {
      console.warn(`Max depth exceeded for item: ${itemId}`);
      const item = this.getItem(itemId);
      return {
        itemId,
        itemName: item?.name || itemId,
        requiredQuantity,
        perCraft: 1,
        craftsNeeded: requiredQuantity,
        isBaseMaterial: true,
        children: [],
      };
    }

    const item = this.getItem(itemId);
    if (!item) {
      throw new Error(`Item not found: ${itemId}`);
    }

    // Check if item has a recipe (is craftable)
    const recipes = this.getRecipes(itemId);

    // If no recipe or not craftable, it's a base material
    if (recipes.length === 0 || !item.craftable) {
      return {
        itemId,
        itemName: item.name,
        requiredQuantity,
        perCraft: 1,
        craftsNeeded: requiredQuantity,
        isBaseMaterial: true,
        children: [],
      };
    }

    // Select recipe (override or first available)
    let recipe: Recipe;
    if (overrides[itemId]) {
      const overrideRecipe = this.getRecipeById(overrides[itemId]);
      if (overrideRecipe) {
        recipe = overrideRecipe;
      } else {
        console.warn(`Override recipe not found: ${overrides[itemId]}, using default`);
        recipe = recipes[0];
      }
    } else {
      recipe = recipes[0];
    }

    // Calculate how many times we need to craft this recipe
    const outputPerCraft = recipe.outputQuantity;
    const craftsNeeded = Math.ceil(requiredQuantity / outputPerCraft);

    // Mark as visited for cycle detection
    visited.add(itemId);

    // Recursively build children (ingredients)
    const children: CraftingTreeNode[] = [];

    for (const ingredient of recipe.ingredients) {
      const ingredientQuantityPerCraft = ingredient.quantity;
      const totalIngredientQuantity = craftsNeeded * ingredientQuantityPerCraft;

      const childNode = this.buildTree(
        ingredient.itemId,
        totalIngredientQuantity,
        overrides,
        new Set(visited), // Pass a copy to allow same item in different branches
        depth + 1
      );

      children.push(childNode);
    }

    // Remove from visited (for other branches)
    visited.delete(itemId);

    return {
      itemId,
      itemName: item.name,
      requiredQuantity,
      perCraft: outputPerCraft,
      craftsNeeded,
      recipeId: recipe.id,
      station: recipe.station,
      isBaseMaterial: false,
      children,
    };
  }

  /**
   * Aggregate materials from tree
   */
  private aggregateMaterials(
    node: CraftingTreeNode,
    totals: MaterialTotals,
    baseMaterialsOnly: MaterialTotals,
    byStation: Record<string, MaterialTotals>
  ): void {
    // Add to totals
    if (!totals[node.itemId]) {
      totals[node.itemId] = {
        quantity: 0,
        itemName: node.itemName,
        isBaseMaterial: node.isBaseMaterial,
        station: node.station,
      };
    }
    totals[node.itemId].quantity += node.requiredQuantity;

    // Add to base materials only
    if (node.isBaseMaterial) {
      if (!baseMaterialsOnly[node.itemId]) {
        baseMaterialsOnly[node.itemId] = {
          quantity: 0,
          itemName: node.itemName,
          isBaseMaterial: true,
        };
      }
      baseMaterialsOnly[node.itemId].quantity += node.requiredQuantity;
    }

    // Add to by station
    if (node.station) {
      if (!byStation[node.station]) {
        byStation[node.station] = {};
      }
      if (!byStation[node.station][node.itemId]) {
        byStation[node.station][node.itemId] = {
          quantity: 0,
          itemName: node.itemName,
          isBaseMaterial: node.isBaseMaterial,
          station: node.station,
        };
      }
      byStation[node.station][node.itemId].quantity += node.requiredQuantity;
    }

    // Recursively aggregate children
    for (const child of node.children) {
      this.aggregateMaterials(child, totals, baseMaterialsOnly, byStation);
    }
  }

  /**
   * Get all items that use a specific item as ingredient
   */
  getUsedBy(itemId: string): Array<{ item: Item; recipe: Recipe }> {
    const results: Array<{ item: Item; recipe: Recipe }> = [];

    for (const [outputItemId, recipes] of this.recipesByOutputId) {
      const item = this.getItem(outputItemId);
      if (!item) continue;

      for (const recipe of recipes) {
        const usesItem = recipe.ingredients.some((ing) => ing.itemId === itemId);
        if (usesItem) {
          results.push({ item, recipe });
        }
      }
    }

    return results;
  }

  /**
   * Search items by name
   */
  searchItems(query: string): Item[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.itemsMap.values()).filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.normalizedName.includes(lowerQuery)
    );
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    for (const item of this.itemsMap.values()) {
      if (item.category) {
        // Extract main category (before " - ")
        const mainCategory = item.category.split(' - ')[0];
        categories.add(mainCategory);
      }
    }
    return Array.from(categories).sort();
  }

  /**
   * Get items by category
   */
  getItemsByCategory(category: string): Item[] {
    return Array.from(this.itemsMap.values()).filter(
      (item) => {
        // Match both exact category and main category (before " - ")
        const mainCategory = item.category?.split(' - ')[0];
        return item.category === category || mainCategory === category;
      }
    );
  }

  /**
   * Get all items
   */
  getAllItems(): Item[] {
    return Array.from(this.itemsMap.values());
  }
}

/**
 * Create a resolver instance from recipe book
 */
export function createResolver(recipeBook: RecipeBook): CraftingResolver {
  return new CraftingResolver(recipeBook);
}
