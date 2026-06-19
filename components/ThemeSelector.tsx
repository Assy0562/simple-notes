"use client";

import { useState } from "react";

import type { ThemeMode } from "@/hooks/useTheme";

type ThemeSelectorProps = {
  isDark: boolean;
  themeMode: ThemeMode;
  onChangeTheme: (themeMode: ThemeMode) => void;
};

const themeOptions: Array<{ label: string; value: ThemeMode }> = [
  { label: "ライト", value: "light" },
  { label: "ダーク", value: "dark" },
  { label: "自動", value: "system" },
];

export function ThemeSelector({
  isDark,
  themeMode,
  onChangeTheme,
}: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel =
    themeOptions.find((option) => option.value === themeMode)?.label ?? "自動";

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className={`flex w-full items-center justify-between gap-3 rounded px-3 py-2 text-left text-sm transition ${
          isDark
            ? "text-[#e6e6e6] hover:bg-[#303030]"
            : "text-[#4f4b45] hover:bg-[#eeeae4]"
        }`}
        aria-expanded={isOpen}
      >
        <span>テーマ</span>
        <span className="flex items-center gap-1 text-xs opacity-70">
          {selectedLabel}
          <span
            aria-hidden="true"
            className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
          >
            ›
          </span>
        </span>
      </button>

      {isOpen && (
        <div className="px-2 pb-1 pt-1">
          <div
            className={`grid grid-cols-3 rounded-md border p-1 text-xs ${
              isDark
                ? "border-[#3a3a3a] bg-[#1b1b1b]"
                : "border-[#ded9d1] bg-[#f7f7f5]"
            }`}
          >
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChangeTheme(option.value)}
                className={`rounded px-1.5 py-1.5 transition ${
                  themeMode === option.value
                    ? isDark
                      ? "bg-[#303030] text-[#f1f1f1]"
                      : "bg-white text-[#37352f] shadow-sm"
                    : isDark
                      ? "text-[#9b9b9b] hover:text-[#d6d6d6]"
                      : "text-[#78746d] hover:text-[#4f4b45]"
                }`}
                aria-pressed={themeMode === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}