"use client";

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
    createNote,
    deleteNote,
    resetNotes,
    selectNote,
    updateSelectedNote,
  } = useNotes();
  const { isDark, toggleTheme } = useTheme();

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
          onCreateNote={createNote}
          onDeleteNote={deleteNote}
          onResetNotes={resetNotes}
          onSelectNote={selectNote}
          onToggleTheme={toggleTheme}
        />

        <NoteEditor
          isDark={isDark}
          note={selectedNote}
          saveStatus={saveStatus}
          titleFocusRequest={titleFocusRequest}
          onUpdateNote={updateSelectedNote}
        />
      </div>
    </main>
  );
}
