"use client";

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#111813] border-r border-[#28392e] flex flex-col shrink-0 z-10">
      <div className="p-4 border-b border-[#28392e]">
        <h1 className="text-white text-lg font-bold mb-1">Catalog</h1>
        <p className="text-[#9db9a6] text-xs">Browse Recipes</p>
      </div>
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
        {/* Active Category */}
        <div className="group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1c2a21] border border-[#28392e] cursor-pointer">
          <span className="material-symbols-outlined text-[#13ec5b]">auto_fix</span>
          <div className="flex-1">
            <p className="text-white text-sm font-bold">Magical Items</p>
            <p className="text-xs text-[#9db9a6]">32 items</p>
          </div>
          <span className="material-symbols-outlined text-[#9db9a6] text-sm">
            expand_more
          </span>
        </div>
        
        {/* Indented List for Active Category */}
        <div className="pl-4 mt-1 space-y-1 mb-4 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-[#28392e]">
          <button className="flex w-full items-center justify-between px-3 py-2 rounded-md bg-[#13ec5b]/10 text-[#13ec5b] text-sm font-medium border-l-2 border-[#13ec5b]">
            <span>Ancient Spire...</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
          <button className="flex w-full items-center justify-between px-3 py-2 rounded-md text-[#9db9a6] hover:text-white hover:bg-[#1c2a21] text-sm transition-colors">
            <span>Staff of Healing</span>
          </button>
          <button className="flex w-full items-center justify-between px-3 py-2 rounded-md text-[#9db9a6] hover:text-white hover:bg-[#1c2a21] text-sm transition-colors">
            <span>Shroud Wand</span>
          </button>
        </div>

        {/* Other Categories */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1c2a21] cursor-pointer transition-colors text-[#9db9a6] hover:text-white">
          <span className="material-symbols-outlined">swords</span>
          <p className="text-sm font-medium">Weapons</p>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1c2a21] cursor-pointer transition-colors text-[#9db9a6] hover:text-white">
          <span className="material-symbols-outlined">shield</span>
          <p className="text-sm font-medium">Armor</p>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1c2a21] cursor-pointer transition-colors text-[#9db9a6] hover:text-white">
          <span className="material-symbols-outlined">home</span>
          <p className="text-sm font-medium">Base Building</p>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1c2a21] cursor-pointer transition-colors text-[#9db9a6] hover:text-white">
          <span className="material-symbols-outlined">lunch_dining</span>
          <p className="text-sm font-medium">Consumables</p>
        </div>
      </nav>
    </aside>
  );
}
