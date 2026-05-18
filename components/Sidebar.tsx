"use client";

import { useState } from "react";

import { NoteList } from "@/components/NoteList";
import type { Note } from "@/types/note";

type SidebarProps = {
  isDark: boolean;
  notes: Note[];
  selectedNoteId: string;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
  onResetNotes: () => void;
  onSelectNote: (id: string) => void;
  onToggleTheme: () => void;
};

export function Sidebar({
  isDark,
  notes,
  selectedNoteId,
  onCreateNote,
  onDeleteNote,
  onResetNotes,
  onSelectNote,
  onToggleTheme,
}: SidebarProps) {
  const [searchText, setSearchText] = useState("");

  const normalizedSearchText = searchText.trim().toLowerCase();
  const sortedNotes = [...notes].sort((firstNote, secondNote) =>
    secondNote.updatedAt.localeCompare(firstNote.updatedAt),
  );

  // filter creates a new array and does not change the original notes data.
  // This checks both the title and content for the search text.
  const filteredNotes = sortedNotes.filter((note) => {
    const title = note.title.toLowerCase();
    const content = note.content.toLowerCase();

    return (
      normalizedSearchText === "" ||
      title.includes(normalizedSearchText) ||
      content.includes(normalizedSearchText)
    );
  });

  return (
    <aside
      className={`flex w-72 flex-col border-r px-3 py-4 transition-colors ${
        isDark
          ? "border-[#2f2f2f] bg-[#202020]"
          : "border-[#e4e1dc] bg-[#f1efeb]"
      }`}
    >
      <div className="min-h-0 flex-1">
        <div className="mb-5 px-2">
          <h1 className="text-sm font-semibold">
            {"\u30b7\u30f3\u30d7\u30eb\u30e1\u30e2"}
          </h1>
          <p
            className={`mt-1 text-xs ${
              isDark ? "text-[#9b9b9b]" : "text-[#78746d]"
            }`}
          >
            {"Notion\u98a8\u30e1\u30e2\u30a2\u30d7\u30ea"}
          </p>
        </div>

        <div className="relative mb-2">
          <svg
            aria-hidden="true"
            className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
              isDark ? "text-[#777777]" : "text-[#9b968e]"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className={`w-full rounded-md border py-2 pl-9 pr-3 text-sm outline-none transition ${
              isDark
                ? "border-[#303030] bg-[#1b1b1b] text-[#e6e6e6] placeholder:text-[#777777] focus:border-[#555555]"
                : "border-[#ded9d1] bg-[#f7f7f5] text-[#37352f] placeholder:text-[#9b968e] focus:border-[#b9b2a7]"
            }`}
            placeholder={"\u30e1\u30e2\u3092\u691c\u7d22"}
          />
        </div>

        <button
          onClick={onResetNotes}
          className={`mb-3 rounded-md px-3 py-1.5 text-left text-xs transition ${
            isDark
              ? "text-[#cfcfcf] hover:bg-[#2b2b2b]"
              : "text-[#5f5a52] hover:bg-[#e7e3dd]"
          }`}
        >
          {"\u30ea\u30bb\u30c3\u30c8"}
        </button>

        <button
          onClick={onCreateNote}
          className={`mb-2 w-full rounded-md px-3 py-2 text-left text-sm transition ${
            isDark
              ? "text-[#d6d6d6] hover:bg-[#2b2b2b]"
              : "text-[#4f4b45] hover:bg-[#e7e3dd]"
          }`}
        >
          {"+ \u65b0\u898f\u30e1\u30e2"}
        </button>

        {filteredNotes.length > 0 ? (
          <NoteList
            isDark={isDark}
            notes={filteredNotes}
            selectedNoteId={selectedNoteId}
            canDelete={notes.length > 1}
            onDeleteNote={onDeleteNote}
            onSelectNote={onSelectNote}
          />
        ) : (
          <p
            className={`px-3 py-2 text-xs ${
              isDark ? "text-[#9b9b9b]" : "text-[#78746d]"
            }`}
          >
            {"\u4e00\u81f4\u3059\u308b\u30e1\u30e2\u304c\u3042\u308a\u307e\u305b\u3093"}
          </p>
        )}
      </div>

      <div
        className={`mt-4 flex justify-end border-t px-2 pt-3 ${
          isDark ? "border-[#303030]" : "border-[#e4e1dc]"
        }`}
      >
        <button
          onClick={onToggleTheme}
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
            isDark
              ? "border-[#3a3a3a] bg-[#262626] text-[#e6e6e6] hover:bg-[#303030]"
              : "border-[#ded9d1] bg-[#f7f7f5] text-[#5f5a52] hover:bg-[#e7e3dd]"
          }`}
          title={isDark ? "\u30e9\u30a4\u30c8\u30e2\u30fc\u30c9" : "\u30c0\u30fc\u30af\u30e2\u30fc\u30c9"}
          aria-label={isDark ? "\u30e9\u30a4\u30c8\u30e2\u30fc\u30c9" : "\u30c0\u30fc\u30af\u30e2\u30fc\u30c9"}
        >
          {isDark ? (
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2.5M12 19.5V22M4.93 4.93 6.7 6.7M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07 6.7 17.3M17.3 6.7l1.77-1.77" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M20.3 14.8A7.5 7.5 0 0 1 9.2 3.7 8.5 8.5 0 1 0 20.3 14.8Z" />
            </svg>
          )}
        </button>
      </div>
    </aside>
  );
}
