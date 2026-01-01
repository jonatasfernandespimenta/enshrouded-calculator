import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { CraftingTree } from "@/components/crafting-tree";
import { MaterialsList } from "@/components/materials-list";

export default function Home() {
  return (
    <div className="dark h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <CraftingTree />
        <MaterialsList />
      </div>
    </div>
  );
}
