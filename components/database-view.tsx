"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { Input } from "./ui/input";
import type { Item, Recipe } from "@/lib/schemas";

type Tab = "items" | "recipes";

export function DatabaseView() {
  const resolver = useAppStore((state) => state.resolver);
  const [activeTab, setActiveTab] = useState<Tab>("items");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  if (!resolver) {
    return (
      <div className="flex-1 bg-[#0b100d] flex items-center justify-center">
        <p className="text-[#9db9a6] text-lg">Loading database...</p>
      </div>
    );
  }

  const allItems = resolver.getAllItems();
  const allRecipes = Array.from(resolver["recipesByOutputId"].values()).flat();
  const categories = ["all", ...resolver.getCategories()];

  // Filter items
  const filteredItems = useMemo(() => {
    let items = allItems;

    // Filter by category
    if (categoryFilter !== "all") {
      items = items.filter((item) => {
        const mainCategory = item.category?.split(" - ")[0];
        return item.category === categoryFilter || mainCategory === categoryFilter;
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.id.includes(query) ||
          item.category?.toLowerCase().includes(query)
      );
    }

    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [allItems, categoryFilter, searchQuery]);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    let recipes = allRecipes;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      recipes = recipes.filter((recipe) => {
        const item = resolver.getItem(recipe.outputItemId);
        return (
          item?.name.toLowerCase().includes(query) ||
          recipe.id.toLowerCase().includes(query) ||
          recipe.station?.toLowerCase().includes(query)
        );
      });
    }

    return recipes.sort((a, b) => {
      const itemA = resolver.getItem(a.outputItemId);
      const itemB = resolver.getItem(b.outputItemId);
      return (itemA?.name || "").localeCompare(itemB?.name || "");
    });
  }, [allRecipes, searchQuery, resolver]);

  return (
    <div className="flex-1 bg-[#0b100d] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#111813] border-b border-[#28392e] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold">Database</h1>
            <p className="text-[#9db9a6] text-sm">
              Browse all items and recipes in Enshrouded
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#9db9a6]">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>{allItems.length} items · {allRecipes.length} recipes</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "items"
                ? "bg-[#13ec5b]/20 text-[#13ec5b] border border-[#13ec5b]/30"
                : "bg-[#1c2a21] text-[#9db9a6] hover:text-white border border-[#28392e]"
            }`}
            onClick={() => setActiveTab("items")}
          >
            <span className="material-symbols-outlined text-sm mr-1 align-middle">inventory_2</span>
            Items ({allItems.length})
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "recipes"
                ? "bg-[#13ec5b]/20 text-[#13ec5b] border border-[#13ec5b]/30"
                : "bg-[#1c2a21] text-[#9db9a6] hover:text-white border border-[#28392e]"
            }`}
            onClick={() => setActiveTab("recipes")}
          >
            <span className="material-symbols-outlined text-sm mr-1 align-middle">auto_fix</span>
            Recipes ({allRecipes.length})
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9db9a6] material-symbols-outlined text-[20px]">
              search
            </span>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="h-10 w-full rounded-lg bg-[#1c2a21] pl-10 pr-4 text-sm text-white placeholder-[#9db9a6] border border-[#28392e] focus:border-[#13ec5b]"
            />
          </div>

          {activeTab === "items" && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 px-4 rounded-lg bg-[#1c2a21] text-sm text-white border border-[#28392e] focus:border-[#13ec5b] focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        {activeTab === "items" ? (
          <ItemsTable items={filteredItems} resolver={resolver} />
        ) : (
          <RecipesTable recipes={filteredRecipes} resolver={resolver} />
        )}
      </div>
    </div>
  );
}

function ItemsTable({ items, resolver }: { items: Item[]; resolver: any }) {
  return (
    <div className="bg-[#111813] border border-[#28392e] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#1c2a21] border-b border-[#28392e]">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-[#9db9a6] uppercase tracking-wider">
              Item
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-[#9db9a6] uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-[#9db9a6] uppercase tracking-wider">
              ID
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold text-[#9db9a6] uppercase tracking-wider">
              Craftable
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold text-[#9db9a6] uppercase tracking-wider">
              Recipes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#28392e]">
          {items.map((item) => {
            const recipes = resolver.getRecipes(item.id);
            return (
              <tr key={item.id} className="hover:bg-[#1c2a21]/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-[#1c2a21] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#13ec5b] text-sm">
                        {item.craftable ? "auto_fix" : "inventory_2"}
                      </span>
                    </div>
                    <span className="text-white text-sm font-medium">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[#9db9a6] text-sm">{item.category || "-"}</span>
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs text-[#9db9a6] bg-[#0b100d] px-2 py-1 rounded">
                    {item.id}
                  </code>
                </td>
                <td className="px-4 py-3 text-center">
                  {item.craftable ? (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#13ec5b]/20 text-[#13ec5b] border border-[#13ec5b]/30">
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#9db9a6]/20 text-[#9db9a6] border border-[#9db9a6]/30">
                      No
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-white text-sm font-medium">{recipes.length}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="py-12 text-center">
          <span className="material-symbols-outlined text-6xl text-[#9db9a6] mb-4 block opacity-50">
            search_off
          </span>
          <p className="text-[#9db9a6] text-sm">No items found</p>
        </div>
      )}
    </div>
  );
}

function RecipesTable({ recipes, resolver }: { recipes: Recipe[]; resolver: any }) {
  return (
    <div className="bg-[#111813] border border-[#28392e] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#1c2a21] border-b border-[#28392e]">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-[#9db9a6] uppercase tracking-wider">
              Output
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-[#9db9a6] uppercase tracking-wider">
              Station
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-[#9db9a6] uppercase tracking-wider">
              Ingredients
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold text-[#9db9a6] uppercase tracking-wider">
              Quantity
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#28392e]">
          {recipes.map((recipe) => {
            const outputItem = resolver.getItem(recipe.outputItemId);
            return (
              <tr key={recipe.id} className="hover:bg-[#1c2a21]/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-[#1c2a21] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#13ec5b] text-sm">
                        auto_fix
                      </span>
                    </div>
                    <span className="text-white text-sm font-medium">
                      {outputItem?.name || recipe.outputItemId}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#1c2a21] text-[#13ec5b] border border-[#28392e] capitalize">
                    {recipe.station || "Unknown"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.map((ing, idx) => {
                      const ingItem = resolver.getItem(ing.itemId);
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-[#0b100d] text-[#9db9a6] border border-[#28392e]"
                        >
                          {ingItem?.name || ing.itemId} x{ing.quantity}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-white text-sm font-bold">x{recipe.outputQuantity}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {recipes.length === 0 && (
        <div className="py-12 text-center">
          <span className="material-symbols-outlined text-6xl text-[#9db9a6] mb-4 block opacity-50">
            search_off
          </span>
          <p className="text-[#9db9a6] text-sm">No recipes found</p>
        </div>
      )}
    </div>
  );
}
