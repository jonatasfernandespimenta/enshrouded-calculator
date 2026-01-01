"use client";

import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import Fuse from "fuse.js";
import type { Item } from "@/lib/schemas";
import { Input } from "./ui/input";

export function SearchBar() {
  const resolver = useAppStore((state) => state.resolver);
  const selectItem = useAppStore((state) => state.selectItem);
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize Fuse.js
  const fuse = useRef<Fuse<Item> | null>(null);

  useEffect(() => {
    if (resolver) {
      const items = resolver.getAllItems().filter((item) => item.craftable);
      fuse.current = new Fuse(items, {
        keys: ["name", "normalizedName", "category", "description"],
        threshold: 0.3,
        includeScore: true,
      });
    }
  }, [resolver]);

  // Handle search
  useEffect(() => {
    if (!fuse.current || query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchResults = fuse.current.search(query);
    const items = searchResults.slice(0, 10).map((result) => result.item);
    setResults(items);
    setIsOpen(items.length > 0);
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case "Enter":
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle item selection
  const handleSelect = (item: Item) => {
    selectItem(item);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-64">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9db9a6] material-symbols-outlined text-[20px] pointer-events-none">
        search
      </span>
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
        placeholder="Search item..."
        className="h-10 w-full rounded-lg bg-[#1c2a21] pl-10 pr-4 text-sm text-white placeholder-[#9db9a6] focus:outline-none focus:ring-1 focus:ring-[#13ec5b] border border-transparent focus:border-[#13ec5b] transition-all"
      />

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto custom-scrollbar bg-[#111813] border border-[#28392e] rounded-lg shadow-xl z-50"
        >
          {results.map((item, index) => (
            <button
              key={item.id}
              className={`w-full px-4 py-3 text-left transition-colors flex items-center gap-3 ${
                index === selectedIndex
                  ? "bg-[#1c2a21] border-l-2 border-[#13ec5b]"
                  : "hover:bg-[#1c2a21]/50"
              }`}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="size-8 rounded bg-[#1c2a21] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#13ec5b] text-sm">
                  auto_fix
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{item.name}</p>
                {item.category && (
                  <p className="text-[#9db9a6] text-xs truncate">{item.category}</p>
                )}
              </div>
              {index === selectedIndex && (
                <span className="material-symbols-outlined text-[#13ec5b] text-sm shrink-0">
                  arrow_forward
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
