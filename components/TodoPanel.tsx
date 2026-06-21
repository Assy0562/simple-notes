"use client";

import { useEffect, useState } from "react";

import type { Todo, TodoList } from "@/types/todo";

type TodoFilter = "all" | "active" | "completed";

type TodoPanelProps = {
  activeTodoCount: number;
  allTags: string[];
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
  onUpdateTodoListTags: (tags: string[]) => void;
  onUpdateTodoListTitle: (title: string) => void;
};

const filterOptions: Array<{ label: string; value: TodoFilter }> = [
  { label: "すべて", value: "all" },
  { label: "未完了", value: "active" },
  { label: "完了", value: "completed" },
];

export function TodoPanel({
  activeTodoCount,
  allTags,
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
  onUpdateTodoListTags,
  onUpdateTodoListTitle,
}: TodoPanelProps) {
  const [todoDraft, setTodoDraft] = useState("");
  const [tagDraft, setTagDraft] = useState("");

  useEffect(() => {
    setTagDraft("");
  }, [todoList.id]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCreateTodo(todoDraft);
    setTodoDraft("");
  }

  function addTag() {
    const nextTag = tagDraft.trim();

    if (nextTag === "" || todoList.tags.includes(nextTag)) {
      setTagDraft("");
      return;
    }

    onUpdateTodoListTags([...todoList.tags, nextTag]);
    setTagDraft("");
  }

  function addExistingTag(tag: string) {
    if (!todoList.tags.includes(tag)) {
      onUpdateTodoListTags([...todoList.tags, tag]);
    }

    setTagDraft("");
  }

  function removeTag(tagToRemove: string) {
    onUpdateTodoListTags(
      todoList.tags.filter((tag) => tag !== tagToRemove),
    );
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

        <div
          className={`mb-5 border-b pb-4 ${
            isDark ? "border-[#2f2f2f]" : "border-[#e4e1dc]"
          }`}
        >
          <TodoTagInput
            allTags={allTags}
            isDark={isDark}
            tags={todoList.tags}
            tagDraft={tagDraft}
            onAddExistingTag={addExistingTag}
            onAddTag={addTag}
            onChangeTagDraft={setTagDraft}
            onRemoveTag={removeTag}
          />
        </div>

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
              <TodoRow
                key={todo.id}
                isDark={isDark}
                todo={todo}
                onDelete={() => onDeleteTodo(todo.id)}
                onToggle={() => onToggleTodo(todo.id)}
              />
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

function TodoRow({ isDark, todo, onDelete, onToggle }: { isDark: boolean; todo: Todo; onDelete: () => void; onToggle: () => void }) {
  return (
    <div
      className={`group flex items-start gap-3 rounded-md border px-3 py-3 transition ${
        isDark
          ? "border-[#303030] bg-[#1f1f1f] hover:bg-[#242424]"
          : "border-[#e4e1dc] bg-[#fbfaf8] hover:bg-[#f2eee8]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
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
        ✓
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
        <p className={`mt-1 text-xs ${isDark ? "text-[#777777]" : "text-[#9b968e]"}`}>
          更新: {todo.updatedAt}
        </p>
      </div>
      <button
        type="button"
        onClick={onDelete}
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
  );
}

type TodoTagInputProps = {
  allTags: string[];
  isDark: boolean;
  tags: string[];
  tagDraft: string;
  onAddExistingTag: (tag: string) => void;
  onAddTag: () => void;
  onChangeTagDraft: (value: string) => void;
  onRemoveTag: (tag: string) => void;
};

function TodoTagInput({
  allTags,
  isDark,
  tags,
  tagDraft,
  onAddExistingTag,
  onAddTag,
  onChangeTagDraft,
  onRemoveTag,
}: TodoTagInputProps) {
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const normalizedTagDraft = tagDraft.trim().toLowerCase();
  const availableTags = allTags.filter((tag) => !tags.includes(tag));
  const shownTags = (
    normalizedTagDraft === ""
      ? availableTags
      : availableTags.filter((tag) =>
          tag.toLowerCase().includes(normalizedTagDraft),
        )
  ).slice(0, 5);
  const shouldShowTagMenu =
    shownTags.length > 0 && (isTagMenuOpen || normalizedTagDraft !== "");

  return (
    <div className="relative">
      <div
        className={`flex min-h-11 flex-wrap items-center gap-2 rounded-md border px-3 py-2 transition ${
          isDark
            ? "border-[#303030] bg-[#1f1f1f] focus-within:border-[#555555]"
            : "border-[#ded9d1] bg-[#fbfaf8] focus-within:border-[#b9b2a7]"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsTagMenuOpen((isOpen) => !isOpen)}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded transition ${
            isDark
              ? "text-[#8f8f8f] hover:bg-[#303030] hover:text-[#d6d6d6]"
              : "text-[#8a857d] hover:bg-[#eee9e1] hover:text-[#5f5a52]"
          }`}
          aria-label="タグ一覧を表示"
          aria-expanded={isTagMenuOpen}
        >
          <TagIcon />
        </button>

        {tags.map((tag) => (
          <span
            key={tag}
            className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${
              isDark
                ? "border-[#3a3a3a] bg-[#282828] text-[#d6d6d6]"
                : "border-[#e1ddd5] bg-[#f4f1eb] text-[#5f5a52]"
            }`}
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className={`rounded-full px-1 transition ${isDark ? "text-[#a8a8a8] hover:bg-[#3a3a3a] hover:text-[#f1f1f1]" : "text-[#8a857d] hover:bg-[#e4ded5] hover:text-[#37352f]"}`}
              aria-label={`${tag}を削除`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          value={tagDraft}
          onChange={(event) => {
            onChangeTagDraft(event.target.value);
            setIsTagMenuOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAddTag();
            }
          }}
          className={`min-w-32 flex-1 bg-transparent text-sm outline-none ${
            isDark
              ? "text-[#e6e6e6] placeholder:text-[#666666]"
              : "text-[#37352f] placeholder:text-[#9b968e]"
          }`}
          placeholder="+ タグを追加"
          aria-label="タグ名を入力してEnterで追加"
        />
      </div>

      {shouldShowTagMenu && (
        <div
          className={`absolute left-0 top-full z-20 mt-2 w-64 rounded-md border p-1 shadow-lg ${
            isDark
              ? "border-[#333333] bg-[#252525]"
              : "border-[#e4e1dc] bg-[#fbfaf8]"
          }`}
        >
          {shownTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onAddExistingTag(tag);
                setIsTagMenuOpen(false);
              }}
              className={`block w-full rounded px-3 py-2 text-left text-sm transition ${
                isDark
                  ? "text-[#e6e6e6] hover:bg-[#303030]"
                  : "text-[#4f4b45] hover:bg-[#eeeae4]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TagIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7.17a2.5 2.5 0 0 1 1.77.73l7.33 7.33a2.5 2.5 0 0 1 0 3.54l-6.17 6.17a2.5 2.5 0 0 1-3.54 0L3.73 13.44A2.5 2.5 0 0 1 3 11.67V4.5Zm6 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
  );
}