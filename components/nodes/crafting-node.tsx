"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

interface CraftingNodeData {
  name: string;
  quantity: number;
  required?: number;
  icon: string;
  iconBg: string;
  iconColor: string;
  status: "target" | "subcraft" | "raw";
  craftStation?: string;
  progress?: string;
  source?: string;
}

export const CraftingNode = memo(({ data }: NodeProps<CraftingNodeData>) => {
  const { name, quantity, required, icon, iconBg, iconColor, status, craftStation, progress, source } = data;

  const getNodeStyle = () => {
    switch (status) {
      case "target":
        return "w-64 bg-[#111813] border-2 border-[#13ec5b] shadow-[0_0_15px_rgba(19,236,91,0.2)]";
      case "subcraft":
        return "w-48 bg-[#1c2a21] border border-[#28392e] hover:border-[#9db9a6]";
      case "raw":
        return "w-40 bg-[#111813] border border-dashed border-[#28392e] opacity-90";
      default:
        return "";
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-[#13ec5b] !border-[#13ec5b]" />
      <div className={`${getNodeStyle()} rounded-xl p-3 flex flex-col gap-2 transition-all hover:scale-105`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`${status === "target" ? "size-10" : status === "subcraft" ? "size-8" : "size-6"} rounded ${iconBg} flex items-center justify-center border ${iconColor === "text-indigo-300" ? "border-indigo-500/30" : iconColor === "text-red-400" ? "border-red-500/20" : iconColor === "text-cyan-400" ? "border-cyan-500/20" : "border-white/10"}`}>
              <span className={`material-symbols-outlined ${iconColor} ${status === "target" ? "" : status === "subcraft" ? "text-sm" : "text-xs"}`}>
                {icon}
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className={`${status === "target" ? "text-sm" : status === "subcraft" ? "text-xs" : "text-xs"} font-bold text-white ${status === "raw" ? "truncate" : ""}`}>
                {name}
              </span>
              {required && (
                <span className="text-[10px] text-[#9db9a6]">Requires x{required}</span>
              )}
              {status === "target" && (
                <span className="text-[10px] text-[#9db9a6] uppercase tracking-wider">Target</span>
              )}
            </div>
          </div>
          <div className={`${status === "target" ? "bg-[#13ec5b] text-[#102216]" : status === "subcraft" ? "text-white" : "text-white"} font-bold px-2 py-0.5 rounded text-xs`}>
            {status === "target" ? `x${quantity}` : status === "subcraft" ? `x${quantity}` : `x${quantity}`}
          </div>
        </div>
        
        {status !== "raw" && (
          <>
            <div className="h-px bg-[#28392e] w-full" />
            <div className="flex justify-between items-center">
              {craftStation && (
                <span className="text-[10px] text-[#9db9a6] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">build</span> {craftStation}
                </span>
              )}
              {progress && (
                <span className="text-[10px] text-[#13ec5b]">{progress}</span>
              )}
            </div>
          </>
        )}

        {status === "raw" && source && (
          <div className="flex justify-between items-center mt-1">
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
              source === "Loot" 
                ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                : source === "Gather"
                ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                : "text-green-400 bg-green-500/10 border-green-500/20"
            }`}>
              {source}
            </span>
          </div>
        )}

        {status === "subcraft" && craftStation && (
          <div className="flex justify-between items-center mt-1">
            <span className={`px-1.5 py-0.5 text-[10px] rounded border ${
              craftStation === "Forge"
                ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                : craftStation === "Kiln"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : craftStation === "Alchemist"
                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
            }`}>
              {craftStation}
            </span>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-[#13ec5b] !border-[#13ec5b]" />
    </>
  );
});

CraftingNode.displayName = "CraftingNode";
