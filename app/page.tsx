"use client";

import { useState } from "react";

import { NoteEditor } from "@/components/NoteEditor";
import { Sidebar } from "@/components/Sidebar";
import { useNotes } from "@/hooks/useNotes";
import { useTheme } from "@/hooks/useTheme";

export default function Home() {
  const {
    notes,
    saveStatus,
    selectedNote,
    selectedNoteId,
    titleFocusRequest,
    createLongTestNote,
    createNote,
    createSampleNotes,
    deleteNote,
    deleteNotes,
    resetNotes,
    selectNote,
    updateSelectedNote,
    updateSelectedNoteTags,
  } = useNotes();
  const { isDark, toggleTheme } = useTheme();
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);

  const deleteTargetNotes = notes.filter((note) =>
    deleteTargetIds.includes(note.id),
  );
  const recentTags = Array.from(
    new Set(
      [...notes]
        .sort((firstNote, secondNote) =>
          secondNote.updatedAt.localeCompare(firstNote.updatedAt),
        )
        .flatMap((note) => note.tags),
    ),
  );

  function requestDeleteNote(noteId: string) {
    setDeleteTargetIds([noteId]);
  }

  function requestDeleteNotes(noteIds: string[]) {
    setDeleteTargetIds(noteIds);
  }

  function confirmDeleteNotes() {
    if (deleteTargetIds.length === 0) {
      return;
    }

    if (deleteTargetIds.length === 1) {
      deleteNote(deleteTargetIds[0]);
    } else {
      deleteNotes(deleteTargetIds);
    }

    setDeleteTargetIds([]);
  }

  return (
    <main
      className={`min-h-screen transition-colors ${
        isDark ? "bg-[#191919] text-[#ededed]" : "bg-[#f7f7f5] text-[#2f2f2f]"
      }`}
    >
      <div className="flex min-h-screen">
        <Sidebar
          isDark={isDark}
          notes={notes}
          selectedNoteId={selectedNoteId}
          onCreateLongTestNote={createLongTestNote}
          onCreateNote={createNote}
          onCreateSampleNotes={createSampleNotes}
          onDeleteNote={requestDeleteNote}
          onDeleteNotes={requestDeleteNotes}
          onResetNotes={resetNotes}
          onSelectNote={selectNote}
          onToggleTheme={toggleTheme}
        />

        <NoteEditor
          allTags={recentTags}
          isDark={isDark}
          note={selectedNote}
          saveStatus={saveStatus}
          titleFocusRequest={titleFocusRequest}
          onUpdateNote={updateSelectedNote}
          onUpdateTags={updateSelectedNoteTags}
        />
      </div>

      {deleteTargetNotes.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <div
            className={`w-full max-w-sm rounded-lg border p-5 shadow-xl ${
              isDark
                ? "border-[#333333] bg-[#252525] text-[#ededed]"
                : "border-[#e4e1dc] bg-[#fbfaf8] text-[#2f2f2f]"
            }`}
          >
            <h2 className="text-base font-semibold">
              {"\u30e1\u30e2\u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f"}
            </h2>
            <p
              className={`mt-2 text-sm leading-6 ${
                isDark ? "text-[#bdbdbd]" : "text-[#6f6a62]"
              }`}
            >
              {deleteTargetNotes.length === 1 ? (
                <>
                  {"\u300c"}
                  {deleteTargetNotes[0].title || "\u7121\u984c\u306e\u30e1\u30e2"}
                  {"\u300d\u3092\u524a\u9664\u3057\u307e\u3059\u3002\u3053\u306e\u64cd\u4f5c\u306f\u5143\u306b\u623b\u305b\u307e\u305b\u3093\u3002"}
                </>
              ) : (
                <>
                  {deleteTargetNotes.length}
                  {"\u4ef6\u306e\u30e1\u30e2\u3092\u524a\u9664\u3057\u307e\u3059\u3002\u3053\u306e\u64cd\u4f5c\u306f\u5143\u306b\u623b\u305b\u307e\u305b\u3093\u3002"}
                </>
              )}
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTargetIds([])}
                className={`rounded-md border px-3 py-2 text-sm transition ${
                  isDark
                    ? "border-[#3a3a3a] text-[#d6d6d6] hover:bg-[#303030]"
                    : "border-[#ded9d1] text-[#5f5a52] hover:bg-[#eee9e1]"
                }`}
              >
                {"\u30ad\u30e3\u30f3\u30bb\u30eb"}
              </button>
              <button
                type="button"
                onClick={confirmDeleteNotes}
                className={`rounded-md border px-3 py-2 text-sm transition ${
                  isDark
                    ? "border-[#5a2f2f] bg-[#3a2525] text-[#f0c9c9] hover:bg-[#4a2c2c]"
                    : "border-[#e2c1b8] bg-[#fff2ef] text-[#9a3f2f] hover:bg-[#ffe8e1]"
                }`}
              >
                {"\u524a\u9664\u3059\u308b"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
