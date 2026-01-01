import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { CraftingVisualization } from "@/components/crafting-visualization";
import { MaterialsList } from "@/components/materials-list";
import { RecipesProvider } from "@/components/recipes-provider";

export default function Home() {
  return (
    <RecipesProvider>
      <div className="dark h-screen flex flex-col overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <CraftingVisualization />
          <MaterialsList />
        </div>
      </div>
    </RecipesProvider>
  );
}
