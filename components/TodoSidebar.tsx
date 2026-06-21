"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";

import { ThemeSelector } from "@/components/ThemeSelector";
import type { ThemeMode } from "@/hooks/useTheme";
import type { Todo, TodoList } from "@/types/todo";

const USER_NAME_KEY = "simple-notion-user-name";
const DEFAULT_USER_NAME = "Unknown";

type SortMode = "updated-desc" | "created-desc" | "title-asc";

type TodoSidebarProps = {
  isDark: boolean;
  themeMode: ThemeMode;
  selectedTodoListId: string;
  todoCountsByListId: Record<string, { active: number; total: number }>;
  todoLists: TodoList[];
  todos: Todo[];
  onArchiveTodoLists: (ids: string[], isArchived: boolean) => void;
  onChangeTheme: (themeMode: ThemeMode) => void;
  onCreateTodoList: () => void;
  onDeleteTodoList: (id: string) => void;
  onDeleteTodoLists: (ids: string[]) => void;
  onResetTodos: () => void;
  onSelectTodoList: (id: string) => void;
  onToggleArchivedTodoList: (id: string) => void;
  onTogglePinnedTodoList: (id: string) => void;
};

export function TodoSidebar({
  isDark,
  themeMode,
  selectedTodoListId,
  todoCountsByListId,
  todoLists,
  todos,
  onArchiveTodoLists,
  onChangeTheme,
  onCreateTodoList,
  onDeleteTodoList,
  onDeleteTodoLists,
  onResetTodos,
  onSelectTodoList,
  onToggleArchivedTodoList,
  onTogglePinnedTodoList,
}: TodoSidebarProps) {
  const [userName, setUserName] = useState(DEFAULT_USER_NAME);
  const [draftUserName, setDraftUserName] = useState(DEFAULT_USER_NAME);
  const [isEditingUserName, setIsEditingUserName] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isArchiveView, setIsArchiveView] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTodoListIds, setSelectedTodoListIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("updated-desc");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(true);
  const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagFilterText, setTagFilterText] = useState("");
  const [openTagTodoListId, setOpenTagTodoListId] = useState<string | null>(null);

  const displayUserName = userName.trim() || "あなた";
  const normalizedSearchText = searchText.trim().toLowerCase();
  const activeListCount = todoLists.filter((list) => !list.isArchived).length;
  const archivedListCount = todoLists.length - activeListCount;
  const sourceTodoLists = todoLists.filter(
    (list) => list.isArchived === isArchiveView,
  );
  const sortedTodoLists = [...sourceTodoLists].sort(compareTodoLists);
  const allTags = useMemo(
    () =>
      Array.from(new Set(todoLists.flatMap((list) => list.tags))).sort(
        (firstTag, secondTag) => firstTag.localeCompare(secondTag, "ja"),
      ),
    [todoLists],
  );

  // リスト名・タグ・リスト内のToDoを検索します。
  // filterは新しい配列を作るため、元のtodoListsは変更されません。
  const filteredTodoLists = sortedTodoLists.filter((list) => {
    const matchesSelectedTags = selectedTags.every((tag) =>
      list.tags.includes(tag),
    );
    const matchesSearchText =
      normalizedSearchText === "" ||
      list.title.toLowerCase().includes(normalizedSearchText) ||
      list.tags.join(" ").toLowerCase().includes(normalizedSearchText) ||
      todos.some(
        (todo) =>
          todo.listId === list.id &&
          todo.title.toLowerCase().includes(normalizedSearchText),
      );

    return matchesSelectedTags && matchesSearchText;
  });

  const canCollapseList = filteredTodoLists.length > 10;
  const visibleTodoLists =
    canCollapseList && !isListOpen
      ? filteredTodoLists.slice(0, 10)
      : filteredTodoLists;
  const hiddenListCount = filteredTodoLists.length - visibleTodoLists.length;
  const hasActiveFilters =
    normalizedSearchText !== "" || selectedTags.length > 0;

  useEffect(() => {
    const savedUserName = localStorage.getItem(USER_NAME_KEY);

    if (savedUserName) {
      setUserName(savedUserName);
      setDraftUserName(savedUserName);
    }
  }, []);

  useEffect(() => {
    setSelectedTodoListIds((currentIds) =>
      currentIds.filter((id) => todoLists.some((list) => list.id === id)),
    );
  }, [todoLists]);

  useEffect(() => {
    setSelectedTags((currentTags) =>
      currentTags.filter((tag) => allTags.includes(tag)),
    );
  }, [allTags]);
  useEffect(() => {
    if (!canCollapseList && !isListOpen) {
      setIsListOpen(true);
    }
  }, [canCollapseList, isListOpen]);

  function compareTodoLists(firstList: TodoList, secondList: TodoList) {
    if (firstList.isPinned !== secondList.isPinned) {
      return firstList.isPinned ? -1 : 1;
    }

    if (sortMode === "created-desc") {
      return secondList.createdAt.localeCompare(firstList.createdAt);
    }

    if (sortMode === "title-asc") {
      return firstList.title.localeCompare(secondList.title, "ja");
    }

    return secondList.updatedAt.localeCompare(firstList.updatedAt);
  }

  function getSortLabel() {
    if (sortMode === "created-desc") {
      return "作成が新しい順";
    }

    if (sortMode === "title-asc") {
      return "タイトル順";
    }

    return "更新が新しい順";
  }

  function toggleSelectedTag(tag: string) {
    setSelectedTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag],
    );
  }

  function clearFilters() {
    setSearchText("");
    setSelectedTags([]);
    setTagFilterText("");
  }
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
  }

  function handleResetTodos() {
    onResetTodos();
    setSelectedTags([]);
    setTagFilterText("");
    setIsArchiveView(false);
    setSearchText("");
    setIsSettingsOpen(false);
    setIsSelectionMode(false);
    setSelectedTodoListIds([]);
  }

  function handleCreateTodoList() {
    onCreateTodoList();
    setIsArchiveView(false);
    setIsSelectionMode(false);
    setSelectedTodoListIds([]);
  }

  function startSelectionMode() {
    setIsSelectionMode(true);
    setSelectedTodoListIds([]);
    setIsListOpen(true);
  }

  function cancelSelectionMode() {
    setIsSelectionMode(false);
    setSelectedTodoListIds([]);
  }

  function changeArchiveView(nextArchiveView: boolean) {
    setIsArchiveView(nextArchiveView);
    cancelSelectionMode();
    setIsListOpen(true);
  }

  function toggleSelectedTodoList(todoListId: string) {
    setSelectedTodoListIds((currentIds) =>
      currentIds.includes(todoListId)
        ? currentIds.filter((id) => id !== todoListId)
        : [...currentIds, todoListId],
    );
  }

  function handleArchiveSelectedTodoLists() {
    if (selectedTodoListIds.length === 0) {
      return;
    }

    onArchiveTodoLists(selectedTodoListIds, !isArchiveView);
    cancelSelectionMode();
  }

  function handleDeleteSelectedTodoLists() {
    if (
      selectedTodoListIds.length === 0 ||
      todoLists.length - selectedTodoListIds.length < 1
    ) {
      return;
    }

    onDeleteTodoLists(selectedTodoListIds);
    cancelSelectionMode();
  }

  return (
    <aside
      className={`flex min-h-[calc(100vh-57px)] w-full flex-col border-r px-3 py-4 transition-colors md:w-72 md:shrink-0 ${
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
                if (event.key === "Enter") saveUserName();
                if (event.key === "Escape") cancelEditingUserName();
              }}
              className={`w-full rounded-md border px-2 py-1 text-sm font-semibold outline-none transition ${
                isDark
                  ? "border-[#3a3a3a] bg-[#1b1b1b] text-[#ededed] focus:border-[#555555]"
                  : "border-[#ded9d1] bg-[#f7f7f5] text-[#2f2f2f] focus:border-[#b9b2a7]"
              }`}
              placeholder="ユーザー名"
            />
          ) : (
            <button
              type="button"
              onClick={startEditingUserName}
              className={`block w-full rounded-md px-2 py-1 text-left text-sm font-semibold transition ${
                isDark ? "hover:bg-[#2b2b2b]" : "hover:bg-[#e7e3dd]"
              }`}
              title="ユーザー名を編集"
            >
              {displayUserName}のToDo
            </button>
          )}
        </div>

        {isSelectionMode ? (
          <SelectionActions
            canDelete={
              selectedTodoListIds.length > 0 &&
              todoLists.length - selectedTodoListIds.length >= 1
            }
            isArchiveView={isArchiveView}
            isDark={isDark}
            selectedCount={selectedTodoListIds.length}
            onArchive={handleArchiveSelectedTodoLists}
            onCancel={cancelSelectionMode}
            onDelete={handleDeleteSelectedTodoLists}
          />
        ) : (
          <div className="mb-2 grid grid-cols-[1fr_auto] gap-2">
            <button
              type="button"
              onClick={handleCreateTodoList}
              className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                isDark
                  ? "border-[#333333] bg-[#242424] text-[#d6d6d6] hover:bg-[#2b2b2b]"
                  : "border-[#ded9d1] bg-[#f7f7f5] text-[#4f4b45] hover:bg-[#eee9e1]"
              }`}
            >
              + 新規リスト
            </button>
            <button
              type="button"
              onClick={startSelectionMode}
              disabled={filteredTodoLists.length === 0}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition disabled:cursor-default disabled:opacity-40 ${
                isDark
                  ? "border-[#333333] bg-[#242424] text-[#bdbdbd] hover:bg-[#2d2d2d]"
                  : "border-[#ded9d1] bg-[#f7f7f5] text-[#6f6a62] hover:bg-[#eee9e1]"
              }`}
            >
              <SelectionIcon />
              選択
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
          <ViewButton
            count={activeListCount}
            isActive={!isArchiveView}
            isDark={isDark}
            label="ToDoリスト"
            onClick={() => changeArchiveView(false)}
          />
          <ViewButton
            count={archivedListCount}
            isActive={isArchiveView}
            isDark={isDark}
            label="アーカイブ"
            onClick={() => changeArchiveView(true)}
          />
        </div>

        <div className="mb-1.5 flex items-center gap-2 px-1">
          <div
            className={`flex min-w-0 flex-1 items-center gap-1 px-1 py-1 text-xs font-medium ${
              isDark ? "text-[#9b9b9b]" : "text-[#78746d]"
            }`}
          >
            <ListIcon />
            <span>{isArchiveView ? "アーカイブ" : "ToDo一覧"}</span>
            <span
              className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] ${
                isDark
                  ? "bg-[#333333] text-[#d6d6d6]"
                  : "bg-white text-[#5f5a52]"
              }`}
            >
              {filteredTodoLists.length}件
            </span>
          </div>
        </div>

        <div className="relative mb-2">
          <SearchIcon isDark={isDark} />
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className={`w-full rounded-md border py-2 pl-9 pr-9 text-sm outline-none transition ${
              isDark
                ? "border-[#303030] bg-[#1b1b1b] text-[#e6e6e6] placeholder:text-[#777777] focus:border-[#555555]"
                : "border-[#ded9d1] bg-[#f7f7f5] text-[#37352f] placeholder:text-[#9b968e] focus:border-[#b9b2a7]"
            }`}
            placeholder="ToDoリストを検索"
          />
          {searchText !== "" && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              className={`absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded transition ${
                isDark
                  ? "text-[#9b9b9b] hover:bg-[#303030]"
                  : "text-[#8a857d] hover:bg-[#eee9e1]"
              }`}
              aria-label="条件をクリア"
            >
              ×
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
            title="フィルター"
            aria-label="フィルター"
            aria-expanded={isTagFilterOpen}
            aria-pressed={selectedTags.length > 0}
          >
            <FilterTagIcon />
            {selectedTags.length > 0 && (
              <span className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] ${isDark ? "bg-[#f0c36a] text-[#272016]" : "bg-[#7a5a18] text-white"}`}>
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
            className={`flex h-8 w-8 items-center justify-center rounded-md transition ${isSortMenuOpen ? isDark ? "bg-[#303030] text-[#f1f1f1]" : "bg-white text-[#37352f] shadow-sm" : isDark ? "text-[#9b9b9b] hover:bg-[#2b2b2b] hover:text-[#d6d6d6]" : "text-[#78746d] hover:bg-[#e7e3dd] hover:text-[#4f4b45]"}`}
            title={getSortLabel()}
            aria-label={`並び替え: ${getSortLabel()}`}
            aria-expanded={isSortMenuOpen}
          >
            <SortIcon />
          </button>

          {isTagFilterOpen && (
            <TagFilterMenu
              allTags={allTags}
              filterText={tagFilterText}
              isDark={isDark}
              selectedTags={selectedTags}
              onChangeFilterText={setTagFilterText}
              onClearFilterText={() => setTagFilterText("")}
              onClearSelectedTags={() => setSelectedTags([])}
              onToggleTag={toggleSelectedTag}
            />
          )}

          {isSortMenuOpen && (
            <SortMenu
              isDark={isDark}
              sortMode={sortMode}
              onSelect={(nextSortMode) => {
                setSortMode(nextSortMode);
                setIsSortMenuOpen(false);
              }}
            />
          )}
        </div>


        {visibleTodoLists.length > 0 ? (
          <div className="space-y-1 pr-1">
            {visibleTodoLists.map((list) => (
              <TodoListRow
                key={list.id}
                canDelete={todoLists.length > 1}
                counts={todoCountsByListId[list.id] ?? { active: 0, total: 0 }}
                isChecked={selectedTodoListIds.includes(list.id)}
                isDark={isDark}
                isSelected={list.id === selectedTodoListId}
                isSelectionMode={isSelectionMode}
                isTagsOpen={openTagTodoListId === list.id}
                list={list}
                onDelete={() => onDeleteTodoList(list.id)}
                onSelect={() =>
                  isSelectionMode
                    ? toggleSelectedTodoList(list.id)
                    : onSelectTodoList(list.id)
                }
                onToggleArchive={() => onToggleArchivedTodoList(list.id)}
                onTogglePin={() => onTogglePinnedTodoList(list.id)}
                onToggleTags={() => setOpenTagTodoListId((currentId) => currentId === list.id ? null : list.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyList
            hasFilters={hasActiveFilters}
            isArchiveView={isArchiveView}
            isDark={isDark}
            onClearFilters={clearFilters}
          />
        )}

        {canCollapseList && (
          <button
            type="button"
            onClick={() => setIsListOpen((isOpen) => !isOpen)}
            className={`mt-1 flex w-full items-center justify-center gap-1 rounded-md px-3 py-2 text-xs transition ${
              isDark
                ? "text-[#bdbdbd] hover:bg-[#2d2d2d]"
                : "text-[#6f6a62] hover:bg-[#eee9e1]"
            }`}
            aria-expanded={isListOpen}
          >
            <ChevronIcon isOpen={isListOpen} />
            {isListOpen ? "少なく表示" : `${hiddenListCount}件さらに表示`}
          </button>
        )}
      </div>

      <div
        className={`relative mt-4 flex justify-start border-t px-2 pt-3 ${
          isDark ? "border-[#303030]" : "border-[#e4e1dc]"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsSettingsOpen((isOpen) => !isOpen)}
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
            isDark
              ? "border-[#3a3a3a] bg-[#262626] text-[#e6e6e6] hover:bg-[#303030]"
              : "border-[#ded9d1] bg-[#f7f7f5] text-[#5f5a52] hover:bg-[#e7e3dd]"
          }`}
          title="設定"
          aria-label="設定"
          aria-expanded={isSettingsOpen}
        >
          <SettingsIcon />
        </button>

        {isSettingsOpen && (
          <div
            className={`absolute bottom-14 left-2 w-44 rounded-md border p-1 shadow-lg ${
              isDark
                ? "border-[#333333] bg-[#252525]"
                : "border-[#e4e1dc] bg-[#fbfaf8]"
            }`}
          >
            <button
              type="button"
              onClick={handleStartEditingUserName}
              className={menuItemClass(isDark)}
            >
              ユーザー名を変更
            </button>
            <ThemeSelector
              isDark={isDark}
              themeMode={themeMode}
              onChangeTheme={onChangeTheme}
            />
            <button
              type="button"
              onClick={handleResetTodos}
              className={menuItemClass(isDark)}
            >
              初期ToDoに戻す
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function menuItemClass(isDark: boolean) {
  return `w-full rounded px-3 py-2 text-left text-sm transition ${
    isDark
      ? "text-[#e6e6e6] hover:bg-[#303030]"
      : "text-[#4f4b45] hover:bg-[#eeeae4]"
  }`;
}

type SelectionActionsProps = {
  canDelete: boolean;
  isArchiveView: boolean;
  isDark: boolean;
  selectedCount: number;
  onArchive: () => void;
  onCancel: () => void;
  onDelete: () => void;
};

function SelectionActions({
  canDelete,
  isArchiveView,
  isDark,
  selectedCount,
  onArchive,
  onCancel,
  onDelete,
}: SelectionActionsProps) {
  return (
    <div className="mb-2 grid grid-cols-[1fr_auto_auto] gap-2">
      <button
        type="button"
        onClick={onArchive}
        disabled={selectedCount === 0}
        className={`rounded-md border px-3 py-2 text-left text-sm transition disabled:cursor-default disabled:opacity-40 ${
          isDark
            ? "border-[#333333] bg-[#242424] text-[#d6d6d6] hover:bg-[#2b2b2b]"
            : "border-[#ded9d1] bg-[#f7f7f5] text-[#4f4b45] hover:bg-[#eee9e1]"
        }`}
      >
        {selectedCount}件{isArchiveView ? "戻す" : "保管"}
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={!canDelete}
        className={`rounded-md border px-3 py-2 text-sm transition disabled:cursor-default disabled:opacity-40 ${
          isDark
            ? "border-[#5a2f2f] bg-[#3a2525] text-[#f0c9c9] hover:bg-[#4a2c2c]"
            : "border-[#e2c1b8] bg-[#fff2ef] text-[#9a3f2f] hover:bg-[#ffe8e1]"
        }`}
      >
        削除
      </button>
      <button
        type="button"
        onClick={onCancel}
        className={`rounded-md border px-3 py-2 text-sm transition ${
          isDark
            ? "border-[#333333] bg-[#242424] text-[#bdbdbd] hover:bg-[#2d2d2d]"
            : "border-[#ded9d1] bg-[#f7f7f5] text-[#6f6a62] hover:bg-[#eee9e1]"
        }`}
      >
        解除
      </button>
    </div>
  );
}

type TodoListRowProps = {
  canDelete: boolean;
  counts: { active: number; total: number };
  isChecked: boolean;
  isDark: boolean;
  isSelected: boolean;
  isSelectionMode: boolean;
  isTagsOpen: boolean;
  list: TodoList;
  onDelete: () => void;
  onSelect: () => void;
  onToggleArchive: () => void;
  onTogglePin: () => void;
  onToggleTags: () => void;
};

function TodoListRow({
  canDelete,
  counts,
  isChecked,
  isDark,
  isSelected,
  isSelectionMode,
  isTagsOpen,
  list,
  onDelete,
  onSelect,
  onToggleArchive,
  onTogglePin,
  onToggleTags,
}: TodoListRowProps) {
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  function runMobileAction(action: () => void) {
    action();
    setIsActionMenuOpen(false);
  }

  return (
    <div
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
          onClick={onSelect}
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
          aria-label="ToDoリストを選択"
        >
          <span aria-hidden="true" className="text-xs leading-none">✓</span>
        </button>
      )}

      <div className="min-w-0 flex-1">
        <button type="button" onClick={onSelect} className="w-full min-w-0 text-left">
          <span className="block truncate text-sm font-medium">{list.title.trim() || "無題のリスト"}</span>
          <span className={`mt-1 block truncate text-xs ${isDark ? "text-[#9b9b9b]" : "text-[#78746d]"}`}>未完了 {counts.active} / 全体 {counts.total}</span>
        </button>
        {isTagsOpen && list.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {list.tags.map((tag) => <span key={tag} className={`max-w-full truncate rounded-full border px-2 py-0.5 text-[11px] ${isDark ? "border-[#3a3a3a] bg-[#242424] text-[#bdbdbd]" : "border-[#e1ddd5] bg-[#f7f4ee] text-[#6f6a62]"}`} title={tag}>{tag}</span>)}
          </div>
        )}
      </div>

      {!isSelectionMode && (
        <div className="flex shrink-0 items-center gap-1 md:hidden">
          {list.isPinned && <span className={`flex h-7 w-7 items-center justify-center ${isDark ? "text-[#f0c36a]" : "text-[#9a6a12]"}`} title="ピン留め中"><PinIcon /></span>}
          <button type="button" onClick={() => setIsActionMenuOpen((isOpen) => !isOpen)} className={`flex h-8 w-8 items-center justify-center rounded-md text-lg leading-none transition ${isActionMenuOpen ? isDark ? "bg-[#3a3a3a] text-[#f1f1f1]" : "bg-[#ddd8d0] text-[#37352f]" : isDark ? "text-[#bdbdbd] hover:bg-[#3a3a3a]" : "text-[#6f6a62] hover:bg-[#ddd8d0]"}`} aria-label="ToDoリストの操作メニュー" aria-expanded={isActionMenuOpen}>⋯</button>
        </div>
      )}

      {isActionMenuOpen && !isSelectionMode && (
        <div className={`note-action-menu absolute right-2 top-11 z-30 w-44 rounded-md border p-1 shadow-lg md:hidden ${isDark ? "border-[#3a3a3a] bg-[#252525]" : "border-[#e4e1dc] bg-[#fbfaf8]"}`}>
          <MobileActionButton icon={<PinIcon />} isDark={isDark} label={list.isPinned ? "ピン留めを解除" : "ピン留め"} onClick={() => runMobileAction(onTogglePin)} />
          {list.tags.length > 0 && <MobileActionButton icon={<TagIcon />} isDark={isDark} label={isTagsOpen ? "タグを隠す" : "タグを表示"} onClick={() => runMobileAction(onToggleTags)} />}
          <MobileActionButton icon={<ArchiveIcon isArchived={list.isArchived} />} isDark={isDark} label={list.isArchived ? "アーカイブから戻す" : "アーカイブ"} onClick={() => runMobileAction(onToggleArchive)} />
          <MobileActionButton danger disabled={!canDelete} icon={<TrashIcon />} isDark={isDark} label={canDelete ? "削除" : "最後のリストは削除できません"} onClick={() => runMobileAction(onDelete)} />
        </div>
      )}

      <div className="hidden shrink-0 items-center gap-1 md:flex">
        <button type="button" onClick={onTogglePin} className={`flex h-6 w-6 items-center justify-center overflow-hidden rounded transition ${list.isPinned ? isDark ? "bg-[#3a3327] text-[#f0c36a]" : "bg-[#fff3cf] text-[#9a6a12]" : isDark ? "text-[#9b9b9b] opacity-0 hover:bg-[#3a3a3a] hover:text-[#f1f1f1] group-hover:opacity-100" : "text-[#8a857d] opacity-0 hover:bg-[#ddd8d0] hover:text-[#37352f] group-hover:opacity-100"}`} title={list.isPinned ? "ピン留めを解除" : "ピン留め"} aria-label={list.isPinned ? "ピン留めを解除" : "ピン留め"} aria-pressed={list.isPinned}><PinIcon /></button>
        <button type="button" onClick={onToggleArchive} className={`flex h-6 w-6 items-center justify-center rounded opacity-0 transition group-hover:opacity-100 ${isDark ? "text-[#9b9b9b] hover:bg-[#3a3a3a] hover:text-[#f1f1f1]" : "text-[#8a857d] hover:bg-[#ddd8d0] hover:text-[#37352f]"}`} title={list.isArchived ? "アーカイブから戻す" : "アーカイブ"} aria-label={list.isArchived ? "アーカイブから戻す" : "アーカイブ"}><ArchiveIcon compact isArchived={list.isArchived} /></button>
        {list.tags.length > 0 && <button type="button" onClick={onToggleTags} className={`flex h-6 w-6 items-center justify-center rounded transition ${isTagsOpen ? isDark ? "bg-[#3a3a3a] text-[#f1f1f1]" : "bg-[#ddd8d0] text-[#37352f]" : isDark ? "text-[#9b9b9b] opacity-0 hover:bg-[#3a3a3a] hover:text-[#f1f1f1] group-hover:opacity-100" : "text-[#8a857d] opacity-0 hover:bg-[#ddd8d0] hover:text-[#37352f] group-hover:opacity-100"}`} title="タグを表示" aria-label="タグを表示" aria-expanded={isTagsOpen}><ListTagIcon /></button>}
        <button type="button" onClick={onDelete} disabled={!canDelete} className={`h-6 w-6 rounded text-sm opacity-0 transition disabled:cursor-not-allowed disabled:opacity-30 group-hover:opacity-100 ${isDark ? "text-[#9b9b9b] hover:bg-[#3a3a3a] hover:text-[#f1f1f1]" : "text-[#8a857d] hover:bg-[#ddd8d0] hover:text-[#37352f]"}`} title={canDelete ? "ToDoリストを削除" : "最後のリストは削除できません"}>×</button>
      </div>
    </div>
  );
}

function MobileActionButton({ danger = false, disabled = false, icon, isDark, label, onClick }: { danger?: boolean; disabled?: boolean; icon: ReactNode; isDark: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`flex w-full items-center gap-2.5 rounded px-3 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${danger ? isDark ? "text-[#e8b2b2] hover:bg-[#3a2b2b]" : "text-[#a34838] hover:bg-[#fff0ec]" : isDark ? "text-[#e6e6e6] hover:bg-[#303030]" : "text-[#4f4b45] hover:bg-[#eeeae4]"}`}>
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
function EmptyList({
  hasFilters,
  isArchiveView,
  isDark,
  onClearFilters,
}: {
  hasFilters: boolean;
  isArchiveView: boolean;
  isDark: boolean;
  onClearFilters: () => void;
}) {
  return (
    <div
      className={`rounded-md border px-3 py-4 text-xs ${
        isDark
          ? "border-[#303030] bg-[#1b1b1b] text-[#9b9b9b]"
          : "border-[#e4e1dc] bg-[#f7f7f5] text-[#78746d]"
      }`}
    >
      <p>{hasFilters ? "検索やタグに一致するリストがありません" : isArchiveView ? "アーカイブされたリストはありません" : "ToDoリストがありません"}</p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className={`mt-3 rounded-md border px-2 py-1.5 transition ${
            isDark
              ? "border-[#3a3a3a] text-[#d6d6d6] hover:bg-[#303030]"
              : "border-[#ded9d1] text-[#5f5a52] hover:bg-[#eee9e1]"
          }`}
        >
          条件をクリア
        </button>
      )}
    </div>
  );
}

function TagFilterMenu({
  allTags,
  filterText,
  isDark,
  selectedTags,
  onChangeFilterText,
  onClearFilterText,
  onClearSelectedTags,
  onToggleTag,
}: {
  allTags: string[];
  filterText: string;
  isDark: boolean;
  selectedTags: string[];
  onChangeFilterText: (text: string) => void;
  onClearFilterText: () => void;
  onClearSelectedTags: () => void;
  onToggleTag: (tag: string) => void;
}) {
  const normalizedFilterText = filterText.trim().toLowerCase();
  const selectedFilterTags = selectedTags.filter((tag) => allTags.includes(tag));
  const availableFilterTags = allTags
    .filter((tag) => !selectedFilterTags.includes(tag))
    .filter(
      (tag) =>
        normalizedFilterText === "" ||
        tag.toLowerCase().includes(normalizedFilterText),
    );

  return (
    <div className={`absolute left-1 top-11 z-20 w-56 rounded-md border p-2 shadow-lg ${isDark ? "border-[#333333] bg-[#252525]" : "border-[#e4e1dc] bg-[#fbfaf8]"}`}>
      <input
        value={filterText}
        onChange={(event) => onChangeFilterText(event.target.value)}
        className={`mb-2 w-full rounded-md border px-2 py-1.5 text-sm outline-none transition ${isDark ? "border-[#3a3a3a] bg-[#1b1b1b] text-[#e6e6e6] placeholder:text-[#777777] focus:border-[#555555]" : "border-[#ded9d1] bg-[#f7f7f5] text-[#37352f] placeholder:text-[#9b968e] focus:border-[#b9b2a7]"}`}
        placeholder="タグを検索"
      />

      {selectedFilterTags.length > 0 && (
        <div className={`mb-2 border-b pb-2 ${isDark ? "border-[#333333]" : "border-[#e4e1dc]"}`}>
          <div className={`mb-1 px-1 text-[11px] font-medium ${isDark ? "text-[#9b9b9b]" : "text-[#78746d]"}`}>選択中</div>
          <div className="flex flex-wrap gap-1">
            {selectedFilterTags.map((tag) => (
              <button key={tag} type="button" onClick={() => onToggleTag(tag)} className={`max-w-full truncate rounded-full border px-2 py-1 text-xs transition ${isDark ? "border-[#555555] bg-[#333333] text-[#f1f1f1] hover:bg-[#3a3a3a]" : "border-[#cfc7bc] bg-white text-[#37352f] shadow-sm hover:bg-[#f2eee8]"}`} title={tag}>
                {tag} ×
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-h-48 overflow-y-auto pr-1">
        {availableFilterTags.length > 0 ? availableFilterTags.map((tag) => (
          <button key={tag} type="button" onClick={() => onToggleTag(tag)} className={`flex w-full items-center justify-between gap-3 rounded px-3 py-2 text-left text-sm transition ${isDark ? "text-[#e6e6e6] hover:bg-[#303030]" : "text-[#4f4b45] hover:bg-[#eeeae4]"}`} title={tag}>
            <span className="min-w-0 truncate">{tag}</span>
          </button>
        )) : (
          <p className={`px-3 py-2 text-xs ${isDark ? "text-[#9b9b9b]" : "text-[#78746d]"}`}>一致するタグがありません</p>
        )}
      </div>

      {(selectedTags.length > 0 || filterText !== "") && (
        <div className={`mt-2 border-t pt-1 ${isDark ? "border-[#333333]" : "border-[#e4e1dc]"}`}>
          {filterText !== "" && <button type="button" onClick={onClearFilterText} className={`flex w-full items-center rounded px-3 py-2 text-left text-sm transition ${isDark ? "text-[#bdbdbd] hover:bg-[#303030]" : "text-[#6f6a62] hover:bg-[#eeeae4]"}`}>検索をクリア</button>}
          {selectedTags.length > 0 && <button type="button" onClick={onClearSelectedTags} className={`flex w-full items-center rounded px-3 py-2 text-left text-sm transition ${isDark ? "text-[#bdbdbd] hover:bg-[#303030]" : "text-[#6f6a62] hover:bg-[#eeeae4]"}`}>フィルターをクリア</button>}
        </div>
      )}
    </div>
  );
}
function SortMenu({
  isDark,
  sortMode,
  onSelect,
}: {
  isDark: boolean;
  sortMode: SortMode;
  onSelect: (sortMode: SortMode) => void;
}) {
  const options: Array<{ label: string; value: SortMode }> = [
    { label: "更新が新しい順", value: "updated-desc" },
    { label: "作成が新しい順", value: "created-desc" },
    { label: "タイトル順", value: "title-asc" },
  ];

  return (
    <div
      className={`absolute left-10 top-11 z-20 w-52 rounded-md border p-1 shadow-lg ${
        isDark
          ? "border-[#333333] bg-[#252525]"
          : "border-[#e4e1dc] bg-[#fbfaf8]"
      }`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm transition ${
            isDark
              ? "text-[#e6e6e6] hover:bg-[#303030]"
              : "text-[#4f4b45] hover:bg-[#eeeae4]"
          }`}
          aria-pressed={sortMode === option.value}
        >
          {option.label}
          {sortMode === option.value && <span>✓</span>}
        </button>
      ))}
    </div>
  );
}

function ViewButton({ count, isActive, isDark, label, onClick }: { count: number; isActive: boolean; isDark: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1.5 transition ${isActive ? isDark ? "bg-[#303030] text-[#f1f1f1]" : "bg-white text-[#37352f] shadow-sm" : isDark ? "text-[#9b9b9b] hover:text-[#d6d6d6]" : "text-[#78746d] hover:text-[#4f4b45]"}`}
      aria-pressed={isActive}
    >
      {label}<span className="ml-1 opacity-70">{count}</span>
    </button>
  );
}

function SearchIcon({ isDark }: { isDark: boolean }) {
  return <svg aria-hidden="true" className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-[#777777]" : "text-[#9b968e]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>;
}

function ListIcon() {
  return <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.9"><path d="M8 6h12M8 12h12M8 18h12" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></svg>;
}

function FilterTagIcon() {
  return (
    <svg aria-hidden="true" className="block h-4 w-4 shrink-0 overflow-hidden" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7.17a2.5 2.5 0 0 1 1.77.73l7.33 7.33a2.5 2.5 0 0 1 0 3.54l-6.17 6.17a2.5 2.5 0 0 1-3.54 0L3.73 13.44A2.5 2.5 0 0 1 3 11.67V4.5Zm6 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
  );
}
function ListTagIcon() {
  return (
    <svg aria-hidden="true" className="block h-3.5 w-3.5 shrink-0 overflow-hidden" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7.17a2.5 2.5 0 0 1 1.77.73l7.33 7.33a2.5 2.5 0 0 1 0 3.54l-6.17 6.17a2.5 2.5 0 0 1-3.54 0L3.73 13.44A2.5 2.5 0 0 1 3 11.67V4.5Zm6 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7.17a2.5 2.5 0 0 1 1.77.73l7.33 7.33a2.5 2.5 0 0 1 0 3.54l-6.17 6.17a2.5 2.5 0 0 1-3.54 0L3.73 13.44A2.5 2.5 0 0 1 3 11.67V4.5Z" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  );
}
function SortIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.9"><path d="M8 4v16" /><path d="m5 7 3-3 3 3" /><path d="M16 20V4" /><path d="m13 17 3 3 3-3" /></svg>;
}

function SelectionIcon() {
  return <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.9"><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8 12 3 3 5-6" /></svg>;
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return <svg aria-hidden="true" className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-90" : "-rotate-90"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>;
}

function PinIcon() {
  return <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M9 3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5v3.2l3.6 3.6A1.4 1.4 0 0 1 17.6 12H14v4.2l-.9 5.1a1.1 1.1 0 0 1-2.2 0l-.9-5.1V12H6.4a1.4 1.4 0 0 1-1-2.4L9 6.7V3.5Z" /></svg>;
}

function ArchiveIcon({ compact = false, isArchived }: { compact?: boolean; isArchived: boolean }) {
  return <svg aria-hidden="true" className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M4 8h16" /><path d="M6 8v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" /><path d="M8 4h8l2 4H6l2-4Z" />{isArchived ? <path d="m9 15 3-3 3 3" /> : <path d="m9 13 3 3 3-3" />}</svg>;
}

function TrashIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16" /><path d="M9 3h6l1 4H8l1-4Z" /><path d="M6.5 7 7.5 21h9l1-14" /><path d="M10 11v6M14 11v6" /></svg>;
}

function SettingsIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.04.04a2 2 0 0 1-2.83 2.83l-.04-.04A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.05a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.04.04a2 2 0 0 1-2.83-2.83l.04-.04A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.05a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.04-.04a2 2 0 0 1 2.83-2.83l.04.04A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.05a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.04-.04a2 2 0 0 1 2.83 2.83l-.04.04A1.7 1.7 0 0 0 19.4 9c.22.62.8 1 1.55 1H21a2 2 0 0 1 0 4h-.05a1.7 1.7 0 0 0-1.55 1Z" /></svg>;
}