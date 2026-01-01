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

// All Blacksmith recipes from the provided list
const blacksmithRecipes = [
  // Armor - Unique Equipment
  { name: "Greatsword Gauntlets", amount: 1, ingredients: [["Green Vitriol Dust", 5], ["Capybara Bristles", 2], ["Gold Dust", 1], ["Red Fabric", 1], ["Cursed Shroud Sack", 1]], category: "Armor - Unique Equipment" },
  { name: "Miner Helmet", amount: 1, ingredients: [["Capybara Bristles", 2], ["Underwater Luminous Growth", 5], ["Steel Bars", 2], ["Gleam Root Dust", 5], ["Aquamarine", 5]], category: "Armor - Unique Equipment" },
  
  // Armor - Golden Bulwark
  { name: "Golden Bulwark Helmet", amount: 1, ingredients: [["Capybara Bristles", 1], ["Green Vitriol Dust", 5], ["Gold Bars", 2], ["Chitin Powder", 1]], category: "Armor - Golden Bulwark" },
  { name: "Golden Bulwark Chest Plate", amount: 1, ingredients: [["Capybara Bristles", 4], ["Green Vitriol Dust", 6], ["Gold Bars", 2], ["Bursting Fell Heart", 1], ["Red Fabric", 2]], category: "Armor - Golden Bulwark" },
  { name: "Golden Bulwark Gloves", amount: 1, ingredients: [["Green Vitriol Dust", 5], ["Capybara Bristles", 2], ["Gold Dust", 1], ["Red Fabric", 1], ["Cursed Shroud Sack", 1]], category: "Armor - Golden Bulwark" },
  { name: "Golden Bulwark Pants", amount: 1, ingredients: [["Palm Leaves", 4], ["Pink Mushroom Meat", 50], ["Capybara Bristles", 4], ["Steel Bars", 2], ["Corrupted Boar Tusk", 1]], category: "Armor - Golden Bulwark" },
  { name: "Golden Bulwark Boots", amount: 1, ingredients: [["Water Reptile Leather", 6], ["Capybara Bristles", 2], ["Gold Dust", 10], ["Shroud Sludge", 1]], category: "Armor - Golden Bulwark" },
  
  // Armor - Sunpiercer
  { name: "Sunpiercer Helmet", amount: 1, ingredients: [["Capybara Bristles", 1], ["Palm Leaves", 5], ["Green Vitriol Dust", 5], ["Chitin Powder", 1]], category: "Armor - Sunpiercer" },
  { name: "Sunpiercer Chestplate", amount: 1, ingredients: [["Capybara Bristles", 4], ["Green Vitriol Dust", 10], ["Water Reptile Leather", 2], ["Gold Bars", 2], ["Bursting Fell Heart", 1]], category: "Armor - Sunpiercer" },
  { name: "Sunpiercer Gloves", amount: 1, ingredients: [["Capybara Bristles", 2], ["Gold Dust", 5], ["Green Vitriol Dust", 2], ["Cursed Shroud Sack", 1], ["Water Reptile Leather", 1]], category: "Armor - Sunpiercer" },
  { name: "Sunpiercer Pants", amount: 1, ingredients: [["Steel Bars", 6], ["Fabric", 4], ["Capybara Bristles", 4], ["Palm Leaves", 4], ["Corrupted Boar Tusk", 1]], category: "Armor - Sunpiercer" },
  { name: "Sunpiercer Shoes", amount: 1, ingredients: [["Steel Bars", 6], ["Gold Dust", 10], ["Capybara Bristles", 2], ["Shroud Sludge", 1]], category: "Armor - Sunpiercer" },
  
  // Armor - Brazen Bull Set
  { name: "Brazen Bull Helmet", amount: 1, ingredients: [["Obsidian", 2], ["Coal", 4], ["Warm Padding", 3], ["Steel Bars", 5], ["Amethyst", 3], ["Enshrouded Ice", 50]], category: "Armor - Brazen Bull Set" },
  { name: "Brazen Bull Chest", amount: 1, ingredients: [["Coal", 10], ["Warm Padding", 8], ["Steel Bars", 12], ["Obsidian", 5], ["Amethyst", 10], ["Enshrouded Ice", 50]], category: "Armor - Brazen Bull Set" },
  { name: "Brazen Bull Gloves", amount: 1, ingredients: [["Coal", 4], ["Warm Padding", 4], ["Charcoal", 4], ["Obsidian", 2], ["Amethyst", 2], ["Chitin Powder", 25]], category: "Armor - Brazen Bull Set" },
  { name: "Brazen Bull Trousers", amount: 1, ingredients: [["Coal", 6], ["Warm Padding", 6], ["Steel Bars", 8]], category: "Armor - Brazen Bull Set" },
  { name: "Brazen Bull Boots", amount: 1, ingredients: [["Coal", 4], ["Warm Padding", 4], ["Steel Bars", 6], ["Chitin Powder", 25]], category: "Armor - Brazen Bull Set" },
  
  // Armor - Wolf's Fang Set
  { name: "Wolf's Fang Hood", amount: 1, ingredients: [["Silver Bars", 1], ["Warm Padding", 1], ["Hardened Leather", 3], ["Enshrouded Cyclops Eye", 1]], category: "Armor - Wolf's Fang Set" },
  { name: "Wolf's Fang Chest", amount: 1, ingredients: [["Silver Bars", 21], ["Warm Padding", 6], ["Hardened Leather", 10], ["Enshrouded Ice", 50]], category: "Armor - Wolf's Fang Set" },
  { name: "Wolf's Fang Gloves", amount: 1, ingredients: [["Fossilized Bone Dust", 2], ["Warm Padding", 3], ["Scales", 10], ["Chitin Powder", 25]], category: "Armor - Wolf's Fang Set" },
  { name: "Wolf's Fang Trousers", amount: 1, ingredients: [["Warm Padding", 5], ["Hardened Leather", 6], ["Enshrouded Ice", 50]], category: "Armor - Wolf's Fang Set" },
  { name: "Wolf's Fang Boots", amount: 1, ingredients: [["Warm Padding", 2], ["Hardened Leather", 6], ["Chitin Powder", 25]], category: "Armor - Wolf's Fang Set" },
  
  // Armor - Mountain's Shadow Set
  { name: "Mountain's Shadow Helmet", amount: 1, ingredients: [["Coal", 2], ["Warm Padding", 4], ["Steel Bars", 2], ["Obsidian", 3], ["Enshrouded Ice", 50]], category: "Armor - Mountain's Shadow Set" },
  { name: "Mountain's Shadow Chest", amount: 1, ingredients: [["Obsidian", 10], ["Coal", 6], ["Warm Padding", 8], ["Steel Bars", 6], ["Enshrouded Ice", 50]], category: "Armor - Mountain's Shadow Set" },
  { name: "Mountain's Shadow Gloves", amount: 1, ingredients: [["Obsidian", 4], ["Coal", 3], ["Warm Padding", 4], ["Steel Bars", 3], ["Chitin Powder", 25]], category: "Armor - Mountain's Shadow Set" },
  { name: "Mountain's Shadow Trousers", amount: 1, ingredients: [["Padding", 4], ["Warm Padding", 7], ["Steel Bars", 4], ["Enshrouded Ice", 50]], category: "Armor - Mountain's Shadow Set" },
  { name: "Mountain's Shadow Boots", amount: 1, ingredients: [["Coal", 3], ["Warm Padding", 5], ["Steel Bars", 3], ["Chitin Powder", 25]], category: "Armor - Mountain's Shadow Set" },
  
  // Armor - Warden Set
  { name: "Warden Helmet", amount: 1, ingredients: [["Lapislazuli", 2], ["Padding", 2], ["Iron Bars", 3], ["Charcoal", 5], ["Enshrouded Vulture Talon", 2]], category: "Armor - Warden Set" },
  { name: "Warden Chestplate", amount: 1, ingredients: [["Padding", 8], ["Iron Bars", 8], ["Charcoal", 12], ["Lapislazuli", 5], ["Fell Heart", 1]], category: "Armor - Warden Set" },
  { name: "Warden Gloves", amount: 1, ingredients: [["Padding", 4], ["Iron Bars", 4], ["Charcoal", 8], ["Lapislazuli", 4], ["Enshrouded Vulture Talon", 5]], category: "Armor - Warden Set" },
  { name: "Warden Trousers", amount: 1, ingredients: [["Padding", 6], ["Iron Bars", 6], ["Charcoal", 9], ["Shroud Sand", 25]], category: "Armor - Warden Set" },
  { name: "Warden Boots", amount: 1, ingredients: [["Padding", 4], ["Iron Bars", 4], ["Charcoal", 8], ["Leather", 2], ["Mist of a Fell Sicklescythe", 1]], category: "Armor - Warden Set" },
  
  // Armor - Rogue Set
  { name: "Rogue Helmet", amount: 1, ingredients: [["Fossilized Bone Dust", 5], ["Padding", 1], ["Scales", 15], ["Enshrouded Vulture Talon", 2]], category: "Armor - Rogue Set" },
  { name: "Rogue Chestplate", amount: 1, ingredients: [["Fossilized Bone Dust", 10], ["Padding", 6], ["Scales", 30], ["Fell Heart", 3]], category: "Armor - Rogue Set" },
  { name: "Rogue Gloves", amount: 1, ingredients: [["Fossilized Bone Dust", 2], ["Padding", 3], ["Scales", 10], ["Enshrouded Vulture Talon", 5]], category: "Armor - Rogue Set" },
  { name: "Rogue Trousers", amount: 1, ingredients: [["Padding", 5], ["Scales", 20], ["Brittle Shroud Flakes", 25]], category: "Armor - Rogue Set" },
  { name: "Rogue Boots", amount: 1, ingredients: [["Leather", 4], ["Padding", 2], ["Scales", 10], ["Mist of a Fell Sicklescythe", 1]], category: "Armor - Rogue Set" },
  
  // Armor - Soldier Set
  { name: "Soldier Helmet", amount: 1, ingredients: [["Padding", 1], ["Charcoal", 4], ["Iron Bars", 1], ["Enshrouded Vulture Talon", 2]], category: "Armor - Soldier Set" },
  { name: "Soldier Chestplate", amount: 1, ingredients: [["Lapislazuli", 3], ["Padding", 5], ["Charcoal", 8], ["Iron Bars", 5], ["Fell Heart", 1]], category: "Armor - Soldier Set" },
  { name: "Soldier Gloves", amount: 1, ingredients: [["Lapislazuli", 2], ["Padding", 2], ["Charcoal", 4], ["Iron Bars", 2], ["Enshrouded Vulture Talon", 5]], category: "Armor - Soldier Set" },
  { name: "Soldier Trousers", amount: 1, ingredients: [["Padding", 4], ["Charcoal", 7], ["Iron Bars", 4], ["Shroud Sand", 25]], category: "Armor - Soldier Set" },
  { name: "Soldier Boots", amount: 1, ingredients: [["Padding", 2], ["Charcoal", 5], ["Iron Bars", 2], ["Mist of a Fell Sicklescythe", 1]], category: "Armor - Soldier Set" },
  
  // Armor - Blackguard Set
  { name: "Blackguard Helmet", amount: 1, ingredients: [["Critter Glands", 4], ["Monstrous Ribs", 1], ["Bronze Bars", 3]], category: "Armor - Blackguard Set" },
  { name: "Blackguard Chest", amount: 1, ingredients: [["Critter Glands", 6], ["Monstrous Ribs", 4], ["Linen", 5], ["Bronze Bars", 5]], category: "Armor - Blackguard Set" },
  { name: "Blackguard Gloves", amount: 1, ingredients: [["Critter Glands", 5], ["Monstrous Ribs", 3], ["Leather", 4]], category: "Armor - Blackguard Set" },
  { name: "Blackguard Trousers", amount: 1, ingredients: [["Critter Glands", 6], ["Monstrous Ribs", 2], ["Linen", 3], ["Bronze Bars", 5]], category: "Armor - Blackguard Set" },
  { name: "Blackguard Boots", amount: 1, ingredients: [["Critter Glands", 4], ["Monstrous Ribs", 2], ["Leather", 2], ["Bronze Bars", 2]], category: "Armor - Blackguard Set" },
  
  // Armor - Guardian Set
  { name: "Guardian Helmet", amount: 1, ingredients: [["Amber", 3], ["Charcoal", 2], ["Bronze Bars", 3], ["Petrified Shroud Stalker Shell", 5]], category: "Armor - Guardian Set" },
  { name: "Guardian Chestplate", amount: 1, ingredients: [["Linen", 5], ["Leather", 4], ["Bronze Bars", 6], ["Amber", 3], ["Charcoal", 3], ["Critter Glands", 6]], category: "Armor - Guardian Set" },
  { name: "Guardian Gloves", amount: 1, ingredients: [["Linen", 2], ["Leather", 2], ["Bronze Bars", 3], ["Amber", 2], ["Charcoal", 2], ["Shroud Adhesive", 3]], category: "Armor - Guardian Set" },
  { name: "Guardian Trousers", amount: 1, ingredients: [["Linen", 4], ["Leather", 3], ["Charcoal", 2], ["Bronze Bars", 4], ["Acidic Mycelium", 15]], category: "Armor - Guardian Set" },
  { name: "Guardian Boots", amount: 1, ingredients: [["Linen", 6], ["Leather", 2], ["Amber", 4], ["Bronze Bars", 3], ["Charcoal", 2], ["Corrosive Blood", 5]], category: "Armor - Guardian Set" },
  
  // Armor - Mercenary Set
  { name: "Mercenary Helmet", amount: 1, ingredients: [["Charcoal", 2], ["Bronze Bars", 2], ["Petrified Shroud Stalker Shell", 5]], category: "Armor - Mercenary Set" },
  { name: "Mercenary Chest", amount: 1, ingredients: [["Linen", 5], ["Leather", 3], ["Charcoal", 3], ["Bronze Bars", 4], ["Amber", 6], ["Critter Glands", 6]], category: "Armor - Mercenary Set" },
  { name: "Mercenary Gloves", amount: 1, ingredients: [["Linen", 2], ["Leather", 1], ["Charcoal", 2], ["Bronze Bars", 2], ["Ammonia Gland", 1]], category: "Armor - Mercenary Set" },
  { name: "Mercenary Trousers", amount: 1, ingredients: [["Linen", 4], ["Leather", 2], ["Charcoal", 2], ["Bronze Bars", 3], ["Mint Mushroom Meat", 15]], category: "Armor - Mercenary Set" },
  { name: "Mercenary Boots", amount: 1, ingredients: [["Linen", 6], ["Leather", 2], ["Charcoal", 2], ["Bronze Bars", 3], ["Corrosive Blood", 5]], category: "Armor - Mercenary Set" },
  
  // Armor - Tank Set
  { name: "Tank Helmet", amount: 1, ingredients: [["Copper Bar", 2], ["Charcoal", 2], ["Corrupted Boar Tusk", 2]], category: "Armor - Tank Set" },
  { name: "Tank Chestplate", amount: 1, ingredients: [["Linen", 5], ["Charcoal", 3], ["Dried Fur", 2], ["Copper Bar", 5], ["Amber", 3], ["Giant Critter Scales", 5]], category: "Armor - Tank Set" },
  { name: "Tank Gloves", amount: 1, ingredients: [["Resin", 1], ["Dried Fur", 1], ["Linen", 2], ["Copper Bar", 2], ["Charcoal", 2], ["Shroud Sack", 1]], category: "Armor - Tank Set" },
  { name: "Tank Trousers", amount: 1, ingredients: [["Linen", 3], ["Dried Fur", 1], ["Copper Bar", 3], ["Charcoal", 4], ["Shroud Mushroom", 5]], category: "Armor - Tank Set" },
  { name: "Tank Boots", amount: 1, ingredients: [["Linen", 2], ["Charcoal", 2], ["Dried Fur", 2], ["Copper Bar", 2], ["Brittle Shroud Petals", 1]], category: "Armor - Tank Set" },
  
  // Armor - Adventurer Set
  { name: "Adventurer Helmet", amount: 1, ingredients: [["Copper Bar", 1], ["Charcoal", 1], ["Corrupted Boar Tusk", 2]], category: "Armor - Adventurer Set" },
  { name: "Adventurer Chest", amount: 1, ingredients: [["Linen", 5], ["Dried Fur", 2], ["Copper Bar", 3], ["Charcoal", 3], ["Giant Critter Scales", 5]], category: "Armor - Adventurer Set" },
  { name: "Adventurer Gloves", amount: 1, ingredients: [["Dried Fur", 2], ["Copper Bar", 1], ["Charcoal", 1], ["Linen", 3], ["Shroud Sack", 1]], category: "Armor - Adventurer Set" },
  { name: "Adventurer Trousers", amount: 1, ingredients: [["Linen", 2], ["Dried Fur", 1], ["Copper Bar", 2], ["Charcoal", 2], ["Shroud Mushroom", 5]], category: "Armor - Adventurer Set" },
  { name: "Adventurer Boots", amount: 1, ingredients: [["Linen", 6], ["Dried Fur", 2], ["Copper Bar", 1], ["Charcoal", 1], ["Brittle Shroud Petals", 1], ["Plant Fiber", 1]], category: "Armor - Adventurer Set" },
  
  // Armor - Rising Fighter Set
  { name: "Rising Fighter Helmet", amount: 1, ingredients: [["Metal Sheets", 1], ["Animal Fur", 1], ["Resin", 3], ["Aerated Banshee Gel", 1]], category: "Armor - Rising Fighter Set" },
  { name: "Rising Fighter Chest", amount: 1, ingredients: [["String", 4], ["Animal Fur", 4], ["Resin", 2], ["Metal Sheets", 3], ["Active Mycelium", 25]], category: "Armor - Rising Fighter Set" },
  { name: "Rising Fighter Gloves", amount: 1, ingredients: [["String", 4], ["Animal Fur", 2], ["Metal Sheets", 2], ["Aerated Banshee Gel", 1]], category: "Armor - Rising Fighter Set" },
  { name: "Rising Fighter Trousers", amount: 1, ingredients: [["Metal Sheets", 2], ["String", 4], ["Animal Fur", 3], ["Shroud Liquid", 5]], category: "Armor - Rising Fighter Set" },
  { name: "Rising Fighter Boots", amount: 1, ingredients: [["Animal Fur", 2], ["Resin", 5], ["Metal Sheets", 1], ["Mycelium", 15]], category: "Armor - Rising Fighter Set" },
  
  // Armor - Fur Armor Set
  { name: "Fur Boots", amount: 1, ingredients: [["Torn Cloth", 2], ["Animal Fur", 1], ["String", 2]], category: "Armor - Fur Armor Set" },
  { name: "Fur Chest", amount: 1, ingredients: [["String", 2], ["Torn Cloth", 1], ["Animal Fur", 3], ["Metal Scraps", 2]], category: "Armor - Fur Armor Set" },
  { name: "Fur Gloves", amount: 1, ingredients: [["Torn Cloth", 2], ["Metal Scraps", 2], ["String", 1]], category: "Armor - Fur Armor Set" },
  { name: "Fur Hood", amount: 1, ingredients: [["Torn Cloth", 1], ["Animal Fur", 1], ["String", 2]], category: "Armor - Fur Armor Set" },
  { name: "Fur Trousers", amount: 1, ingredients: [["Torn Cloth", 1], ["Animal Fur", 2], ["String", 2], ["Metal Scraps", 1]], category: "Armor - Fur Armor Set" },
  
  // Decorative items and other crafts would continue here...
  // Adding key decorative items
  { name: "Iron Fireplace", amount: 1, ingredients: [["Charcoal", 8], ["Iron Bars", 8]], category: "Comfort - Fireplaces" },
  { name: "Urn", amount: 1, ingredients: [["Bronze Bars", 2], ["Charcoal", 2]], category: "Decorative - Clutter" },
  { name: "Fire Bowl", amount: 1, ingredients: [["Bronze Bars", 2], ["Charcoal", 2]], category: "Decorative - Clutter" },
  { name: "Jewelry Box", amount: 1, ingredients: [["Bronze Bars", 2], ["Charcoal", 2]], category: "Decorative - Clutter" },
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
      craftable: true  // All items being added are craftable
    });
    console.log(`✓ Added item: ${name}`);
  } else if (!existingItem.craftable) {
    // Update to craftable if it wasn't before
    existingItem.craftable = true;
    console.log(`✓ Updated to craftable: ${name}`);
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
console.log("Starting to add Blacksmith armor and decorative recipes...\n");
blacksmithRecipes.forEach(addRecipe);

// Write back to file
fs.writeFileSync(recipesPath, JSON.stringify(recipesData, null, 2));
console.log(`\n✅ Done! Updated ${recipesPath}`);
console.log(`Total items: ${recipesData.items.length}`);
console.log(`Total recipes: ${recipesData.recipes.length}`);
