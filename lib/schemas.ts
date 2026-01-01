import { z } from "zod";

/**
 * Schema for a single ingredient in a recipe
 */
export const IngredientSchema = z.object({
  itemId: z.string().min(1, "Item ID must not be empty"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

export type Ingredient = z.infer<typeof IngredientSchema>;

/**
 * Schema for an Item in the game
 */
export const ItemSchema = z.object({
  id: z.string().min(1, "Item ID must not be empty"),
  name: z.string().min(1, "Item name must not be empty"),
  normalizedName: z.string().min(1, "Normalized name must not be empty"),
  category: z.string().optional(),
  iconUrl: z.string().url().optional().or(z.literal("")),
  craftable: z.boolean().default(false),
  description: z.string().optional(),
});

export type Item = z.infer<typeof ItemSchema>;

/**
 * Schema for a crafting Recipe
 */
export const RecipeSchema = z.object({
  id: z.string().min(1, "Recipe ID must not be empty"),
  outputItemId: z.string().min(1, "Output item ID must not be empty"),
  outputQuantity: z.number().int().positive("Output quantity must be positive").default(1),
  station: z.string().optional(), // e.g., "blacksmith", "alchemist", "forge"
  ingredients: z.array(IngredientSchema).min(1, "Recipe must have at least one ingredient"),
  requirements: z.string().optional(), // e.g., "Blacksmith level 5"
});

export type Recipe = z.infer<typeof RecipeSchema>;

/**
 * Metadata about the recipe data
 */
export const MetaSchema = z.object({
  scrapedAt: z.string().datetime(),
  version: z.string().default("1.0.0"),
  source: z.string().url(),
  totalItems: z.number().int().nonnegative(),
  totalRecipes: z.number().int().nonnegative(),
});

export type Meta = z.infer<typeof MetaSchema>;

/**
 * Complete RecipeBook schema - the structure of recipes.json
 */
export const RecipeBookSchema = z.object({
  items: z.array(ItemSchema),
  recipes: z.array(RecipeSchema),
  meta: MetaSchema,
});

export type RecipeBook = z.infer<typeof RecipeBookSchema>;

/**
 * Normalize item name to create stable IDs
 * Converts to lowercase, removes special chars, replaces spaces with hyphens
 */
export function normalizeItemName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD") // Decompose unicode characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate a stable ID from an item name
 */
export function generateItemId(name: string): string {
  return normalizeItemName(name);
}

/**
 * Generate a recipe ID from output item and station
 */
export function generateRecipeId(outputItemId: string, station?: string): string {
  const base = `recipe-${outputItemId}`;
  return station ? `${base}-${normalizeItemName(station)}` : base;
}

/**
 * Parse ingredient string like "30x Stone" or "10x Metal Scraps"
 */
export function parseIngredient(ingredientStr: string): { quantity: number; name: string } | null {
  const match = ingredientStr.trim().match(/^(\d+)x?\s*(.+)$/i);
  if (!match) return null;
  
  return {
    quantity: parseInt(match[1], 10),
    name: match[2].trim(),
  };
}

/**
 * Validate RecipeBook and return typed result
 */
export function validateRecipeBook(data: unknown): RecipeBook {
  return RecipeBookSchema.parse(data);
}
