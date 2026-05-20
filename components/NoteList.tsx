 "use client";

import { useState } from "react";

import { getNotePreview } from "@/lib/notes";
import type { Note } from "@/types/note";

type NoteListProps = {
  isDark: boolean;
  notes: Note[];
  selectedNoteId: string;
  canDelete: boolean;
  onDeleteNote: (id: string) => void;
  onSelectNote: (id: string) => void;
};

export function NoteList({
  isDark,
  notes,
  selectedNoteId,
  canDelete,
  onDeleteNote,
  onSelectNote,
}: NoteListProps) {
  const [openTagNoteId, setOpenTagNoteId] = useState<string | null>(null);

  return (
    <nav className="space-y-1">
      {notes.map((note) => {
        const isSelected = note.id === selectedNoteId;
        const isTagsOpen = openTagNoteId === note.id;

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
              {note.tags.length > 0 && (
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
            </div>
          </div>
        );
      })}
    </nav>
  );
}
