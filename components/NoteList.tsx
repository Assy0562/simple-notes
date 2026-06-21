"use client";

import { useState, type ReactNode } from "react";

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
  const [openActionNoteId, setOpenActionNoteId] = useState<string | null>(null);

  function closeActionMenu() {
    setOpenActionNoteId(null);
  }

  function handleSelectNote(noteId: string) {
    closeActionMenu();
    onSelectNote(noteId);
  }

  function handleTogglePinnedNote(noteId: string) {
    onTogglePinnedNote(noteId);
    closeActionMenu();
  }

  function handleToggleArchivedNote(noteId: string) {
    onToggleArchivedNote(noteId);
    closeActionMenu();
  }

  function handleDeleteNote(noteId: string) {
    onDeleteNote(noteId);
    closeActionMenu();
  }

  function handleToggleTags(noteId: string) {
    setOpenTagNoteId((currentId) =>
      currentId === noteId ? null : noteId,
    );
    closeActionMenu();
  }

  return (
    <nav className="space-y-1">
      {notes.map((note) => {
        const isSelected = note.id === selectedNoteId;
        const isTagsOpen = openTagNoteId === note.id;
        const isActionMenuOpen = openActionNoteId === note.id;
        const isChecked = selectedNoteIds.includes(note.id);

        return (
          <div
            key={note.id}
            className={`group relative flex items-start gap-2 rounded-md px-3 py-2 transition ${
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
                aria-label="メモを選択"
              >
                <span aria-hidden="true" className="text-xs leading-none">
                  ✓
                </span>
              </button>
            )}

            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => handleSelectNote(note.id)}
                className="w-full min-w-0 text-left"
              >
                <span className="block truncate text-sm font-medium">
                  {note.title || "無題のメモ"}
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

            {!isSelectionMode && (
              <div className="flex shrink-0 items-center gap-1 md:hidden">
                {note.isPinned && (
                  <span
                    className={`flex h-7 w-7 items-center justify-center ${
                      isDark ? "text-[#f0c36a]" : "text-[#9a6a12]"
                    }`}
                    title="ピン留め中"
                  >
                    <PinIcon />
                  </span>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setOpenActionNoteId((currentId) =>
                      currentId === note.id ? null : note.id,
                    )
                  }
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-lg leading-none transition ${
                    isActionMenuOpen
                      ? isDark
                        ? "bg-[#3a3a3a] text-[#f1f1f1]"
                        : "bg-[#ddd8d0] text-[#37352f]"
                      : isDark
                        ? "text-[#bdbdbd] hover:bg-[#3a3a3a]"
                        : "text-[#6f6a62] hover:bg-[#ddd8d0]"
                  }`}
                  aria-label="メモの操作メニュー"
                  aria-expanded={isActionMenuOpen}
                >
                  ⋯
                </button>
              </div>
            )}

            {isActionMenuOpen && !isSelectionMode && (
              <div
                className={`note-action-menu absolute right-2 top-11 z-30 w-44 rounded-md border p-1 shadow-lg md:hidden ${
                  isDark
                    ? "border-[#3a3a3a] bg-[#252525]"
                    : "border-[#e4e1dc] bg-[#fbfaf8]"
                }`}
              >
                <MobileActionButton
                  icon={<PinIcon />}
                  isDark={isDark}
                  label={note.isPinned ? "ピン留めを解除" : "ピン留め"}
                  onClick={() => handleTogglePinnedNote(note.id)}
                />
                {note.tags.length > 0 && (
                  <MobileActionButton
                    icon={<TagIcon />}
                    isDark={isDark}
                    label={isTagsOpen ? "タグを隠す" : "タグを表示"}
                    onClick={() => handleToggleTags(note.id)}
                  />
                )}
                <MobileActionButton
                  icon={<ArchiveIcon isArchived={note.isArchived} />}
                  isDark={isDark}
                  label={
                    note.isArchived
                      ? "アーカイブから戻す"
                      : "アーカイブ"
                  }
                  onClick={() => handleToggleArchivedNote(note.id)}
                />
                <MobileActionButton
                  danger
                  disabled={!canDelete}
                  icon={<TrashIcon />}
                  isDark={isDark}
                  label={canDelete ? "削除" : "最後のメモは削除できません"}
                  onClick={() => handleDeleteNote(note.id)}
                />
              </div>
            )}

            <div className="hidden shrink-0 items-center gap-1 md:flex">
              {!isSelectionMode && (
                <button
                  type="button"
                  onClick={() => handleTogglePinnedNote(note.id)}
                  className={`flex h-6 w-6 items-center justify-center overflow-hidden rounded transition ${
                    note.isPinned
                      ? isDark
                        ? "bg-[#3a3327] text-[#f0c36a]"
                        : "bg-[#fff3cf] text-[#9a6a12]"
                      : isDark
                        ? "text-[#9b9b9b] opacity-0 hover:bg-[#3a3a3a] hover:text-[#f1f1f1] group-hover:opacity-100"
                        : "text-[#8a857d] opacity-0 hover:bg-[#ddd8d0] hover:text-[#37352f] group-hover:opacity-100"
                  }`}
                  title={note.isPinned ? "ピン留めを解除" : "ピン留め"}
                  aria-label={note.isPinned ? "ピン留めを解除" : "ピン留め"}
                  aria-pressed={note.isPinned}
                >
                  <PinIcon />
                </button>
              )}

              {!isSelectionMode && (
                <button
                  type="button"
                  onClick={() => handleToggleArchivedNote(note.id)}
                  className={`flex h-6 w-6 items-center justify-center rounded opacity-0 transition group-hover:opacity-100 ${
                    isDark
                      ? "text-[#9b9b9b] hover:bg-[#3a3a3a] hover:text-[#f1f1f1]"
                      : "text-[#8a857d] hover:bg-[#ddd8d0] hover:text-[#37352f]"
                  }`}
                  title={
                    note.isArchived
                      ? "アーカイブから戻す"
                      : "アーカイブ"
                  }
                  aria-label={
                    note.isArchived
                      ? "アーカイブから戻す"
                      : "アーカイブ"
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
                    {note.isArchived ? (
                      <path d="m9 15 3-3 3 3" />
                    ) : (
                      <path d="m9 13 3 3 3-3" />
                    )}
                  </svg>
                </button>
              )}

              {note.tags.length > 0 && !isSelectionMode && (
                <button
                  type="button"
                  onClick={() => handleToggleTags(note.id)}
                  className={`flex h-6 w-6 items-center justify-center rounded transition ${
                    isTagsOpen
                      ? isDark
                        ? "bg-[#3a3a3a] text-[#f1f1f1]"
                        : "bg-[#ddd8d0] text-[#37352f]"
                      : isDark
                        ? "text-[#9b9b9b] opacity-0 hover:bg-[#3a3a3a] hover:text-[#f1f1f1] group-hover:opacity-100"
                        : "text-[#8a857d] opacity-0 hover:bg-[#ddd8d0] hover:text-[#37352f] group-hover:opacity-100"
                  }`}
                  title="タグを表示"
                  aria-label="タグを表示"
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
                  onClick={() => handleDeleteNote(note.id)}
                  disabled={!canDelete}
                  className={`h-6 w-6 rounded text-sm opacity-0 transition disabled:cursor-not-allowed disabled:opacity-30 group-hover:opacity-100 ${
                    isDark
                      ? "text-[#9b9b9b] hover:bg-[#3a3a3a] hover:text-[#f1f1f1]"
                      : "text-[#8a857d] hover:bg-[#ddd8d0] hover:text-[#37352f]"
                  }`}
                  title={
                    canDelete
                      ? "メモを削除"
                      : "メモは最低1件必要です"
                  }
                >
                  ×
                </button>
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

type MobileActionButtonProps = {
  danger?: boolean;
  disabled?: boolean;
  icon: ReactNode;
  isDark: boolean;
  label: string;
  onClick: () => void;
};

function MobileActionButton({
  danger = false,
  disabled = false,
  icon,
  isDark,
  label,
  onClick,
}: MobileActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-2.5 rounded px-3 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? isDark
            ? "text-[#e8b2b2] hover:bg-[#3a2b2b]"
            : "text-[#a34838] hover:bg-[#fff0ec]"
          : isDark
            ? "text-[#e6e6e6] hover:bg-[#303030]"
            : "text-[#4f4b45] hover:bg-[#eeeae4]"
      }`}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

function PinIcon() {
  return (
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
  );
}
function TagIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7.17a2.5 2.5 0 0 1 1.77.73l7.33 7.33a2.5 2.5 0 0 1 0 3.54l-6.17 6.17a2.5 2.5 0 0 1-3.54 0L3.73 13.44A2.5 2.5 0 0 1 3 11.67V4.5Z" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  );
}

function ArchiveIcon({ isArchived }: { isArchived: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 8h16" />
      <path d="M6 8v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
      <path d="M8 4h8l2 4H6l2-4Z" />
      {isArchived ? <path d="m9 15 3-3 3 3" /> : <path d="m9 13 3 3 3-3" />}
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 7h16" />
      <path d="M9 3h6l1 4H8l1-4Z" />
      <path d="M6.5 7 7.5 21h9l1-14" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
