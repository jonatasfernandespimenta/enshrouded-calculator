import { describe, it, expect, beforeEach } from "vitest";
import { CraftingResolver } from "./resolveCrafting";
import type { RecipeBook } from "./schemas";

describe("CraftingResolver", () => {
  let resolver: CraftingResolver;
  let testRecipeBook: RecipeBook;

  beforeEach(() => {
    testRecipeBook = {
      items: [
        {
          id: "sword",
          name: "Sword",
          normalizedName: "sword",
          craftable: true,
        },
        {
          id: "iron-bar",
          name: "Iron Bar",
          normalizedName: "iron-bar",
          craftable: true,
        },
        {
          id: "wood",
          name: "Wood",
          normalizedName: "wood",
          craftable: false,
        },
        {
          id: "iron-ore",
          name: "Iron Ore",
          normalizedName: "iron-ore",
          craftable: false,
        },
      ],
      recipes: [
        {
          id: "recipe-sword",
          outputItemId: "sword",
          outputQuantity: 1,
          station: "forge",
          ingredients: [
            { itemId: "iron-bar", quantity: 3 },
            { itemId: "wood", quantity: 2 },
          ],
        },
        {
          id: "recipe-iron-bar",
          outputItemId: "iron-bar",
          outputQuantity: 2, // Produces 2 per craft
          station: "smelter",
          ingredients: [{ itemId: "iron-ore", quantity: 3 }],
        },
      ],
      meta: {
        scrapedAt: "2026-01-01T00:00:00.000Z",
        version: "1.0.0",
        source: "test",
        totalItems: 4,
        totalRecipes: 2,
      },
    };

    resolver = new CraftingResolver(testRecipeBook);
  });

  describe("Item queries", () => {
    it("should get item by ID", () => {
      const item = resolver.getItem("sword");
      expect(item).toBeDefined();
      expect(item?.name).toBe("Sword");
    });

    it("should get recipes for an item", () => {
      const recipes = resolver.getRecipes("sword");
      expect(recipes).toHaveLength(1);
      expect(recipes[0].id).toBe("recipe-sword");
    });

    it("should search items by name", () => {
      const results = resolver.searchItems("iron");
      expect(results).toHaveLength(2);
      expect(results.map((r) => r.id)).toContain("iron-bar");
      expect(results.map((r) => r.id)).toContain("iron-ore");
    });
  });

  describe("Crafting resolution", () => {
    it("should resolve simple crafting tree", () => {
      const result = resolver.resolve("sword", 1);

      expect(result.tree.itemId).toBe("sword");
      expect(result.tree.requiredQuantity).toBe(1);
      expect(result.tree.craftsNeeded).toBe(1);
      expect(result.tree.children).toHaveLength(2);
    });

    it("should calculate correct quantities with outputQuantity > 1", () => {
      // Need 3 iron bars, but recipe produces 2 per craft
      // So we need ceil(3/2) = 2 crafts
      // Which requires 2 * 3 = 6 iron ore
      const result = resolver.resolve("sword", 1);

      const ironBarNode = result.tree.children.find((c) => c.itemId === "iron-bar");
      expect(ironBarNode).toBeDefined();
      expect(ironBarNode?.requiredQuantity).toBe(3); // Need 3 total
      expect(ironBarNode?.perCraft).toBe(2); // Produces 2 per craft
      expect(ironBarNode?.craftsNeeded).toBe(2); // Need 2 crafts

      const ironOreNode = ironBarNode?.children[0];
      expect(ironOreNode?.itemId).toBe("iron-ore");
      expect(ironOreNode?.requiredQuantity).toBe(6); // 2 crafts * 3 ore per craft
    });

    it("should aggregate materials correctly", () => {
      const result = resolver.resolve("sword", 1);

      expect(result.totals["iron-ore"]).toBeDefined();
      expect(result.totals["iron-ore"].quantity).toBe(6);
      expect(result.totals["wood"].quantity).toBe(2);
    });

    it("should separate base materials from craftables", () => {
      const result = resolver.resolve("sword", 1);

      // Base materials should only include iron-ore and wood
      expect(Object.keys(result.baseMaterialsOnly)).toHaveLength(2);
      expect(result.baseMaterialsOnly["iron-ore"]).toBeDefined();
      expect(result.baseMaterialsOnly["wood"]).toBeDefined();
      expect(result.baseMaterialsOnly["iron-bar"]).toBeUndefined();
      expect(result.baseMaterialsOnly["sword"]).toBeUndefined();
    });

    it("should group materials by station", () => {
      const result = resolver.resolve("sword", 1);

      expect(result.byStation["forge"]).toBeDefined();
      expect(result.byStation["forge"]["sword"]).toBeDefined();

      expect(result.byStation["smelter"]).toBeDefined();
      expect(result.byStation["smelter"]["iron-bar"]).toBeDefined();
    });

    it("should scale quantities correctly", () => {
      const result = resolver.resolve("sword", 5);

      expect(result.tree.requiredQuantity).toBe(5);
      expect(result.tree.craftsNeeded).toBe(5);

      // 5 swords need 15 iron bars
      const ironBarNode = result.tree.children.find((c) => c.itemId === "iron-bar");
      expect(ironBarNode?.requiredQuantity).toBe(15);
      // 15 bars / 2 per craft = 8 crafts (ceil)
      expect(ironBarNode?.craftsNeeded).toBe(8);
      // 8 crafts * 3 ore = 24 ore
      expect(result.baseMaterialsOnly["iron-ore"].quantity).toBe(24);
      expect(result.baseMaterialsOnly["wood"].quantity).toBe(10); // 5 * 2
    });
  });

  describe("Recipe overrides", () => {
    beforeEach(() => {
      // Add alternative recipe for iron-bar
      testRecipeBook.recipes.push({
        id: "recipe-iron-bar-alt",
        outputItemId: "iron-bar",
        outputQuantity: 1,
        station: "furnace",
        ingredients: [{ itemId: "iron-ore", quantity: 2 }],
      });

      resolver = new CraftingResolver(testRecipeBook);
    });

    it("should use default recipe when no override", () => {
      const result = resolver.resolve("sword", 1);
      const ironBarNode = result.tree.children.find((c) => c.itemId === "iron-bar");

      expect(ironBarNode?.recipeId).toBe("recipe-iron-bar");
      expect(ironBarNode?.perCraft).toBe(2);
    });

    it("should use override recipe when specified", () => {
      const result = resolver.resolve("sword", 1, {
        "iron-bar": "recipe-iron-bar-alt",
      });

      const ironBarNode = result.tree.children.find((c) => c.itemId === "iron-bar");

      expect(ironBarNode?.recipeId).toBe("recipe-iron-bar-alt");
      expect(ironBarNode?.perCraft).toBe(1);
      expect(ironBarNode?.station).toBe("furnace");
    });
  });

  describe("Cycle detection", () => {
    it("should handle circular dependencies gracefully", () => {
      // Create a circular dependency: A requires B, B requires A
      const cyclicBook: RecipeBook = {
        items: [
          { id: "a", name: "A", normalizedName: "a", craftable: true },
          { id: "b", name: "B", normalizedName: "b", craftable: true },
        ],
        recipes: [
          {
            id: "recipe-a",
            outputItemId: "a",
            outputQuantity: 1,
            ingredients: [{ itemId: "b", quantity: 1 }],
          },
          {
            id: "recipe-b",
            outputItemId: "b",
            outputQuantity: 1,
            ingredients: [{ itemId: "a", quantity: 1 }],
          },
        ],
        meta: {
          scrapedAt: "2026-01-01T00:00:00.000Z",
          version: "1.0.0",
          source: "test",
          totalItems: 2,
          totalRecipes: 2,
        },
      };

      const cyclicResolver = new CraftingResolver(cyclicBook);
      const result = cyclicResolver.resolve("a", 1);

      // Should not throw, should detect cycle and treat as base material
      expect(result.tree).toBeDefined();
      expect(result.tree.itemId).toBe("a");
    });
  });

  describe("Used by queries", () => {
    it("should find items that use a specific ingredient", () => {
      const usedBy = resolver.getUsedBy("iron-bar");

      expect(usedBy).toHaveLength(1);
      expect(usedBy[0].item.id).toBe("sword");
      expect(usedBy[0].recipe.id).toBe("recipe-sword");
    });

    it("should find multiple items that use an ingredient", () => {
      const usedBy = resolver.getUsedBy("wood");

      expect(usedBy).toHaveLength(1);
      expect(usedBy[0].item.id).toBe("sword");
    });
  });

  describe("Category queries", () => {
    beforeEach(() => {
      testRecipeBook.items[0].category = "Weapons";
      testRecipeBook.items[1].category = "Materials";
      testRecipeBook.items[2].category = "Materials";
      testRecipeBook.items[3].category = "Materials";

      resolver = new CraftingResolver(testRecipeBook);
    });

    it("should get all categories", () => {
      const categories = resolver.getCategories();

      expect(categories).toContain("Weapons");
      expect(categories).toContain("Materials");
      expect(categories).toHaveLength(2);
    });

    it("should get items by category", () => {
      const weapons = resolver.getItemsByCategory("Weapons");
      expect(weapons).toHaveLength(1);
      expect(weapons[0].id).toBe("sword");

      const materials = resolver.getItemsByCategory("Materials");
      expect(materials).toHaveLength(3);
    });
  });
});
