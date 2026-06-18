"use client";

import { useEffect, useMemo, useState } from "react";

import { NoteList } from "@/components/NoteList";
import type { Note } from "@/types/note";

const USER_NAME_KEY = "simple-notion-user-name";
const DEFAULT_USER_NAME = "Unknown";

type SidebarProps = {
  isDark: boolean;
  notes: Note[];
  selectedNoteId: string;
  onCreateLongTestNote: () => void;
  onCreateMarkdownTestNote: () => void;
  onCreateNote: () => void;
  onCreateSampleNotes: () => void;
  onDeleteNote: (id: string) => void;
  onDeleteNotes: (ids: string[]) => void;
  onResetNotes: () => void;
  onSelectNote: (id: string) => void;
  onToggleTheme: () => void;
  onTogglePinnedNote: (id: string) => void;
  onToggleArchivedNote: (id: string) => void;
};

type SortMode = "updated-desc" | "created-desc" | "title-asc";

export function Sidebar({
  isDark,
  notes,
  selectedNoteId,
  onCreateLongTestNote,
  onCreateMarkdownTestNote,
  onCreateNote,
  onCreateSampleNotes,
  onDeleteNote,
  onDeleteNotes,
  onResetNotes,
  onSelectNote,
  onToggleTheme,
  onTogglePinnedNote,
  onToggleArchivedNote,
}: SidebarProps) {
  const [searchText, setSearchText] = useState("");
  const [userName, setUserName] = useState(DEFAULT_USER_NAME);
  const [draftUserName, setDraftUserName] = useState(DEFAULT_USER_NAME);
  const [isEditingUserName, setIsEditingUserName] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeveloperMenuOpen, setIsDeveloperMenuOpen] = useState(false);
  const [isNoteListOpen, setIsNoteListOpen] = useState(true);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagFilterText, setTagFilterText] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("updated-desc");
  const [isArchiveView, setIsArchiveView] = useState(false);

  const normalizedSearchText = searchText.trim().toLowerCase();
  const normalizedTagFilterText = tagFilterText.trim().toLowerCase();
  const displayUserName = userName.trim() || "\u3042\u306a\u305f";
  const archivedNoteCount = notes.filter((note) => note.isArchived).length;
  const activeNoteCount = notes.length - archivedNoteCount;
  const listSourceNotes = notes.filter(
    (note) => note.isArchived === isArchiveView,
  );
  const sortedNotes = [...listSourceNotes].sort(compareNotes);
  const canCollapseNoteList = sortedNotes.length >= 10;
  // flatMap gathers every tag from every note into one array.
  // Set removes duplicates, so the sidebar shows each tag only once.
  const allTags = useMemo(
    () =>
      Array.from(new Set(notes.flatMap((note) => note.tags))).sort(
        (firstTag, secondTag) => firstTag.localeCompare(secondTag),
      ),
    [notes],
  );
  const selectedFilterTags = selectedTags.filter((tag) => allTags.includes(tag));
  const availableFilterTags = allTags
    .filter((tag) => !selectedFilterTags.includes(tag))
    .filter(
      (tag) =>
        normalizedTagFilterText === "" ||
        tag.toLowerCase().includes(normalizedTagFilterText),
    );

  useEffect(() => {
    const savedUserName = localStorage.getItem(USER_NAME_KEY);

    if (savedUserName) {
      setUserName(savedUserName);
      setDraftUserName(savedUserName);
    }
  }, []);

  useEffect(() => {
    const existingSelectedTags = selectedTags.filter((tag) =>
      allTags.includes(tag),
    );

    if (existingSelectedTags.length !== selectedTags.length) {
      setSelectedTags(existingSelectedTags);
    }
  }, [allTags, selectedTags]);

  useEffect(() => {
    const existingSelectedNoteIds = selectedNoteIds.filter((noteId) =>
      notes.some((note) => note.id === noteId),
    );

    if (existingSelectedNoteIds.length !== selectedNoteIds.length) {
      setSelectedNoteIds(existingSelectedNoteIds);
    }
  }, [notes, selectedNoteIds]);

  useEffect(() => {
    if (!canCollapseNoteList && !isNoteListOpen) {
      setIsNoteListOpen(true);
    }
  }, [canCollapseNoteList, isNoteListOpen]);

  // filter creates a new array and does not change the original notes data.
  // This checks the title, content, and tags for the search text.
  const filteredNotes = sortedNotes.filter((note) => {
    const title = note.title.toLowerCase();
    const content = note.content.toLowerCase();
    const tags = note.tags.join(" ").toLowerCase();
    // every checks that the note has all selected tags.
    // This makes the tag filter work with two or more tags.
    const matchesSelectedTags = selectedTags.every((tag) =>
      note.tags.includes(tag),
    );
    const matchesSearchText =
      normalizedSearchText === "" ||
      title.includes(normalizedSearchText) ||
      content.includes(normalizedSearchText) ||
      tags.includes(normalizedSearchText);

    return matchesSelectedTags && matchesSearchText;
  });
  const visibleNotes =
    canCollapseNoteList && !isNoteListOpen
      ? filteredNotes.slice(0, 10)
      : filteredNotes;
  const hiddenNoteCount = filteredNotes.length - visibleNotes.length;
  const hasActiveFilters = searchText.trim() !== "" || selectedTags.length > 0;

  function startEditingUserName() {
    setDraftUserName(userName);
    setIsEditingUserName(true);
  }

  function saveUserName() {
    const nextUserName = draftUserName.trim();

    setUserName(nextUserName);
    localStorage.setItem(USER_NAME_KEY, nextUserName);
    setIsEditingUserName(false);
  }

  function cancelEditingUserName() {
    setDraftUserName(userName);
    setIsEditingUserName(false);
  }

  function handleStartEditingUserName() {
    startEditingUserName();
    setIsSettingsOpen(false);
    setIsDeveloperMenuOpen(false);
  }

  function handleToggleTheme() {
    onToggleTheme();
    setIsSettingsOpen(false);
    setIsDeveloperMenuOpen(false);
  }

  function handleResetNotes() {
    onResetNotes();
    setIsSettingsOpen(false);
    setIsDeveloperMenuOpen(false);
  }

  function handleCreateLongTestNote() {
    onCreateLongTestNote();
    setIsSettingsOpen(false);
    setIsDeveloperMenuOpen(false);
  }

  function handleCreateMarkdownTestNote() {
    onCreateMarkdownTestNote();
    setIsSettingsOpen(false);
    setIsDeveloperMenuOpen(false);
  }

  function handleCreateSampleNotes() {
    onCreateSampleNotes();
    setIsSettingsOpen(false);
    setIsDeveloperMenuOpen(false);
  }

  function clearFilters() {
    setSearchText("");
    setSelectedTags([]);
    setTagFilterText("");
  }

  function toggleSelectedTag(tag: string) {
    setSelectedTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag],
    );
  }

  function startSelectionMode() {
    setIsSelectionMode(true);
    setSelectedNoteIds([]);
    setIsNoteListOpen(true);
  }

  function cancelSelectionMode() {
    setIsSelectionMode(false);
    setSelectedNoteIds([]);
  }

  function changeArchiveView(nextArchiveView: boolean) {
    setIsArchiveView(nextArchiveView);
    setIsSelectionMode(false);
    setSelectedNoteIds([]);
    setIsNoteListOpen(true);
  }

  function toggleSelectedNote(noteId: string) {
    setSelectedNoteIds((currentIds) =>
      currentIds.includes(noteId)
        ? currentIds.filter((currentId) => currentId !== noteId)
        : [...currentIds, noteId],
    );
  }

  function handleDeleteSelectedNotes() {
    if (selectedNoteIds.length === 0 || selectedNoteIds.length >= notes.length) {
      return;
    }

    onDeleteNotes(selectedNoteIds);
    setIsSelectionMode(false);
    setSelectedNoteIds([]);
  }

  function getSortLabel() {
    if (sortMode === "created-desc") {
      return "\u4f5c\u6210\u304c\u65b0\u3057\u3044\u9806";
    }

    if (sortMode === "title-asc") {
      return "\u30bf\u30a4\u30c8\u30eb\u9806";
    }

    return "\u66f4\u65b0\u304c\u65b0\u3057\u3044\u9806";
  }

  function compareNotes(firstNote: Note, secondNote: Note) {
    if (firstNote.isPinned !== secondNote.isPinned) {
      return firstNote.isPinned ? -1 : 1;
    }

    if (sortMode === "created-desc") {
      return secondNote.createdAt.localeCompare(firstNote.createdAt);
    }

    if (sortMode === "title-asc") {
      const firstTitle = firstNote.title || "\u7121\u984c\u306e\u30e1\u30e2";
      const secondTitle = secondNote.title || "\u7121\u984c\u306e\u30e1\u30e2";

      return firstTitle.localeCompare(secondTitle, "ja");
    }

    return secondNote.updatedAt.localeCompare(firstNote.updatedAt);
  }

  return (
    <aside
      className={`flex min-h-screen w-full flex-col border-r px-3 py-4 transition-colors md:w-72 ${
        isDark
          ? "border-[#2f2f2f] bg-[#202020]"
          : "border-[#e4e1dc] bg-[#f1efeb]"
      }`}
    >
      <div className="min-h-0 flex-1">
        <div className="mb-5 px-2">
          {isEditingUserName ? (
            <input
              autoFocus
              value={draftUserName}
              onBlur={saveUserName}
              onChange={(event) => setDraftUserName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  saveUserName();
                }

                if (event.key === "Escape") {
                  cancelEditingUserName();
                }
              }}
              className={`w-full rounded-md border px-2 py-1 text-sm font-semibold outline-none transition ${
                isDark
                  ? "border-[#3a3a3a] bg-[#1b1b1b] text-[#ededed] focus:border-[#555555]"
                  : "border-[#ded9d1] bg-[#f7f7f5] text-[#2f2f2f] focus:border-[#b9b2a7]"
              }`}
              placeholder={"\u30e6\u30fc\u30b6\u30fc\u540d"}
            />
          ) : (
            <button
              onClick={startEditingUserName}
              className={`block w-full rounded-md px-2 py-1 text-left text-sm font-semibold transition ${
                isDark ? "hover:bg-[#2b2b2b]" : "hover:bg-[#e7e3dd]"
              }`}
              title={"\u30e6\u30fc\u30b6\u30fc\u540d\u3092\u7de8\u96c6"}
            >
              {displayUserName}
              {"\u306e\u30e1\u30e2\u5e33"}
            </button>
          )}
        </div>

        {isSelectionMode ? (
          <div className="mb-2 grid grid-cols-[1fr_auto] gap-2">
            <button
              type="button"
              onClick={handleDeleteSelectedNotes}
              disabled={
                selectedNoteIds.length === 0 ||
                selectedNoteIds.length >= notes.length
              }
              className={`rounded-md border px-3 py-2 text-left text-sm transition disabled:cursor-default disabled:opacity-40 ${
                isDark
                  ? "border-[#5a2f2f] bg-[#3a2525] text-[#f0c9c9] hover:bg-[#4a2c2c] disabled:hover:bg-[#3a2525]"
                  : "border-[#e2c1b8] bg-[#fff2ef] text-[#9a3f2f] hover:bg-[#ffe8e1] disabled:hover:bg-[#fff2ef]"
              }`}
            >
              {selectedNoteIds.length}
              {"\u4ef6\u524a\u9664"}
            </button>
            <button
              type="button"
              onClick={cancelSelectionMode}
              className={`rounded-md border px-3 py-2 text-sm transition ${
                isDark
                  ? "border-[#333333] bg-[#242424] text-[#bdbdbd] hover:bg-[#2d2d2d]"
                  : "border-[#ded9d1] bg-[#f7f7f5] text-[#6f6a62] hover:bg-[#eee9e1]"
              }`}
            >
              {"\u89e3\u9664"}
            </button>
          </div>
        ) : (
          <div className="mb-2 grid grid-cols-[1fr_auto] gap-2">
            <button
              onClick={onCreateNote}
              className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                isDark
                  ? "border-[#333333] bg-[#242424] text-[#d6d6d6] hover:bg-[#2b2b2b]"
                  : "border-[#ded9d1] bg-[#f7f7f5] text-[#4f4b45] hover:bg-[#eee9e1]"
              }`}
            >
              {"+ \u65b0\u898f\u30e1\u30e2"}
            </button>
            <button
              type="button"
              onClick={startSelectionMode}
              disabled={filteredNotes.length === 0 || notes.length <= 1}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition disabled:cursor-default disabled:opacity-40 ${
                isDark
                  ? "border-[#333333] bg-[#242424] text-[#bdbdbd] hover:bg-[#2d2d2d] disabled:hover:bg-[#242424]"
                  : "border-[#ded9d1] bg-[#f7f7f5] text-[#6f6a62] hover:bg-[#eee9e1] disabled:hover:bg-[#f7f7f5]"
              }`}
            >
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.9"
              >
                <rect x="4" y="4" width="16" height="16" rx="3" />
                <path d="m8 12 3 3 5-6" />
              </svg>
              {"\u9078\u629e"}
            </button>
          </div>
        )}

        <div
          className={`mb-2 grid grid-cols-2 rounded-md border p-1 text-xs ${
            isDark
              ? "border-[#303030] bg-[#1b1b1b]"
              : "border-[#ded9d1] bg-[#f7f7f5]"
          }`}
        >
          <button
            type="button"
            onClick={() => changeArchiveView(false)}
            className={`rounded px-2 py-1.5 transition ${
              !isArchiveView
                ? isDark
                  ? "bg-[#303030] text-[#f1f1f1]"
                  : "bg-white text-[#37352f] shadow-sm"
                : isDark
                  ? "text-[#9b9b9b] hover:text-[#d6d6d6]"
                  : "text-[#78746d] hover:text-[#4f4b45]"
            }`}
            aria-pressed={!isArchiveView}
          >
            {"\u30e1\u30e2"}
            <span className="ml-1 opacity-70">{activeNoteCount}</span>
          </button>
          <button
            type="button"
            onClick={() => changeArchiveView(true)}
            className={`rounded px-2 py-1.5 transition ${
              isArchiveView
                ? isDark
                  ? "bg-[#303030] text-[#f1f1f1]"
                  : "bg-white text-[#37352f] shadow-sm"
                : isDark
                  ? "text-[#9b9b9b] hover:text-[#d6d6d6]"
                  : "text-[#78746d] hover:text-[#4f4b45]"
            }`}
            aria-pressed={isArchiveView}
          >
            {"\u30a2\u30fc\u30ab\u30a4\u30d6"}
            <span className="ml-1 opacity-70">{archivedNoteCount}</span>
          </button>
        </div>
        <div className="mb-1.5 flex items-center gap-2 px-1">
          <div
            className={`flex min-w-0 flex-1 items-center gap-1 px-1 py-1 text-left text-xs font-medium ${
              isDark ? "text-[#9b9b9b]" : "text-[#78746d]"
            }`}
          >
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.9"
            >
              <path d="M8 6h12M8 12h12M8 18h12" />
              <path d="M4 6h.01M4 12h.01M4 18h.01" />
            </svg>
            <span>{isArchiveView ? "\u30a2\u30fc\u30ab\u30a4\u30d6" : "\u30e1\u30e2\u4e00\u89a7"}</span>
            <span
              className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] ${
                isDark ? "bg-[#333333] text-[#d6d6d6]" : "bg-white text-[#5f5a52]"
              }`}
            >
              {filteredNotes.length}
              {"\u4ef6"}
            </span>
          </div>
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
            className={`w-full rounded-md border py-2 pl-9 pr-9 text-sm outline-none transition ${
              isDark
                ? "border-[#303030] bg-[#1b1b1b] text-[#e6e6e6] placeholder:text-[#777777] focus:border-[#555555]"
                : "border-[#ded9d1] bg-[#f7f7f5] text-[#37352f] placeholder:text-[#9b968e] focus:border-[#b9b2a7]"
            }`}
            placeholder={"\u30e1\u30e2\u3092\u691c\u7d22"}
          />
          {searchText !== "" && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              className={`absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded transition ${
                isDark
                  ? "text-[#9b9b9b] hover:bg-[#303030] hover:text-[#e6e6e6]"
                  : "text-[#8a857d] hover:bg-[#eee9e1] hover:text-[#37352f]"
              }`}
              aria-label={"\u691c\u7d22\u3092\u30af\u30ea\u30a2"}
              title={"\u691c\u7d22\u3092\u30af\u30ea\u30a2"}
            >
              {"\u00d7"}
            </button>
          )}
        </div>

        <div className="relative mb-3 flex items-center gap-1 px-1">
          <button
            type="button"
            onClick={() => {
              setIsTagFilterOpen((isOpen) => !isOpen);
              setIsSortMenuOpen(false);
            }}
            disabled={allTags.length === 0}
            className={`relative flex h-8 w-8 items-center justify-center rounded-md transition ${
              isTagFilterOpen || selectedTags.length > 0
                ? isDark
                  ? "bg-[#303030] text-[#f1f1f1]"
                  : "bg-white text-[#37352f] shadow-sm"
                : isDark
                  ? "text-[#9b9b9b] hover:bg-[#2b2b2b] hover:text-[#d6d6d6] disabled:opacity-40"
                  : "text-[#78746d] hover:bg-[#e7e3dd] hover:text-[#4f4b45] disabled:opacity-40"
            }`}
            title={"\u30d5\u30a3\u30eb\u30bf\u30fc"}
            aria-label={"\u30d5\u30a3\u30eb\u30bf\u30fc"}
            aria-expanded={isTagFilterOpen}
            aria-pressed={selectedTags.length > 0}
          >
            <svg
              aria-hidden="true"
              className="block h-4 w-4 shrink-0 overflow-hidden"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7.17a2.5 2.5 0 0 1 1.77.73l7.33 7.33a2.5 2.5 0 0 1 0 3.54l-6.17 6.17a2.5 2.5 0 0 1-3.54 0L3.73 13.44A2.5 2.5 0 0 1 3 11.67V4.5Zm6 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
              />
            </svg>
            {selectedTags.length > 0 && (
              <span
                className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] ${
                  isDark
                    ? "bg-[#f0c36a] text-[#272016]"
                    : "bg-[#7a5a18] text-white"
                }`}
              >
                {selectedTags.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSortMenuOpen((isOpen) => !isOpen);
              setIsTagFilterOpen(false);
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
              isSortMenuOpen
                ? isDark
                  ? "bg-[#303030] text-[#f1f1f1]"
                  : "bg-white text-[#37352f] shadow-sm"
                : isDark
                  ? "text-[#9b9b9b] hover:bg-[#2b2b2b] hover:text-[#d6d6d6]"
                  : "text-[#78746d] hover:bg-[#e7e3dd] hover:text-[#4f4b45]"
            }`}
            title={getSortLabel()}
            aria-label={`${"\u4e26\u3073\u66ff\u3048"}: ${getSortLabel()}`}
            aria-expanded={isSortMenuOpen}
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.9"
            >
              <path d="M8 4v16" />
              <path d="m5 7 3-3 3 3" />
              <path d="M16 20V4" />
              <path d="m13 17 3 3 3-3" />
            </svg>
          </button>

          {isTagFilterOpen && (
            <div
              className={`absolute left-1 top-11 z-20 w-56 rounded-md border p-2 shadow-lg ${
                isDark
                  ? "border-[#333333] bg-[#252525]"
                  : "border-[#e4e1dc] bg-[#fbfaf8]"
              }`}
            >
              <input
                value={tagFilterText}
                onChange={(event) => setTagFilterText(event.target.value)}
                className={`mb-2 w-full rounded-md border px-2 py-1.5 text-sm outline-none transition ${
                  isDark
                    ? "border-[#3a3a3a] bg-[#1b1b1b] text-[#e6e6e6] placeholder:text-[#777777] focus:border-[#555555]"
                    : "border-[#ded9d1] bg-[#f7f7f5] text-[#37352f] placeholder:text-[#9b968e] focus:border-[#b9b2a7]"
                }`}
                placeholder={"\u30bf\u30b0\u3092\u691c\u7d22"}
              />

              {selectedFilterTags.length > 0 && (
                <div
                  className={`mb-2 border-b pb-2 ${
                    isDark
                      ? "border-[#333333]"
                      : "border-[#e4e1dc]"
                  }`}
                >
                  <div
                    className={`mb-1 px-1 text-[11px] font-medium ${
                      isDark ? "text-[#9b9b9b]" : "text-[#78746d]"
                    }`}
                  >
                    {"\u9078\u629e\u4e2d"}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedFilterTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleSelectedTag(tag)}
                        className={`max-w-full truncate rounded-full border px-2 py-1 text-xs transition ${
                          isDark
                            ? "border-[#555555] bg-[#333333] text-[#f1f1f1] hover:bg-[#3a3a3a]"
                            : "border-[#cfc7bc] bg-white text-[#37352f] shadow-sm hover:bg-[#f2eee8]"
                        }`}
                        title={tag}
                      >
                        {tag}
                        {" \u00d7"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="max-h-48 overflow-y-auto pr-1">
                {availableFilterTags.length > 0 ? (
                  availableFilterTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleSelectedTag(tag)}
                      className={`flex w-full items-center justify-between gap-3 rounded px-3 py-2 text-left text-sm transition ${
                        isDark
                          ? "text-[#e6e6e6] hover:bg-[#303030]"
                          : "text-[#4f4b45] hover:bg-[#eeeae4]"
                      }`}
                      title={tag}
                    >
                      <span className="min-w-0 truncate">{tag}</span>
                    </button>
                  ))
                ) : (
                  <p
                    className={`px-3 py-2 text-xs ${
                      isDark ? "text-[#9b9b9b]" : "text-[#78746d]"
                    }`}
                  >
                    {"\u4e00\u81f4\u3059\u308b\u30bf\u30b0\u304c\u3042\u308a\u307e\u305b\u3093"}
                  </p>
                )}
              </div>

              {(selectedTags.length > 0 || tagFilterText !== "") && (
                <div
                  className={`mt-2 border-t pt-1 ${
                    isDark ? "border-[#333333]" : "border-[#e4e1dc]"
                  }`}
                >
                  {tagFilterText !== "" && (
                    <button
                      type="button"
                      onClick={() => setTagFilterText("")}
                      className={`flex w-full items-center rounded px-3 py-2 text-left text-sm transition ${
                        isDark
                          ? "text-[#bdbdbd] hover:bg-[#303030]"
                          : "text-[#6f6a62] hover:bg-[#eeeae4]"
                      }`}
                    >
                      {"\u691c\u7d22\u3092\u30af\u30ea\u30a2"}
                    </button>
                  )}

                  {selectedTags.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedTags([])}
                      className={`flex w-full items-center rounded px-3 py-2 text-left text-sm transition ${
                        isDark
                          ? "text-[#bdbdbd] hover:bg-[#303030]"
                          : "text-[#6f6a62] hover:bg-[#eeeae4]"
                      }`}
                    >
                      {"\u30d5\u30a3\u30eb\u30bf\u30fc\u3092\u30af\u30ea\u30a2"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {isSortMenuOpen && (
            <div
              className={`absolute left-10 top-11 z-20 w-52 rounded-md border p-1 shadow-lg ${
                isDark
                  ? "border-[#333333] bg-[#252525]"
                  : "border-[#e4e1dc] bg-[#fbfaf8]"
              }`}
            >
              {[
                { value: "updated-desc", label: "\u66f4\u65b0\u304c\u65b0\u3057\u3044\u9806" },
                { value: "created-desc", label: "\u4f5c\u6210\u304c\u65b0\u3057\u3044\u9806" },
                { value: "title-asc", label: "\u30bf\u30a4\u30c8\u30eb\u9806" },
              ].map((sortOption) => (
                <button
                  key={sortOption.value}
                  type="button"
                  onClick={() => {
                    setSortMode(sortOption.value as SortMode);
                    setIsSortMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded px-3 py-2 text-left text-sm transition ${
                    isDark
                      ? "text-[#e6e6e6] hover:bg-[#303030]"
                      : "text-[#4f4b45] hover:bg-[#eeeae4]"
                  }`}
                  aria-pressed={sortMode === sortOption.value}
                >
                  <span className="min-w-0 truncate">{sortOption.label}</span>
                  {sortMode === sortOption.value && (
                    <svg
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.1"
                    >
                      <path d="m5 12 4 4 10-10" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {visibleNotes.length > 0 ? (
            <NoteList
              isDark={isDark}
              notes={visibleNotes}
              selectedNoteId={selectedNoteId}
              selectedNoteIds={selectedNoteIds}
              canDelete={notes.length > 1}
              isSelectionMode={isSelectionMode}
              onDeleteNote={onDeleteNote}
              onSelectNote={onSelectNote}
              onTogglePinnedNote={onTogglePinnedNote}
              onToggleArchivedNote={onToggleArchivedNote}
              onToggleSelectNote={toggleSelectedNote}
            />
        ) : (
          <div
            className={`rounded-md border px-3 py-4 text-xs ${
              isDark
                ? "border-[#303030] bg-[#1b1b1b] text-[#9b9b9b]"
                : "border-[#e4e1dc] bg-[#f7f7f5] text-[#78746d]"
            }`}
          >
            <p className="leading-5">
              {hasActiveFilters
                ? "\u691c\u7d22\u3084\u30bf\u30b0\u306b\u4e00\u81f4\u3059\u308b\u30e1\u30e2\u304c\u3042\u308a\u307e\u305b\u3093"
                : isArchiveView ? "\u30a2\u30fc\u30ab\u30a4\u30d6\u3055\u308c\u305f\u30e1\u30e2\u306f\u307e\u3060\u3042\u308a\u307e\u305b\u3093" : "\u8868\u793a\u3067\u304d\u308b\u30e1\u30e2\u304c\u3042\u308a\u307e\u305b\u3093"}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className={`mt-3 rounded-md border px-2 py-1.5 transition ${
                  isDark
                    ? "border-[#3a3a3a] text-[#d6d6d6] hover:bg-[#303030]"
                    : "border-[#ded9d1] text-[#5f5a52] hover:bg-[#eee9e1]"
                }`}
              >
                {"\u6761\u4ef6\u3092\u30af\u30ea\u30a2"}
              </button>
            )}
          </div>
        )}

        {canCollapseNoteList && filteredNotes.length > 10 && (
          <button
            type="button"
            onClick={() => setIsNoteListOpen((isOpen) => !isOpen)}
            className={`mt-1 flex w-full items-center justify-center gap-1 rounded-md px-3 py-2 text-xs transition ${
              isDark
                ? "text-[#bdbdbd] hover:bg-[#2d2d2d]"
                : "text-[#6f6a62] hover:bg-[#eee9e1]"
            }`}
            aria-expanded={isNoteListOpen}
          >
            <svg
              aria-hidden="true"
              className={`h-3.5 w-3.5 transition-transform ${
                isNoteListOpen ? "rotate-90" : "-rotate-90"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            {isNoteListOpen ? (
              <span>{"\u5c11\u306a\u304f\u8868\u793a"}</span>
            ) : (
              <span>
                {hiddenNoteCount}
                {"\u4ef6\u3055\u3089\u306b\u8868\u793a"}
              </span>
            )}
          </button>
        )}
      </div>

      <div
        className={`relative mt-4 flex justify-start border-t px-2 pt-3 ${
          isDark ? "border-[#303030]" : "border-[#e4e1dc]"
        }`}
      >
        <button
          onClick={() => {
            setIsSettingsOpen((isOpen) => {
              if (isOpen) {
                setIsDeveloperMenuOpen(false);
              }

              return !isOpen;
            });
          }}
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
            isDark
              ? "border-[#3a3a3a] bg-[#262626] text-[#e6e6e6] hover:bg-[#303030]"
              : "border-[#ded9d1] bg-[#f7f7f5] text-[#5f5a52] hover:bg-[#e7e3dd]"
          }`}
          title={"\u8a2d\u5b9a"}
          aria-label={"\u8a2d\u5b9a"}
          aria-expanded={isSettingsOpen}
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.04.04a2 2 0 0 1-2.83 2.83l-.04-.04A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.05a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.04.04a2 2 0 0 1-2.83-2.83l.04-.04A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.05a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.04-.04a2 2 0 0 1 2.83-2.83l.04.04A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.05a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.04-.04a2 2 0 0 1 2.83 2.83l-.04.04A1.7 1.7 0 0 0 19.4 9c.22.62.8 1 1.55 1H21a2 2 0 0 1 0 4h-.05a1.7 1.7 0 0 0-1.55 1Z" />
          </svg>
        </button>

        {isSettingsOpen && (
          <div
            className={`absolute bottom-14 left-2 w-44 rounded-md border p-1 shadow-lg ${
              isDark
                ? "border-[#333333] bg-[#252525]"
                : "border-[#e4e1dc] bg-[#fbfaf8]"
            }`}
          >
            {isDeveloperMenuOpen ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsDeveloperMenuOpen(false)}
                  className={`mb-1 flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs transition ${
                    isDark
                      ? "text-[#bdbdbd] hover:bg-[#303030]"
                      : "text-[#6f6a62] hover:bg-[#eeeae4]"
                  }`}
                >
                  <span aria-hidden="true">{"\u2039"}</span>
                  {"\u8a2d\u5b9a\u306b\u623b\u308b"}
                </button>

                <div
                  className={`mb-1 border-t ${
                    isDark ? "border-[#333333]" : "border-[#e4e1dc]"
                  }`}
                />

                <button
                  onClick={handleCreateLongTestNote}
                  className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                    isDark
                      ? "text-[#e6e6e6] hover:bg-[#303030]"
                      : "text-[#4f4b45] hover:bg-[#eeeae4]"
                  }`}
                >
                  {"\u9577\u6587\u30c6\u30b9\u30c8\u30e1\u30e2\u3092\u8ffd\u52a0"}
                </button>

                <button
                  onClick={handleCreateMarkdownTestNote}
                  className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                    isDark
                      ? "text-[#e6e6e6] hover:bg-[#303030]"
                      : "text-[#4f4b45] hover:bg-[#eeeae4]"
                  }`}
                >
                  {"Markdown\u30c6\u30b9\u30c8\u30e1\u30e2\u3092\u8ffd\u52a0"}
                </button>

                <button
                  onClick={handleCreateSampleNotes}
                  className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                    isDark
                      ? "text-[#e6e6e6] hover:bg-[#303030]"
                      : "text-[#4f4b45] hover:bg-[#eeeae4]"
                  }`}
                >
                  {"\u30b5\u30f3\u30d7\u30eb\u30e1\u30e210\u4ef6\u3092\u8ffd\u52a0"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleStartEditingUserName}
                  className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                    isDark
                      ? "text-[#e6e6e6] hover:bg-[#303030]"
                      : "text-[#4f4b45] hover:bg-[#eeeae4]"
                  }`}
                >
                  {"\u30e6\u30fc\u30b6\u30fc\u540d\u3092\u5909\u66f4"}
                </button>

                <button
                  type="button"
                  onClick={handleToggleTheme}
                  className={`flex w-full items-center justify-between gap-3 rounded px-3 py-2 text-left text-sm transition ${
                    isDark
                      ? "text-[#e6e6e6] hover:bg-[#303030]"
                      : "text-[#4f4b45] hover:bg-[#eeeae4]"
                  }`}
                >
                  <span>{"\u30c6\u30fc\u30de\u5207\u308a\u66ff\u3048"}</span>
                  <span className="text-xs opacity-70">
                    {isDark ? "\u30e9\u30a4\u30c8" : "\u30c0\u30fc\u30af"}
                  </span>
                </button>

                <button
                  onClick={handleResetNotes}
                  className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                    isDark
                      ? "text-[#e6e6e6] hover:bg-[#303030]"
                      : "text-[#4f4b45] hover:bg-[#eeeae4]"
                  }`}
                >
                  {"\u521d\u671f\u30e1\u30e2\u306b\u623b\u3059"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeveloperMenuOpen(true)}
                  className={`flex w-full items-center justify-between gap-3 rounded px-3 py-2 text-left text-sm transition ${
                    isDark
                      ? "text-[#e6e6e6] hover:bg-[#303030]"
                      : "text-[#4f4b45] hover:bg-[#eeeae4]"
                  }`}
                >
                  <span>{"\u958b\u767a\u8005\u30b3\u30de\u30f3\u30c9"}</span>
                  <span aria-hidden="true">{"\u203a"}</span>
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </aside>
  );
}
