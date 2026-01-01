"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import type { Item } from "@/lib/schemas";

const CATEGORY_ICONS: Record<string, string> = {
  "Magical Items": "auto_fix",
  "Materials": "inventory_2",
  "Production Places": "factory",
  "Production": "factory",
  "Weapons": "swords",
  "Armor": "shield",
  "Base Building": "home",
  "Comfort": "chair",
  "Decorative": "palette",
  "Essentials": "build",
  "Supplies": "inventory",
  "Survival": "hiking",
  "Tools": "handyman",
  "Resources": "diamond",
  "Consumables": "lunch_dining",
};

// Function to extract subcategory from item name or category
function getSubcategory(item: Item): string {
  const name = item.name.toLowerCase();
  
  // Armor subcategories
  if (name.includes('helmet') || name.includes('hood') || name.includes('hat')) return 'Helmets';
  if (name.includes('chest') || name.includes('chestplate')) return 'Chestplates';
  if (name.includes('glove') || name.includes('gauntlet')) return 'Gloves';
  if (name.includes('trouser') || name.includes('pants') || name.includes('legs')) return 'Legs';
  if (name.includes('boot') || name.includes('shoes') || name.includes('feet')) return 'Boots';
  
  // Weapon subcategories
  if (name.includes('shield') || name.includes('bulwark')) return 'Shields';
  if (name.includes('sword') || name.includes('club') || name.includes('axe') && item.category?.includes('One-Handed')) return 'One-Handed';
  if (name.includes('staff') || name.includes('bow') || item.category?.includes('Two-Handed')) return 'Two-Handed';
  
  // Tool subcategories  
  if (name.includes('pickaxe')) return 'Pickaxes';
  if (name.includes('axe') && item.category?.includes('Felling')) return 'Axes';
  
  // Use the part after " - " in category as subcategory
  if (item.category && item.category.includes(' - ')) {
    return item.category.split(' - ')[1];
  }
  
  return 'Other';
}

export function Sidebar() {
  const resolver = useAppStore((state) => state.resolver);
  const selectedItem = useAppStore((state) => state.selectedItem);
  const selectItem = useAppStore((state) => state.selectItem);
  
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);

  if (!resolver) {
    return (
      <aside className="w-64 bg-[#111813] border-r border-[#28392e] flex flex-col shrink-0 z-10">
        <div className="p-4">
          <p className="text-[#9db9a6] text-sm">Loading...</p>
        </div>
      </aside>
    );
  }

  const categories = resolver.getCategories();

  return (
    <aside className="w-64 bg-[#111813] border-r border-[#28392e] flex flex-col shrink-0 z-10">
      <div className="p-4 border-b border-[#28392e]">
        <h1 className="text-white text-lg font-bold mb-1">Catalog</h1>
        <p className="text-[#9db9a6] text-xs">Browse Recipes</p>
      </div>
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
        {categories.map((category) => {
          const items = resolver.getItemsByCategory(category);
          const craftableItems = items.filter((item) => item.craftable);
          const isExpanded = expandedCategory === category;

          // Group items by subcategory
          const itemsBySubcategory = new Map<string, Item[]>();
          craftableItems.forEach((item) => {
            const subcategory = getSubcategory(item);
            if (!itemsBySubcategory.has(subcategory)) {
              itemsBySubcategory.set(subcategory, []);
            }
            itemsBySubcategory.get(subcategory)!.push(item);
          });
          const subcategories = Array.from(itemsBySubcategory.keys()).sort();

          return (
            <div key={category}>
              {/* Main Category */}
              <div
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                  isExpanded
                    ? "bg-[#1c2a21] border border-[#28392e]"
                    : "hover:bg-[#1c2a21] text-[#9db9a6] hover:text-white"
                }`}
                onClick={() => {
                  setExpandedCategory(isExpanded ? null : category);
                  if (!isExpanded) setExpandedSubcategory(null);
                }}
              >
                <span className={`material-symbols-outlined ${isExpanded ? "text-[#13ec5b]" : ""}`}>
                  {CATEGORY_ICONS[category] || "category"}
                </span>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${isExpanded ? "text-white" : ""}`}>
                    {category}
                  </p>
                  <p className="text-xs text-[#9db9a6]">{craftableItems.length} items</p>
                </div>
                <span className="material-symbols-outlined text-[#9db9a6] text-sm">
                  {isExpanded ? "expand_more" : "chevron_right"}
                </span>
              </div>

              {/* Subcategories */}
              {isExpanded && subcategories.length > 0 && (
                <div className="pl-3 mt-1 space-y-1 mb-2">
                  {subcategories.map((subcategory) => {
                    const subcategoryItems = itemsBySubcategory.get(subcategory)!;
                    const subcategoryKey = `${category}-${subcategory}`;
                    const isSubExpanded = expandedSubcategory === subcategoryKey;

                    return (
                      <div key={subcategoryKey}>
                        {/* Subcategory Header */}
                        <div
                          className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                            isSubExpanded
                              ? "bg-[#0b100d] text-white"
                              : "text-[#9db9a6] hover:text-white hover:bg-[#1c2a21]/50"
                          }`}
                          onClick={() => setExpandedSubcategory(isSubExpanded ? null : subcategoryKey)}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {isSubExpanded ? "expand_more" : "chevron_right"}
                          </span>
                          <span className="text-xs font-medium flex-1">{subcategory}</span>
                          <span className="text-[10px] text-[#9db9a6]">{subcategoryItems.length}</span>
                        </div>

                        {/* Items in Subcategory */}
                        {isSubExpanded && (
                          <div className="pl-6 mt-1 space-y-0.5">
                            {subcategoryItems.map((item) => (
                              <button
                                key={item.id}
                                className={`flex w-full items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                  selectedItem?.id === item.id
                                    ? "bg-[#13ec5b]/10 text-[#13ec5b] border-l-2 border-[#13ec5b]"
                                    : "text-[#9db9a6] hover:text-white hover:bg-[#1c2a21]/50"
                                }`}
                                onClick={() => selectItem(item)}
                              >
                                <span className="truncate">{item.name}</span>
                                {selectedItem?.id === item.id && (
                                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
