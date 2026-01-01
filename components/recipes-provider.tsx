"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import recipeBookData from "@/data/recipes.json";

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const loadRecipeBook = useAppStore((state) => state.loadRecipeBook);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load recipe book on mount
    loadRecipeBook(recipeBookData as any);
    setIsLoaded(true);
  }, [loadRecipeBook]);

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0b100d]">
        <div className="text-center">
          <div className="size-12 border-4 border-[#13ec5b] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading recipes...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
