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
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="m5 12 4 4 10-10" />
                </svg>
              </button>
            )}

            <div className="min-w-0 flex-1">
              <button
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
                        ? "text-[#9b9b9b] hover:bg-[#3a3a3a] hover:text-[#f1f1f1]"
                        : "text-[#8a857d] hover:bg-[#ddd8d0] hover:text-[#37352f]"
                  }`}
                  title={"\u30bf\u30b0\u3092\u8868\u793a"}
                  aria-label={"\u30bf\u30b0\u3092\u8868\u793a"}
                  aria-expanded={isTagsOpen}
                >
                  <svg
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M3 3h8.5L21 12.5 12.5 21 3 11.5V3Z" />
                    <circle
                      cx="8.5"
                      cy="8.5"
                      r="0.8"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </button>
              )}

              {!isSelectionMode && (
                <button
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
