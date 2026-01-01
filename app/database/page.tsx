import { Header } from "@/components/header";
import { DatabaseView } from "@/components/database-view";
import { RecipesProvider } from "@/components/recipes-provider";

export default function DatabasePage() {
  return (
    <RecipesProvider>
      <div className="dark h-screen flex flex-col overflow-hidden">
        <Header />
        <DatabaseView />
      </div>
    </RecipesProvider>
  );
}
