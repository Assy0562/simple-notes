"use client";

import { useState } from "react";

import { getNotePreview } from "@/lib/notes";
import type { Note } from "@/types/note";

type NoteListProps = {
  isDark: boolean;
  notes: Note[];
  selectedNoteId: string;
  selectedNoteIds: string[];
  canDelete: boolean;
  isSelectionMode: boolean;
  onDeleteNote: (id: string) => void;
  onSelectNote: (id: string) => void;
  onTogglePinnedNote: (id: string) => void;
  onToggleArchivedNote: (id: string) => void;
  onToggleSelectNote: (id: string) => void;
};

export function NoteList({
  isDark,
  notes,
  selectedNoteId,
  selectedNoteIds,
  canDelete,
  isSelectionMode,
  onDeleteNote,
  onSelectNote,
  onTogglePinnedNote,
  onToggleArchivedNote,
  onToggleSelectNote,
}: NoteListProps) {
  const [openTagNoteId, setOpenTagNoteId] = useState<string | null>(null);

  return (
    <nav className="space-y-1">
      {notes.map((note) => {
        const isSelected = note.id === selectedNoteId;
        const isTagsOpen = openTagNoteId === note.id;
        const isChecked = selectedNoteIds.includes(note.id);

        return (
          <div
            key={note.id}
            className={`group flex items-start gap-2 rounded-md px-3 py-2 transition ${
              isSelected
                ? isDark
                  ? "bg-[#2b2b2b]"
                  : "bg-white shadow-sm"
                : isDark
                  ? "hover:bg-[#282828]"
                  : "hover:bg-[#e7e3dd]"
            }`}
          >
            {isSelectionMode && (
              <button
                type="button"
                onClick={() => onToggleSelectNote(note.id)}
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                  isChecked
                    ? isDark
                      ? "border-[#666666] bg-[#3a3a3a] text-[#f1f1f1]"
                      : "border-[#b9b2a7] bg-white text-[#37352f]"
                    : isDark
                      ? "border-[#444444] text-transparent hover:border-[#666666]"
                      : "border-[#d6d0c8] text-transparent hover:border-[#b9b2a7]"
                }`}
                aria-pressed={isChecked}
                aria-label={"\u30e1\u30e2\u3092\u9078\u629e"}
              >
                <span aria-hidden="true" className="text-xs leading-none">
                  {"\u2713"}
                </span>
              </button>
            )}

            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onSelectNote(note.id)}
                className="w-full min-w-0 text-left"
              >
                <span className="block truncate text-sm font-medium">
                  {note.title || "\u7121\u984c\u306e\u30e1\u30e2"}
                </span>
                <span
                  className={`mt-1 block truncate text-xs ${
                    isDark ? "text-[#9b9b9b]" : "text-[#78746d]"
                  }`}
                >
                  {getNotePreview(note.content)}
                </span>
              </button>

              {isTagsOpen && note.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`max-w-full truncate rounded-full border px-2 py-0.5 text-[11px] ${
                        isDark
                          ? "border-[#3a3a3a] bg-[#242424] text-[#bdbdbd]"
                          : "border-[#e1ddd5] bg-[#f7f4ee] text-[#6f6a62]"
                      }`}
                      title={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {!isSelectionMode && (
                <button
                  type="button"
                  onClick={() => onTogglePinnedNote(note.id)}
                  className={`flex h-6 w-6 items-center justify-center rounded transition ${
                    note.isPinned
                      ? isDark
                        ? "bg-[#3a3327] text-[#f0c36a]"
                        : "bg-[#fff3cf] text-[#9a6a12]"
                      : isDark
                        ? "text-[#9b9b9b] opacity-0 hover:bg-[#3a3a3a] hover:text-[#f1f1f1] group-hover:opacity-100"
                        : "text-[#8a857d] opacity-0 hover:bg-[#ddd8d0] hover:text-[#37352f] group-hover:opacity-100"
                  } overflow-hidden`}
                  title={
                    note.isPinned
                      ? "\u30d4\u30f3\u7559\u3081\u3092\u89e3\u9664"
                      : "\u30d4\u30f3\u7559\u3081"
                  }
                  aria-label={
                    note.isPinned
                      ? "\u30d4\u30f3\u7559\u3081\u3092\u89e3\u9664"
                      : "\u30d4\u30f3\u7559\u3081"
                  }
                  aria-pressed={note.isPinned}
                >
                  <svg
                    aria-hidden="true"
                    className="block h-3.5 w-3.5 shrink-0 overflow-hidden"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9 3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5v3.2l3.6 3.6A1.4 1.4 0 0 1 17.6 12H14v4.2l-.9 5.1a1.1 1.1 0 0 1-2.2 0l-.9-5.1V12H6.4a1.4 1.4 0 0 1-1-2.4L9 6.7V3.5Z"
                    />
                  </svg>
                </button>
              )}

              {!isSelectionMode && (
                <button
                  type="button"
                  onClick={() => onToggleArchivedNote(note.id)}
                  className={`flex h-6 w-6 items-center justify-center rounded transition ${
                    isDark
                      ? "text-[#9b9b9b] opacity-0 hover:bg-[#3a3a3a] hover:text-[#f1f1f1] group-hover:opacity-100"
                      : "text-[#8a857d] opacity-0 hover:bg-[#ddd8d0] hover:text-[#37352f] group-hover:opacity-100"
                  }`}
                  title={
                    note.isArchived
                      ? "\u30a2\u30fc\u30ab\u30a4\u30d6\u304b\u3089\u623b\u3059"
                      : "\u30a2\u30fc\u30ab\u30a4\u30d6"
                  }
                  aria-label={
                    note.isArchived
                      ? "\u30a2\u30fc\u30ab\u30a4\u30d6\u304b\u3089\u623b\u3059"
                      : "\u30a2\u30fc\u30ab\u30a4\u30d6"
                  }
                >
                  <svg
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M4 8h16" />
                    <path d="M6 8v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
                    <path d="M8 4h8l2 4H6l2-4Z" />
                    {note.isArchived ? <path d="m9 15 3-3 3 3" /> : <path d="m9 13 3 3 3-3" />}
                  </svg>
                </button>
              )}
              {note.tags.length > 0 && !isSelectionMode && (
                <button
                  type="button"
                  onClick={() =>
                    setOpenTagNoteId((currentId) =>
                      currentId === note.id ? null : note.id,
                    )
                  }
                  className={`flex h-6 w-6 items-center justify-center rounded transition ${
                    isTagsOpen
                      ? isDark
                        ? "bg-[#3a3a3a] text-[#f1f1f1]"
                        : "bg-[#ddd8d0] text-[#37352f]"
                      : isDark
                        ? "text-[#9b9b9b] opacity-0 hover:bg-[#3a3a3a] hover:text-[#f1f1f1] group-hover:opacity-100"
                        : "text-[#8a857d] opacity-0 hover:bg-[#ddd8d0] hover:text-[#37352f] group-hover:opacity-100"
                  }`}
                  title={"\u30bf\u30b0\u3092\u8868\u793a"}
                  aria-label={"\u30bf\u30b0\u3092\u8868\u793a"}
                  aria-expanded={isTagsOpen}
                >
                  <svg
                    aria-hidden="true"
                    className="block h-3.5 w-3.5 shrink-0 overflow-hidden"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7.17a2.5 2.5 0 0 1 1.77.73l7.33 7.33a2.5 2.5 0 0 1 0 3.54l-6.17 6.17a2.5 2.5 0 0 1-3.54 0L3.73 13.44A2.5 2.5 0 0 1 3 11.67V4.5Zm6 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                    />
                  </svg>
                </button>
              )}

              {!isSelectionMode && (
                <button
                  type="button"
                  onClick={() => onDeleteNote(note.id)}
                  disabled={!canDelete}
                  className={`h-6 w-6 rounded text-sm opacity-0 transition disabled:cursor-not-allowed disabled:opacity-30 group-hover:opacity-100 ${
                    isDark
                      ? "text-[#9b9b9b] hover:bg-[#3a3a3a] hover:text-[#f1f1f1]"
                      : "text-[#8a857d] hover:bg-[#ddd8d0] hover:text-[#37352f]"
                  }`}
                  title={
                    canDelete
                      ? "\u30e1\u30e2\u3092\u524a\u9664"
                      : "\u30e1\u30e2\u306f\u6700\u4f4e1\u4ef6\u5fc5\u8981\u3067\u3059"
                  }
                >
                  {"\u00d7"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
