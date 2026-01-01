"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";

export function Header() {
  const pathname = usePathname();
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-[#28392e] bg-[#111813] px-6 py-3 z-20 shrink-0">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-white">
          <div className="size-8 text-[#13ec5b]">
            <span className="material-symbols-outlined text-3xl">token</span>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-tight">
            Enshrouded Calculator
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-white border-b-2 border-[#13ec5b] pb-0.5"
                : "text-[#9db9a6] hover:text-white"
            }`}
          >
            Calculator
          </Link>
          <Link
            href="/database"
            className={`text-sm font-medium transition-colors ${
              pathname === "/database"
                ? "text-white border-b-2 border-[#13ec5b] pb-0.5"
                : "text-[#9db9a6] hover:text-white"
            }`}
          >
            Database
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <SearchBar />
        </div>
        <button className="flex size-10 items-center justify-center rounded-full bg-[#1c2a21] hover:bg-[#28392e] transition-colors">
          <span className="material-symbols-outlined text-[#9db9a6]">settings</span>
        </button>
        <div className="size-9 rounded-full bg-[#1c2a21] overflow-hidden border border-[#28392e]">
          <img
            alt="User Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGs8LRhyxANuxH8bo5ddX-Ntfc_m8BfFk9YmMRMlTcjFYZrRlI6vQZX3GXrpEOdHd7WYehHnxNHdlMZCV9Ud2kyuviHOr1AVUjJmhB13X35uHTQbw5NPzJ-fJ3JjkJ7spG8kU7ZeDJFT--JJGKOJ3aRN_cWjerRbD-YupamdkR_xM4MlcqydVrBvQ0qeiodeaxfYhRIEHjRoHhTpzxho13BQ_RGzbs688zQhbxXGCfN9Vx4-IggYo0QWnst2YeVhLV4mqTXPhdjg"
          />
        </div>
      </div>
    </header>
  );
}
