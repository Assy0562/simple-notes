"use client";

import { useState } from "react";

import type { Todo, TodoList } from "@/types/todo";

type TodoFilter = "all" | "active" | "completed";

type TodoPanelProps = {
  activeTodoCount: number;
  completedTodoCount: number;
  filter: TodoFilter;
  isDark: boolean;
  todoList: TodoList;
  todos: Todo[];
  onBackToLists: () => void;
  onClearCompletedTodos: () => void;
  onCreateTodo: (title: string) => void;
  onDeleteTodo: (id: string) => void;
  onSetFilter: (filter: TodoFilter) => void;
  onToggleTodo: (id: string) => void;
  onUpdateTodoListTitle: (title: string) => void;
};

const filterOptions: Array<{ label: string; value: TodoFilter }> = [
  { label: "すべて", value: "all" },
  { label: "未完了", value: "active" },
  { label: "完了", value: "completed" },
];

export function TodoPanel({
  activeTodoCount,
  completedTodoCount,
  filter,
  isDark,
  todoList,
  todos,
  onBackToLists,
  onClearCompletedTodos,
  onCreateTodo,
  onDeleteTodo,
  onSetFilter,
  onToggleTodo,
  onUpdateTodoListTitle,
}: TodoPanelProps) {
  const [todoDraft, setTodoDraft] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCreateTodo(todoDraft);
    setTodoDraft("");
  }

  return (
    <section className="min-h-[calc(100vh-57px)] flex-1 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBackToLists}
          className={`mb-4 rounded-md px-3 py-2 text-sm transition md:hidden ${
            isDark
              ? "text-[#c9c9c9] hover:bg-[#2a2a2a]"
              : "text-[#5f5a52] hover:bg-[#eee9e1]"
          }`}
        >
          ← リストへ戻る
        </button>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <input
            value={todoList.title}
            onChange={(event) => onUpdateTodoListTitle(event.target.value)}
            className={`min-w-0 flex-1 bg-transparent text-3xl font-bold tracking-normal outline-none md:text-4xl ${
              isDark
                ? "text-[#ededed] placeholder:text-[#777777]"
                : "text-[#37352f] placeholder:text-[#aaa39a]"
            }`}
            placeholder="無題のリスト"
            aria-label="ToDoリスト名"
          />

          <div
            className={`w-fit rounded-full border px-3 py-1 text-xs ${
              isDark
                ? "border-[#333333] bg-[#202020] text-[#c9c9c9]"
                : "border-[#e4e1dc] bg-[#fbfaf8] text-[#5f5a52]"
            }`}
          >
            未完了 {activeTodoCount} / 完了 {completedTodoCount}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
          <input
            value={todoDraft}
            onChange={(event) => setTodoDraft(event.target.value)}
            className={`min-w-0 flex-1 rounded-md border px-3 py-2 text-sm outline-none transition ${
              isDark
                ? "border-[#303030] bg-[#1f1f1f] text-[#e6e6e6] placeholder:text-[#777777] focus:border-[#555555]"
                : "border-[#ded9d1] bg-[#fbfaf8] text-[#37352f] placeholder:text-[#9b968e] focus:border-[#b9b2a7]"
            }`}
            placeholder="新しいToDoを入力"
          />
          <button
            type="submit"
            className={`rounded-md border px-3 py-2 text-sm transition ${
              isDark
                ? "border-[#333333] bg-[#242424] text-[#d6d6d6] hover:bg-[#2d2d2d]"
                : "border-[#ded9d1] bg-[#f7f7f5] text-[#4f4b45] hover:bg-[#eee9e1]"
            }`}
          >
            追加
          </button>
        </form>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <div
            className={`grid grid-cols-3 rounded-md border p-1 text-xs ${
              isDark
                ? "border-[#303030] bg-[#1b1b1b]"
                : "border-[#ded9d1] bg-[#f7f7f5]"
            }`}
          >
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onSetFilter(option.value)}
                className={`rounded px-3 py-1.5 transition ${
                  filter === option.value
                    ? isDark
                      ? "bg-[#303030] text-[#f1f1f1]"
                      : "bg-white text-[#37352f] shadow-sm"
                    : isDark
                      ? "text-[#9b9b9b] hover:text-[#d6d6d6]"
                      : "text-[#78746d] hover:text-[#4f4b45]"
                }`}
                aria-pressed={filter === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>

          {completedTodoCount > 0 && (
            <button
              type="button"
              onClick={onClearCompletedTodos}
              className={`rounded-md px-3 py-2 text-xs transition ${
                isDark
                  ? "text-[#bdbdbd] hover:bg-[#2d2d2d]"
                  : "text-[#6f6a62] hover:bg-[#eee9e1]"
              }`}
            >
              完了したToDoを削除
            </button>
          )}
        </div>

        <div className="space-y-2">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`group flex items-start gap-3 rounded-md border px-3 py-3 transition ${
                  isDark
                    ? "border-[#303030] bg-[#1f1f1f] hover:bg-[#242424]"
                    : "border-[#e4e1dc] bg-[#fbfaf8] hover:bg-[#f2eee8]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onToggleTodo(todo.id)}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                    todo.completed
                      ? isDark
                        ? "border-[#666666] bg-[#3a3a3a] text-[#f1f1f1]"
                        : "border-[#b9b2a7] bg-white text-[#37352f]"
                      : isDark
                        ? "border-[#444444] text-transparent hover:border-[#666666]"
                        : "border-[#d6d0c8] text-transparent hover:border-[#b9b2a7]"
                  }`}
                  aria-pressed={todo.completed}
                  aria-label="完了状態を切り替え"
                >
                  <span aria-hidden="true" className="text-xs leading-none">
                    ✓
                  </span>
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={`break-words text-sm leading-6 ${
                      todo.completed
                        ? isDark
                          ? "text-[#8f8f8f] line-through"
                          : "text-[#8a857d] line-through"
                        : isDark
                          ? "text-[#ededed]"
                          : "text-[#37352f]"
                    }`}
                  >
                    {todo.title}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      isDark ? "text-[#777777]" : "text-[#9b968e]"
                    }`}
                  >
                    更新: {todo.updatedAt}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteTodo(todo.id)}
                  className={`h-7 w-7 rounded text-sm opacity-100 transition md:opacity-0 md:group-hover:opacity-100 ${
                    isDark
                      ? "text-[#9b9b9b] hover:bg-[#3a3a3a] hover:text-[#f1f1f1]"
                      : "text-[#8a857d] hover:bg-[#ddd8d0] hover:text-[#37352f]"
                  }`}
                  aria-label="ToDoを削除"
                  title="ToDoを削除"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <div
              className={`rounded-md border px-4 py-8 text-center text-sm ${
                isDark
                  ? "border-[#303030] bg-[#1f1f1f] text-[#9b9b9b]"
                  : "border-[#e4e1dc] bg-[#fbfaf8] text-[#78746d]"
              }`}
            >
              表示できるToDoがありません
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
