"use client";

import { useMemo, useState } from "react";

import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
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
    createMarkdownTestNote,
    createNote,
    createSampleNotes,
    deleteNote,
    deleteNotes,
    resetNotes,
    selectNote,
    togglePinnedNote,
    toggleArchivedNote,
    updateSelectedNote,
    updateSelectedNoteTags,
  } = useNotes();
  const { isDark, toggleTheme } = useTheme();
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [isMobileEditorOpen, setIsMobileEditorOpen] = useState(false);

  const deleteTargetNotes = useMemo(
    () => notes.filter((note) => deleteTargetIds.includes(note.id)),
    [deleteTargetIds, notes],
  );
  const recentTags = useMemo(
    () =>
      Array.from(
        new Set(
          [...notes]
            .sort((firstNote, secondNote) =>
              secondNote.updatedAt.localeCompare(firstNote.updatedAt),
            )
            .flatMap((note) => note.tags),
        ),
      ),
    [notes],
  );

  function requestDeleteNote(noteId: string) {
    setDeleteTargetIds([noteId]);
  }

  function handleCreateNote() {
    createNote();
    setIsMobileEditorOpen(true);
  }

  function handleCreateLongTestNote() {
    createLongTestNote();
    setIsMobileEditorOpen(true);
  }

  function handleCreateMarkdownTestNote() {
    createMarkdownTestNote();
    setIsMobileEditorOpen(true);
  }

  function handleCreateSampleNotes() {
    createSampleNotes();
    setIsMobileEditorOpen(true);
  }

  function handleSelectNote(noteId: string) {
    selectNote(noteId);
    setIsMobileEditorOpen(true);
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
      <div className="min-h-screen md:flex">
        <div className={isMobileEditorOpen ? "hidden md:block" : "block"}>
          <Sidebar
            isDark={isDark}
            notes={notes}
            selectedNoteId={selectedNoteId}
            onCreateLongTestNote={handleCreateLongTestNote}
            onCreateMarkdownTestNote={handleCreateMarkdownTestNote}
            onCreateNote={handleCreateNote}
            onCreateSampleNotes={handleCreateSampleNotes}
            onDeleteNote={requestDeleteNote}
            onDeleteNotes={requestDeleteNotes}
            onResetNotes={resetNotes}
            onSelectNote={handleSelectNote}
            onToggleTheme={toggleTheme}
            onTogglePinnedNote={togglePinnedNote}
            onToggleArchivedNote={toggleArchivedNote}
          />
        </div>

        <div
          className={
            isMobileEditorOpen
              ? "block min-h-screen flex-1"
              : "hidden min-h-screen flex-1 md:block"
          }
        >
          <NoteEditor
            allTags={recentTags}
            isDark={isDark}
            note={selectedNote}
            saveStatus={saveStatus}
            titleFocusRequest={titleFocusRequest}
            onUpdateNote={updateSelectedNote}
            onUpdateTags={updateSelectedNoteTags}
            onBackToList={() => setIsMobileEditorOpen(false)}
          />
        </div>
      </div>

      <DeleteConfirmModal
        isDark={isDark}
        notes={deleteTargetNotes}
        onCancel={() => setDeleteTargetIds([])}
        onConfirm={confirmDeleteNotes}
      />
    </main>
  );
}