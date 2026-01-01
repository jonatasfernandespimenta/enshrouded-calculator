import fs from "fs";
import path from "path";

// Raw data from user
const rawData = `Grappling Hook Pull Anchor	1	Metal Sheets x3, Copper Bar x1	Essentials
Grappling Hook Swing Anchor	1	Metal Sheets x3, Copper Bar x1	Essentials
Mining Sieve	1	Steel Bars x3, Palm Wood Logs x2, Wax x1, Plant Fiber x2	Essentials - Water Utilities
Water Channeling Tool	1	Bronze Bars x2, Leather x1, Wood Planks x4	Essentials - Water Utilities
Watering Can	1	Charcoal x4, Copper Bars x6, Coal Powder x1	Essentials - Water Utilities
Lockpick	1	Metal Scraps x1	Supplies
Blast Furnace	1	Fire Brick x20, Bellows x1, Lump of Clay x10, Iron Bars x10, Sand x30	Production Place
Smithing Tools	1	Wood Logs x5, Iron Bars x5	Production Place
Smelter	1	Fire Brick x50, Crucible x1	Production Place
Charcoal Kiln	1	Stone x20	Production Place
Forge	1	Stone x30, Metal Scraps x10, Charcoal x10, Wood Logs x12	Production Place
Legendary Runes	1		Resources
Nails	2	Metal Scraps x1	Resources
Advanced Rake	1	Rake x1, Metal Scraps x2, Charcoal x1	Survival - Unassorted
Scrappy Axe	1	String x3, Metal Scraps x4, Shroud Wood x1	Survival - Felling Axes
Copper Axe	1	String x3, Copper Bar x4, Hardwood x1	Survival - Felling Axes
Bronze Axe	1	Linen x3, Bronze Bars x4, Hardwood x1	Survival - Felling Axes
Iron Axe	1	Linen x3, Iron Bars x4, Hardwood x1	Survival - Felling Axes
Steel Axe	1	Steel Bars x4, Hardwood x1	Survival - Felling Axes
Gilded Axe	1	Gold Bars x2, Palm Wood Logs x2, Steel Bars x2	Survival - Felling Axes
Scrappy Pickaxe	1	Metal Scraps x8, Shroud Wood x1	Survival - Pickaxes
Copper Pickaxe	1	Copper Bars x8, Hardwood x1	Survival - Pickaxes
Bronze Pickaxe	1	Bronze Bars x8, Hardwood x1	Survival - Pickaxes
Iron Pickaxe	1	Iron Bars x8, Hardwood x1	Survival - Pickaxes
Steel Pickaxe	1	Steel Bars x8, Hardwood x1	Survival - Pickaxes
Gilded Pickaxe	1	Steel Bars x7, Palm Wood Logs x2, Gold Bars x3	Survival - Pickaxes
Spiked Club	1	Nails x4, Wood Logs x4	Weapons - One-Handed Weapons
Scrappy Sword	1	Wood Logs x1, Metal Scraps x3, Nails x2	Weapons - One-Handed Weapons
Enhanced Spiked Club	1	Copper Bars x5, Charcoal x5, Wood Logs x4	Weapons - One-Handed Weapons
Mace-like Club	1	Bronze Bars x5, Wood Logs x4, Charcoal x5	Weapons - One-Handed Weapons
Iron Claw Club	1	Iron Bars x6, Charcoal x6	Weapons - One-Handed Weapons
Hailscourge	1	Gold Bars x3, Glow Dust x6, Brittle Shroud Petals x5, Tropical Wood x3	Weapons - One-Handed Weapons
Jezmina's Apotheosis	1	Gold Bars x4, Calla Luna x3, Amber x10, Tropical Wood x3	Weapons - One-Handed Weapons
Lupa's Scalper	1	Gold Bars x5, Hardened Leather x2, Tropical Wood x2	Weapons - One-Handed Weapons
Dragon Sword	1	Gold Bars x3, Tin Bars x4, Resin x8, Tar x8	Weapons - One-Handed Weapons
Dragonsbane	1	Gold Bars x4, Flammable Good x3, Obsidian Dust x4, Tropical Wood x4	Weapons - One-Handed Weapons
Greater Golden Twinflame Sword	1	Gold Bars x4, Coal x5, Coppers Bars x4, Aquamarine x7	Weapons - One-Handed Weapons
Fenrig's Axe	1	Steel Bars x5, Charcoal x8, Bamboo Logs x3	Weapons - One-Handed Weapons
Soothsayer	1	Gold Bars x2, Wood Planks x14, Conifer Logs x5	Weapons - Two-Handed Weapons
Ancestral Star	1	Gold Bars x3, Bronze Bars x2, Conifer Logs x4	Weapons - Two-Handed Weapons
Golden Recruit Axe	1	Gold Bars x3, Bronze Bars x2, Tropical Wood x4, Steel Bars x1, Amber x6	Weapons - Two-Handed Weapons`;

function normalizeId(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function parseIngredients(ingredientsStr: string): Array<{ itemId: string; quantity: number }> {
  if (!ingredientsStr || ingredientsStr.trim() === "") return [];
  
  const parts = ingredientsStr.split(",").map((s) => s.trim());
  return parts.map((part) => {
    const match = part.match(/^(.+?)\s+x(\d+)$/);
    if (!match) {
      console.warn(`Could not parse ingredient: ${part}`);
      return null;
    }
    const [, itemName, quantity] = match;
    return {
      itemId: normalizeId(itemName),
      quantity: parseInt(quantity, 10),
    };
  }).filter(Boolean) as Array<{ itemId: string; quantity: number }>;
}

function processData() {
  const lines = rawData.trim().split("\n");
  const items: any[] = [];
  const recipes: any[] = [];
  const itemsSet = new Set<string>();

  lines.forEach((line, idx) => {
    const parts = line.split("\t");
    if (parts.length < 3) return;

    const [itemName, amountCrafted, ingredientsStr, category] = parts;
    const itemId = normalizeId(itemName);
    const outputQuantity = parseInt(amountCrafted, 10) || 1;
    
    // Add item
    if (!itemsSet.has(itemId)) {
      items.push({
        id: itemId,
        name: itemName.trim(),
        normalizedName: itemId,
        category: category?.trim() || "Miscellaneous",
        iconUrl: "",
        craftable: ingredientsStr && ingredientsStr.trim() !== "" ? true : false,
      });
      itemsSet.add(itemId);
    }

    // Parse ingredients
    const ingredients = parseIngredients(ingredientsStr);
    
    // Add all ingredient items
    ingredients.forEach((ing) => {
      if (!itemsSet.has(ing.itemId)) {
        // Infer name from ID
        const inferredName = ing.itemId
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        
        items.push({
          id: ing.itemId,
          name: inferredName,
          normalizedName: ing.itemId,
          category: "Materials",
          iconUrl: "",
          craftable: false, // Will be updated if we find a recipe for it
        });
        itemsSet.add(ing.itemId);
      }
    });

    // Add recipe if has ingredients
    if (ingredients.length > 0) {
      recipes.push({
        id: `recipe-${itemId}-blacksmith-${idx}`,
        outputItemId: itemId,
        outputQuantity,
        station: "blacksmith",
        ingredients,
      });
    }
  });

  return { items, recipes };
}

// Main execution
const { items, recipes } = processData();

console.log(`Processed ${items.length} items and ${recipes.length} recipes`);
console.log("\n=== ITEMS (sample) ===");
console.log(JSON.stringify(items.slice(0, 5), null, 2));
console.log("\n=== RECIPES (sample) ===");
console.log(JSON.stringify(recipes.slice(0, 5), null, 2));

// Read existing recipes.json
const recipesPath = path.join(process.cwd(), "data", "recipes.json");
const existing = JSON.parse(fs.readFileSync(recipesPath, "utf-8"));

// Merge items (avoid duplicates)
const existingItemIds = new Set(existing.items.map((i: any) => i.id));
const newItems = items.filter((item) => !existingItemIds.has(item.id));

// Update craftable flag for existing items that now have recipes
const recipeOutputIds = new Set(recipes.map((r) => r.outputItemId));
existing.items.forEach((item: any) => {
  if (recipeOutputIds.has(item.id)) {
    item.craftable = true;
  }
});

// Merge recipes (avoid duplicates by checking output+station)
const existingRecipeKeys = new Set(
  existing.recipes.map((r: any) => `${r.outputItemId}-${r.station}`)
);
const newRecipes = recipes.filter(
  (recipe) => !existingRecipeKeys.has(`${recipe.outputItemId}-${recipe.station}`)
);

const merged = {
  items: [...existing.items, ...newItems],
  recipes: [...existing.recipes, ...newRecipes],
};

// Write back
fs.writeFileSync(recipesPath, JSON.stringify(merged, null, 2));

console.log(`\n✅ Updated recipes.json:`);
console.log(`  - Added ${newItems.length} new items`);
console.log(`  - Added ${newRecipes.length} new recipes`);
console.log(`  - Total: ${merged.items.length} items, ${merged.recipes.length} recipes`);
