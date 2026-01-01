const fs = require('fs');
const path = require('path');

// Read current recipes
const recipesPath = path.join(__dirname, 'data', 'recipes.json');
const recipesData = JSON.parse(fs.readFileSync(recipesPath, 'utf-8'));

// Helper function to normalize names to kebab-case IDs
function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '');
}

// Parse recipe data from the text
const blacksmithRecipes = [
  // Essentials
  { name: "Grappling Hook Pull Anchor", amount: 1, ingredients: [["Metal Sheets", 3], ["Copper Bar", 1]], category: "Essentials" },
  { name: "Grappling Hook Swing Anchor", amount: 1, ingredients: [["Metal Sheets", 3], ["Copper Bar", 1]], category: "Essentials" },
  { name: "Mining Sieve", amount: 1, ingredients: [["Steel Bars", 3], ["Palm Wood Logs", 2], ["Wax", 1], ["Plant Fiber", 2]], category: "Essentials - Water Utilities" },
  { name: "Water Channeling Tool", amount: 1, ingredients: [["Bronze Bars", 2], ["Leather", 1], ["Wood Planks", 4]], category: "Essentials - Water Utilities" },
  { name: "Watering Can", amount: 1, ingredients: [["Charcoal", 4], ["Copper Bars", 6], ["Coal Powder", 1]], category: "Essentials - Water Utilities" },
  { name: "Lockpick", amount: 1, ingredients: [["Metal Scraps", 1]], category: "Supplies" },
  
  // Production Places
  { name: "Blast Furnace", amount: 1, ingredients: [["Fire Brick", 20], ["Bellows", 1], ["Lump of Clay", 10], ["Iron Bars", 10], ["Sand", 30]], category: "Production Place" },
  { name: "Smithing Tools", amount: 1, ingredients: [["Wood Logs", 5], ["Iron Bars", 5]], category: "Production Place" },
  { name: "Smelter", amount: 1, ingredients: [["Fire Brick", 50], ["Crucible", 1]], category: "Production Place" },
  { name: "Charcoal Kiln", amount: 1, ingredients: [["Stone", 20]], category: "Production Place" },
  { name: "Forge", amount: 1, ingredients: [["Stone", 30], ["Metal Scraps", 10], ["Charcoal", 10], ["Wood Logs", 12]], category: "Production Place" },
  
  // Resources
  { name: "Legendary Runes", amount: 1, ingredients: [], category: "Resources" },
  { name: "Nails", amount: 2, ingredients: [["Metal Scraps", 1]], category: "Resources" },
  
  // Survival Tools
  { name: "Advanced Rake", amount: 1, ingredients: [["Rake", 1], ["Metal Scraps", 2], ["Charcoal", 1]], category: "Survival - Unassorted" },
  { name: "Scrappy Axe", amount: 1, ingredients: [["String", 3], ["Metal Scraps", 4], ["Shroud Wood", 1]], category: "Survival - Felling Axes" },
  { name: "Copper Axe", amount: 1, ingredients: [["String", 3], ["Copper Bar", 4], ["Hardwood", 1]], category: "Survival - Felling Axes" },
  { name: "Bronze Axe", amount: 1, ingredients: [["Linen", 3], ["Bronze Bars", 4], ["Hardwood", 1]], category: "Survival - Felling Axes" },
  { name: "Iron Axe", amount: 1, ingredients: [["Linen", 3], ["Iron Bars", 4], ["Hardwood", 1]], category: "Survival - Felling Axes" },
  { name: "Steel Axe", amount: 1, ingredients: [["Steel Bars", 4], ["Hardwood", 1]], category: "Survival - Felling Axes" },
  { name: "Gilded Axe", amount: 1, ingredients: [["Gold Bars", 2], ["Palm Wood Logs", 2], ["Steel Bars", 2]], category: "Survival - Felling Axes" },
  { name: "Scrappy Pickaxe", amount: 1, ingredients: [["Metal Scraps", 8], ["Shroud Wood", 1]], category: "Survival - Pickaxes" },
  { name: "Copper Pickaxe", amount: 1, ingredients: [["Copper Bars", 8], ["Hardwood", 1]], category: "Survival - Pickaxes" },
  { name: "Bronze Pickaxe", amount: 1, ingredients: [["Bronze Bars", 8], ["Hardwood", 1]], category: "Survival - Pickaxes" },
  { name: "Iron Pickaxe", amount: 1, ingredients: [["Iron Bars", 8], ["Hardwood", 1]], category: "Survival - Pickaxes" },
  { name: "Steel Pickaxe", amount: 1, ingredients: [["Steel Bars", 8], ["Hardwood", 1]], category: "Survival - Pickaxes" },
  { name: "Gilded Pickaxe", amount: 1, ingredients: [["Steel Bars", 7], ["Palm Wood Logs", 2], ["Gold Bars", 3]], category: "Survival - Pickaxes" },
  
  // Weapons - One-Handed
  { name: "Spiked Club", amount: 1, ingredients: [["Nails", 4], ["Wood Logs", 4]], category: "Weapons - One-Handed Weapons" },
  { name: "Scrappy Sword", amount: 1, ingredients: [["Wood Logs", 1], ["Metal Scraps", 3], ["Nails", 2]], category: "Weapons - One-Handed Weapons" },
  { name: "Enhanced Spiked Club", amount: 1, ingredients: [["Copper Bars", 5], ["Charcoal", 5], ["Wood Logs", 4]], category: "Weapons - One-Handed Weapons" },
  { name: "Mace-like Club", amount: 1, ingredients: [["Bronze Bars", 5], ["Wood Logs", 4], ["Charcoal", 5]], category: "Weapons - One-Handed Weapons" },
  { name: "Iron Claw Club", amount: 1, ingredients: [["Iron Bars", 6], ["Charcoal", 6]], category: "Weapons - One-Handed Weapons" },
  { name: "Hailscourge", amount: 1, ingredients: [["Gold Bars", 3], ["Glow Dust", 6], ["Brittle Shroud Petals", 5], ["Tropical Wood", 3]], category: "Weapons - One-Handed Weapons" },
  { name: "Jezmina's Apotheosis", amount: 1, ingredients: [["Gold Bars", 4], ["Calla Luna", 3], ["Amber", 10], ["Tropical Wood", 3]], category: "Weapons - One-Handed Weapons" },
  { name: "Lupa's Scalper", amount: 1, ingredients: [["Gold Bars", 5], ["Hardened Leather", 2], ["Tropical Wood", 2]], category: "Weapons - One-Handed Weapons" },
  { name: "Dragon Sword", amount: 1, ingredients: [["Gold Bars", 3], ["Tin Bars", 4], ["Resin", 8], ["Tar", 8]], category: "Weapons - One-Handed Weapons" },
  { name: "Dragonsbane", amount: 1, ingredients: [["Gold Bars", 4], ["Flammable Good", 3], ["Obsidian Dust", 4], ["Tropical Wood", 4]], category: "Weapons - One-Handed Weapons" },
  { name: "Greater Golden Twinflame Sword", amount: 1, ingredients: [["Gold Bars", 4], ["Coal", 5], ["Coppers Bars", 4], ["Aquamarine", 7]], category: "Weapons - One-Handed Weapons" },
  { name: "Fenrig's Axe", amount: 1, ingredients: [["Steel Bars", 5], ["Charcoal", 8], ["Bamboo Logs", 3]], category: "Weapons - One-Handed Weapons" },
  
  // Weapons - Two-Handed
  { name: "Soothsayer", amount: 1, ingredients: [["Gold Bars", 2], ["Wood Planks", 14], ["Conifer Logs", 5]], category: "Weapons - Two-Handed Weapons" },
  { name: "Ancestral Star", amount: 1, ingredients: [["Gold Bars", 3], ["Bronze Bars", 2], ["Conifer Logs", 4]], category: "Weapons - Two-Handed Weapons" },
  { name: "Golden Recruit Axe", amount: 1, ingredients: [["Gold Bars", 3], ["Bronze Bars", 2], ["Tropical Wood", 4], ["Steel Bars", 1], ["Amber", 6]], category: "Weapons - Two-Handed Weapons" },
  
  // Shields
  { name: "Rising Fighter Shield", amount: 1, ingredients: [["String", 6], ["Metal Sheets", 5], ["Wood Logs", 2]], category: "Weapons - Shields" },
  { name: "Valiant Shield", amount: 1, ingredients: [["Linen", 6], ["Charcoal", 6], ["Metal Sheets", 7]], category: "Weapons - Shields" },
  { name: "Hero's Shield", amount: 1, ingredients: [["Linen", 5], ["Copper Bars", 5], ["Charcoal", 5]], category: "Weapons - Shields" },
  { name: "Guardian Shield", amount: 1, ingredients: [["Leather", 4], ["Bronze Bars", 6], ["Hardwood", 1], ["Charcoal", 6]], category: "Weapons - Shields" },
  { name: "Mercenary Shield", amount: 1, ingredients: [["Leather", 3], ["Charcoal", 5], ["Bronze Bars", 5], ["Hardwood", 1]], category: "Weapons - Shields" },
  { name: "Shield of Light", amount: 1, ingredients: [["Bronze Bars", 1], ["Charcoal", 8], ["Iron Bars", 8], ["Padding", 5]], category: "Weapons - Shields" },
  { name: "Soldier Shield", amount: 1, ingredients: [["Bronze Bars", 1], ["Padding", 2], ["Charcoal", 8], ["Iron Bars", 5]], category: "Weapons - Shields" },
  { name: "Rogue Shield", amount: 1, ingredients: [["Iron Bars", 4], ["Charcoal", 4], ["Padding", 2], ["Luminous Growth", 1]], category: "Weapons - Shields" },
  { name: "Brazen Bull Shield", amount: 1, ingredients: [["Padding", 2], ["Steel Bars", 8], ["Coal", 8], ["Amethyst", 5]], category: "Weapons - Shields" },
  { name: "Mountain's Shadow Shield", amount: 1, ingredients: [["Padding", 2], ["Coal", 3], ["Conifer Logs", 4], ["Steel Bars", 3]], category: "Weapons - Shields" },
  { name: "Wolf's Fang Shield", amount: 1, ingredients: [["Conifer Logs", 4], ["Silver Bars", 3], ["Charcoal", 2]], category: "Weapons - Shields" },
  { name: "Riptide", amount: 1, ingredients: [["Steel Bars", 4], ["Drak Scales", 2], ["Tropical Wood", 3]], category: "Weapons - Shields" },
  { name: "Pikemead's Bulwark", amount: 1, ingredients: [["Shroud Radiance", 3], ["Steel Bars", 3], ["Aquamarine Dust", 7]], category: "Weapons - Shields" },
  { name: "Golden Bulwark Shield", amount: 1, ingredients: [["Piscine Ivory Dust", 1], ["Steel Bars", 5], ["Gold Bars", 3], ["Aquamarine Dust", 4], ["Obsidian", 3], ["Drak Teeth", 1]], category: "Weapons - Shields" },
  { name: "Sunpiercer Shield", amount: 1, ingredients: [["Piscine Ivory Dust", 1], ["Steel Bars", 4], ["Gold Bars", 4], ["Aquamarine Dust", 3], ["Obsidian", 3]], category: "Weapons - Shields" },
  
  // Tools and Components
  { name: "Bellows", amount: 1, ingredients: [["Conifer Logs", 10], ["Leather", 10], ["Linen", 5], ["Iron Bars", 1]], category: "Tools and Components" },
  { name: "Cauldron", amount: 1, ingredients: [["Iron Bars", 3], ["Copper Bars", 2], ["Bonemeal", 15]], category: "Tools and Components" },
  { name: "Masonry Tools", amount: 1, ingredients: [["Charcoal", 6], ["Iron Bars", 6], ["Wood Planks", 2]], category: "Tools and Components" },
  { name: "Crucible", amount: 1, ingredients: [["Lump of Clay", 3], ["Springlands Dirt", 3], ["Sand", 5]], category: "Tools and Components" },
  { name: "Circular Sawblades", amount: 1, ingredients: [["Iron Bars", 2], ["Charcoal", 6]], category: "Tools and Components" },
  { name: "Kettle", amount: 1, ingredients: [["Metal Sheets", 5]], category: "Tools and Components" },
];

// Function to ensure item exists
function ensureItem(name, category) {
  const itemId = toKebabCase(name);
  const existingItem = recipesData.items.find(i => i.id === itemId);
  
  if (!existingItem) {
    recipesData.items.push({
      id: itemId,
      name: name,
      normalizedName: itemId,
      category: category,
      iconUrl: "",
      craftable: false // Will be set to true if it has a recipe
    });
    console.log(`✓ Added item: ${name}`);
  }
  
  return itemId;
}

// Function to add recipe
function addRecipe(recipeData) {
  const outputItemId = ensureItem(recipeData.name, recipeData.category);
  const recipeId = `recipe-${outputItemId}-blacksmith`;
  
  // Check if recipe already exists
  const existingRecipe = recipesData.recipes.find(r => r.id === recipeId);
  if (existingRecipe) {
    console.log(`⚠ Recipe already exists: ${recipeData.name}`);
    return;
  }
  
  // Mark output item as craftable
  const outputItem = recipesData.items.find(i => i.id === outputItemId);
  if (outputItem) {
    outputItem.craftable = true;
  }
  
  // Create ingredient list
  const ingredients = recipeData.ingredients.map(([name, qty]) => {
    const ingredientId = ensureItem(name, "Materials");
    return {
      itemId: ingredientId,
      quantity: qty
    };
  });
  
  // Add recipe
  recipesData.recipes.push({
    id: recipeId,
    outputItemId: outputItemId,
    outputQuantity: recipeData.amount,
    station: "blacksmith",
    ingredients: ingredients
  });
  
  console.log(`✓ Added recipe: ${recipeData.name} (${recipeData.amount}x)`);
}

// Process all recipes
console.log("Starting to add Blacksmith recipes...\n");
blacksmithRecipes.forEach(addRecipe);

// Write back to file
fs.writeFileSync(recipesPath, JSON.stringify(recipesData, null, 2));
console.log(`\n✅ Done! Updated ${recipesPath}`);
