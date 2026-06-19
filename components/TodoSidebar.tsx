"use client";

import { useEffect, useState } from "react";

import { ThemeSelector } from "@/components/ThemeSelector";
import type { ThemeMode } from "@/hooks/useTheme";
import type { TodoList } from "@/types/todo";

const USER_NAME_KEY = "simple-notion-user-name";
const DEFAULT_USER_NAME = "Unknown";

type TodoSidebarProps = {
  isDark: boolean;
  themeMode: ThemeMode;
  selectedTodoListId: string;
  todoCountsByListId: Record<string, { active: number; total: number }>;
  todoLists: TodoList[];
  onCreateTodoList: () => void;
  onDeleteTodoList: (id: string) => void;
  onSelectTodoList: (id: string) => void;
  onChangeTheme: (themeMode: ThemeMode) => void;
};

export function TodoSidebar({
  isDark,
  themeMode,
  selectedTodoListId,
  todoCountsByListId,
  todoLists,
  onCreateTodoList,
  onDeleteTodoList,
  onSelectTodoList,
  onChangeTheme,
}: TodoSidebarProps) {
  const [userName, setUserName] = useState(DEFAULT_USER_NAME);
  const [draftUserName, setDraftUserName] = useState(DEFAULT_USER_NAME);
  const [isEditingUserName, setIsEditingUserName] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const displayUserName = userName.trim() || "あなた";

  useEffect(() => {
    const savedUserName = localStorage.getItem(USER_NAME_KEY);

    if (savedUserName) {
      setUserName(savedUserName);
      setDraftUserName(savedUserName);
    }
  }, []);

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


  return (
    <aside
      className={`flex min-h-[calc(100vh-57px)] w-full flex-col border-r px-3 py-4 transition-colors md:w-72 ${
        isDark
          ? "border-[#2f2f2f] bg-[#202020]"
          : "border-[#e4e1dc] bg-[#f1efeb]"
      }`}
    >
      <div className="min-h-0 flex-1">
        <div className="px-2 pb-4">
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
              {displayUserName}
              のToDo
            </button>
          )}
          <p
            className={`mt-1 px-2 text-xs ${
              isDark ? "text-[#9b9b9b]" : "text-[#78746d]"
            }`}
          >
            リストごとにタスクを整理
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateTodoList}
          className={`mb-4 flex w-full items-center justify-center rounded-md border px-3 py-2 text-sm transition ${
            isDark
              ? "border-[#333333] bg-[#242424] text-[#d6d6d6] hover:bg-[#2d2d2d]"
              : "border-[#ded9d1] bg-[#fbfaf8] text-[#4f4b45] hover:bg-[#eee9e1]"
          }`}
        >
          + 新規リスト
        </button>

        <div className="space-y-1 overflow-y-auto pr-1">
          {todoLists.map((list) => {
            const isSelected = list.id === selectedTodoListId;
            const counts = todoCountsByListId[list.id] ?? { active: 0, total: 0 };

            return (
              <div
                key={list.id}
                className={`group flex items-start gap-2 rounded-md px-2 py-2 transition ${
                  isSelected
                    ? isDark
                      ? "bg-[#303030]"
                      : "bg-white shadow-sm"
                    : isDark
                      ? "hover:bg-[#2a2a2a]"
                      : "hover:bg-[#e9e5dd]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectTodoList(list.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block truncate text-sm font-semibold">
                    {list.title.trim() || "無題のリスト"}
                  </span>
                  <span
                    className={`mt-1 block text-xs ${
                      isDark ? "text-[#9b9b9b]" : "text-[#78746d]"
                    }`}
                  >
                    未完了 {counts.active} / 全体 {counts.total}
                  </span>
                </button>

                {todoLists.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onDeleteTodoList(list.id)}
                    className={`h-7 w-7 shrink-0 rounded text-sm opacity-100 transition md:opacity-0 md:group-hover:opacity-100 ${
                      isDark
                        ? "text-[#9b9b9b] hover:bg-[#3a3a3a] hover:text-[#f1f1f1]"
                        : "text-[#8a857d] hover:bg-[#ddd8d0] hover:text-[#37352f]"
                    }`}
                    aria-label="ToDoリストを削除"
                    title="ToDoリストを削除"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
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
            <button
              type="button"
              onClick={handleStartEditingUserName}
              className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                isDark
                  ? "text-[#e6e6e6] hover:bg-[#303030]"
                  : "text-[#4f4b45] hover:bg-[#eeeae4]"
              }`}
            >
              ユーザー名を変更
            </button>

            <ThemeSelector
              isDark={isDark}
              themeMode={themeMode}
              onChangeTheme={onChangeTheme}
            />
          </div>
        )}
      </div>
    </aside>
  );
}