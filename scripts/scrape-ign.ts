#!/usr/bin/env tsx

import * as cheerio from "cheerio";
import * as fs from "fs/promises";
import * as path from "path";
import {
  type Item,
  type Recipe,
  type RecipeBook,
  generateItemId,
  generateRecipeId,
  normalizeItemName,
  parseIngredient,
  validateRecipeBook,
} from "../lib/schemas";

const IGN_BASE_URL = "https://www.ign.com";
const ALL_RECIPES_URL = `${IGN_BASE_URL}/wikis/enshrouded/All_Recipes`;

interface ScraperOptions {
  usePlaywright?: boolean;
  verbose?: boolean;
}

/**
 * Fetch HTML content from URL
 */
async function fetchHTML(url: string): Promise<string> {
  console.log(`Fetching: ${url}`);
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.text();
}

/**
 * Fallback: Use Playwright for JavaScript-rendered pages
 */
async function fetchWithPlaywright(url: string): Promise<string> {
  console.log(`Fetching with Playwright: ${url}`);
  const { chromium } = await import("playwright");
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: "networkidle" });
    const content = await page.content();
    return content;
  } finally {
    await browser.close();
  }
}

/**
 * Extract recipe sections from the All_Recipes page
 */
function extractRecipeSections($: cheerio.CheerioAPI): Array<{ category: string; tables: cheerio.Cheerio<cheerio.Element> }> {
  const sections: Array<{ category: string; tables: cheerio.Cheerio<cheerio.Element> }> = [];
  
  // Find all h2 headings (categories like "Alchemist Recipes", "Blacksmith Recipes")
  $("h2").each((_, elem) => {
    const heading = $(elem);
    const categoryText = heading.find(".mw-headline").text().trim();
    
    if (!categoryText || categoryText.toLowerCase().includes("navigation")) {
      return;
    }
    
    // Find tables after this heading
    const tables = heading.nextUntil("h2", "table.wikitable");
    
    if (tables.length > 0) {
      sections.push({ category: categoryText, tables });
    }
  });
  
  return sections;
}

/**
 * Parse a recipe table and extract items/recipes
 */
function parseRecipeTable(
  $: cheerio.CheerioAPI,
  table: cheerio.Cheerio<cheerio.Element>,
  category: string,
  itemsMap: Map<string, Item>,
  recipesArray: Recipe[]
): void {
  const rows = table.find("tbody tr").slice(1); // Skip header row
  
  rows.each((_, row) => {
    try {
      const cells = $(row).find("td");
      
      if (cells.length < 3) return; // Invalid row
      
      // Column structure: Icon | Name | Resources | Description | Requirements
      const iconCell = $(cells[0]);
      const nameCell = $(cells[1]);
      const resourcesCell = $(cells[2]);
      const descriptionCell = cells.length > 3 ? $(cells[3]) : null;
      const requirementsCell = cells.length > 4 ? $(cells[4]) : null;
      
      // Extract item name
      const itemName = nameCell.text().trim();
      if (!itemName) return;
      
      const itemId = generateItemId(itemName);
      
      // Extract icon URL
      const iconImg = iconCell.find("img").first();
      let iconUrl = "";
      if (iconImg.length > 0) {
        iconUrl = iconImg.attr("src") || iconImg.attr("data-src") || "";
        if (iconUrl && !iconUrl.startsWith("http")) {
          iconUrl = IGN_BASE_URL + iconUrl;
        }
      }
      
      // Extract description
      const description = descriptionCell ? descriptionCell.text().trim() : "";
      
      // Extract requirements (station/level)
      const requirements = requirementsCell ? requirementsCell.text().trim() : "";
      
      // Determine station from requirements or category
      let station: string | undefined;
      if (requirements) {
        station = normalizeItemName(requirements.split(" ")[0]); // e.g., "Blacksmith" -> "blacksmith"
      } else if (category.toLowerCase().includes("recipes")) {
        station = normalizeItemName(category.replace(/recipes?/i, "").trim());
      }
      
      // Parse ingredients from Resources cell
      const resourcesText = resourcesCell.text().trim();
      const ingredientLines = resourcesText.split(/[-\n]/).filter((line) => line.trim());
      
      const ingredients: Array<{ itemId: string; quantity: number }> = [];
      
      for (const line of ingredientLines) {
        const parsed = parseIngredient(line);
        if (!parsed) continue;
        
        const ingredientId = generateItemId(parsed.name);
        
        // Add ingredient item to items map if not exists
        if (!itemsMap.has(ingredientId)) {
          itemsMap.set(ingredientId, {
            id: ingredientId,
            name: parsed.name,
            normalizedName: normalizeItemName(parsed.name),
            craftable: false, // Will be updated if we find a recipe for it
            iconUrl: "",
            category: "material",
          });
        }
        
        ingredients.push({
          itemId: ingredientId,
          quantity: parsed.quantity,
        });
      }
      
      if (ingredients.length === 0) return; // No valid ingredients
      
      // Add or update the output item
      if (!itemsMap.has(itemId)) {
        itemsMap.set(itemId, {
          id: itemId,
          name: itemName,
          normalizedName: normalizeItemName(itemName),
          craftable: true,
          iconUrl,
          category,
          description,
        });
      } else {
        // Update existing item to mark as craftable
        const existing = itemsMap.get(itemId)!;
        existing.craftable = true;
        if (iconUrl && !existing.iconUrl) existing.iconUrl = iconUrl;
        if (description && !existing.description) existing.description = description;
      }
      
      // Create recipe
      const recipeId = generateRecipeId(itemId, station);
      
      recipesArray.push({
        id: recipeId,
        outputItemId: itemId,
        outputQuantity: 1, // Default, can be extracted if format changes
        station,
        ingredients,
        requirements,
      });
      
    } catch (error) {
      console.error("Error parsing row:", error);
    }
  });
}

/**
 * Main scraping function
 */
async function scrapeRecipes(options: ScraperOptions = {}): Promise<RecipeBook> {
  console.log("🔍 Starting Enshrouded recipe scraper...\n");
  
  let html: string;
  
  try {
    html = await fetchHTML(ALL_RECIPES_URL);
  } catch (error) {
    console.error("❌ Failed to fetch with regular HTTP:", error);
    
    if (options.usePlaywright) {
      console.log("🎭 Trying fallback with Playwright...");
      html = await fetchWithPlaywright(ALL_RECIPES_URL);
    } else {
      throw new Error("Scraping failed. Try again with --playwright flag.");
    }
  }
  
  const $ = cheerio.load(html);
  
  const itemsMap = new Map<string, Item>();
  const recipesArray: Recipe[] = [];
  
  // Extract all recipe sections
  const sections = extractRecipeSections($);
  console.log(`📋 Found ${sections.length} recipe sections\n`);
  
  for (const { category, tables } of sections) {
    console.log(`Processing: ${category}`);
    
    tables.each((_, table) => {
      parseRecipeTable($, $(table), category, itemsMap, recipesArray);
    });
  }
  
  const items = Array.from(itemsMap.values());
  
  console.log(`\n✅ Scraped ${items.length} items and ${recipesArray.length} recipes`);
  
  // Create RecipeBook
  const recipeBook: RecipeBook = {
    items,
    recipes: recipesArray,
    meta: {
      scrapedAt: new Date().toISOString(),
      version: "1.0.0",
      source: ALL_RECIPES_URL,
      totalItems: items.length,
      totalRecipes: recipesArray.length,
    },
  };
  
  // Validate with Zod
  try {
    validateRecipeBook(recipeBook);
    console.log("✅ Validation passed");
  } catch (error) {
    console.error("❌ Validation failed:", error);
    throw error;
  }
  
  return recipeBook;
}

/**
 * Save recipe book to JSON file
 */
async function saveRecipeBook(recipeBook: RecipeBook, outputPath: string): Promise<void> {
  const dir = path.dirname(outputPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(recipeBook, null, 2), "utf-8");
  console.log(`\n💾 Saved to: ${outputPath}`);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const usePlaywright = args.includes("--playwright");
  const verbose = args.includes("--verbose");
  
  try {
    const recipeBook = await scrapeRecipes({ usePlaywright, verbose });
    
    const outputPath = path.join(process.cwd(), "data", "recipes.json");
    await saveRecipeBook(recipeBook, outputPath);
    
    console.log("\n🎉 Scraping completed successfully!");
  } catch (error) {
    console.error("\n❌ Scraping failed:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { scrapeRecipes, saveRecipeBook };
