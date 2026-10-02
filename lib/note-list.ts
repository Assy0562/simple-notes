import type { Note } from "@/types/note";

export type SortMode = "updated-desc" | "created-desc" | "title-asc";

export function selectNotes(
  notes: Note[],
  searchText: string,
  selectedTags: string[],
  sortMode: SortMode,
  isArchiveView: boolean,
): Note[] {
  const normalizedSearchText = searchText.trim().toLowerCase();
  const sortedNotes = notes
    .filter((note) => note.isArchived === isArchiveView)
    .sort((a, b) => compareNotes(a, b, sortMode));
  return sortedNotes.filter((note) => {
    const title = note.title.toLowerCase();
    const content = note.content.toLowerCase();
    const tags = note.tags.join(" ").toLowerCase();
    // 複数タグは、選択したすべてを持つメモに絞ります。
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
}

function compareNotes(firstNote: Note, secondNote: Note, sortMode: SortMode) {
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
