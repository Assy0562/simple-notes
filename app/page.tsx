"use client";

import { useMemo, useState } from "react";

import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { NoteEditor } from "@/components/NoteEditor";
import { Sidebar } from "@/components/Sidebar";
import { TodoPanel } from "@/components/TodoPanel";
import { TodoSidebar } from "@/components/TodoSidebar";
import { useNotes } from "@/hooks/useNotes";
import { useTheme } from "@/hooks/useTheme";
import { useTodos } from "@/hooks/useTodos";

type AppMode = "notes" | "todos";

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
  const {
    activeTodoCount,
    completedTodoCount,
    filter: todoFilter,
    filteredTodos,
    selectedTodoList,
    selectedTodoListId,
    todoCountsByListId,
    todoLists,
    todos,
    clearCompletedTodos,
    createTodo,
    createSampleTodoLists,
    createTodoList,
    deleteTodo,
    deleteTodoList,
    deleteTodoLists,
    resetTodos,
    selectTodoList,
    setFilter: setTodoFilter,
    setSelectedTodosCompleted,
    setTodoListsArchived,
    toggleArchivedTodoList,
    togglePinnedTodoList,
    toggleTodo,
    updateSelectedTodoListTags,
    updateSelectedTodoListTitle,
  } = useTodos();
  const { isDark, setThemeMode, themeMode } = useTheme();
  const [appMode, setAppMode] = useState<AppMode>("notes");
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [isMobileEditorOpen, setIsMobileEditorOpen] = useState(false);
  const [isMobileTodoPanelOpen, setIsMobileTodoPanelOpen] = useState(false);

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
  const recentTodoTags = useMemo(
    () =>
      Array.from(
        new Set(
          [...todoLists]
            .sort((firstList, secondList) =>
              secondList.updatedAt.localeCompare(firstList.updatedAt),
            )
            .flatMap((list) => list.tags),
        ),
      ),
    [todoLists],
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

  function changeAppMode(nextMode: AppMode) {
    setAppMode(nextMode);
    setIsMobileEditorOpen(false);
    setIsMobileTodoPanelOpen(false);
  }

  function handleSelectNote(noteId: string) {
    selectNote(noteId);
    setIsMobileEditorOpen(true);
  }

  function handleCreateSampleTodoLists() {
    createSampleTodoLists();
    setIsMobileTodoPanelOpen(true);
  }

  function handleCreateTodoList() {
    createTodoList();
    setIsMobileTodoPanelOpen(true);
  }

  function handleSelectTodoList(todoListId: string) {
    selectTodoList(todoListId);
    setIsMobileTodoPanelOpen(true);
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
      <div
        className={`border-b px-3 py-2 ${
          isDark ? "border-[#2f2f2f] bg-[#202020]" : "border-[#e4e1dc] bg-[#f1efeb]"
        }`}
      >
        <div className="mx-auto flex max-w-5xl justify-center">
          <div
            className={`grid grid-cols-2 rounded-md border p-1 text-sm ${
              isDark
                ? "border-[#303030] bg-[#1b1b1b]"
                : "border-[#ded9d1] bg-[#f7f7f5]"
            }`}
          >
            <button
              type="button"
              onClick={() => changeAppMode("notes")}
              className={`rounded px-5 py-1.5 transition ${
                appMode === "notes"
                  ? isDark
                    ? "bg-[#303030] text-[#f1f1f1]"
                    : "bg-white text-[#37352f] shadow-sm"
                  : isDark
                    ? "text-[#9b9b9b] hover:text-[#d6d6d6]"
                    : "text-[#78746d] hover:text-[#4f4b45]"
              }`}
              aria-pressed={appMode === "notes"}
            >
              メモ
            </button>
            <button
              type="button"
              onClick={() => changeAppMode("todos")}
              className={`rounded px-5 py-1.5 transition ${
                appMode === "todos"
                  ? isDark
                    ? "bg-[#303030] text-[#f1f1f1]"
                    : "bg-white text-[#37352f] shadow-sm"
                  : isDark
                    ? "text-[#9b9b9b] hover:text-[#d6d6d6]"
                    : "text-[#78746d] hover:text-[#4f4b45]"
              }`}
              aria-pressed={appMode === "todos"}
            >
              ToDo
            </button>
          </div>
        </div>
      </div>

      {appMode === "notes" ? (
        <div className="min-h-[calc(100vh-57px)] md:flex">
          <div className={isMobileEditorOpen ? "hidden md:block" : "block"}>
            <Sidebar
              isDark={isDark}
              themeMode={themeMode}
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
              onChangeTheme={setThemeMode}
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
      ) : (
        <div className="min-h-[calc(100vh-57px)] md:flex">
          <div className={isMobileTodoPanelOpen ? "hidden md:block" : "block"}>
            <TodoSidebar
              isDark={isDark}
              themeMode={themeMode}
              selectedTodoListId={selectedTodoListId}
              todoCountsByListId={todoCountsByListId}
              todoLists={todoLists}
              todos={todos}
              onArchiveTodoLists={setTodoListsArchived}
              onCreateSampleTodoLists={handleCreateSampleTodoLists}
              onCreateTodoList={handleCreateTodoList}
              onDeleteTodoList={deleteTodoList}
              onDeleteTodoLists={deleteTodoLists}
              onResetTodos={resetTodos}
              onSelectTodoList={handleSelectTodoList}
              onToggleArchivedTodoList={toggleArchivedTodoList}
              onTogglePinnedTodoList={togglePinnedTodoList}
              onChangeTheme={setThemeMode}
            />
          </div>

          <div
            className={
              isMobileTodoPanelOpen
                ? "block min-h-screen flex-1"
                : "hidden min-h-screen flex-1 md:block"
            }
          >
            <TodoPanel
              activeTodoCount={activeTodoCount}
              allTags={recentTodoTags}
              completedTodoCount={completedTodoCount}
              filter={todoFilter}
              isDark={isDark}
              todoList={selectedTodoList}
              todos={filteredTodos}
              onBackToLists={() => setIsMobileTodoPanelOpen(false)}
              onClearCompletedTodos={clearCompletedTodos}
              onCreateTodo={createTodo}
              onDeleteTodo={deleteTodo}
              onSetAllTodosCompleted={setSelectedTodosCompleted}
              onSetFilter={setTodoFilter}
              onToggleTodo={toggleTodo}
              onUpdateTodoListTags={updateSelectedTodoListTags}
              onUpdateTodoListTitle={updateSelectedTodoListTitle}
            />
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isDark={isDark}
        notes={deleteTargetNotes}
        onCancel={() => setDeleteTargetIds([])}
        onConfirm={confirmDeleteNotes}
      />
    </main>
  );
}
