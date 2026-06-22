"use client";

import type { Todo, TodoList } from "@/types/todo";

type TodoDeleteConfirmModalProps = {
  affectedTaskCount: number;
  isDark: boolean;
  todoLists: TodoList[];
  todos: Todo[];
  onCancel: () => void;
  onConfirm: () => void;
};

export function TodoDeleteConfirmModal({ affectedTaskCount, isDark, todoLists, todos, onCancel, onConfirm }: TodoDeleteConfirmModalProps) {
  if (todoLists.length === 0 && todos.length === 0) {
    return null;
  }

  const deletesLists = todoLists.length > 0;
  const isSingle = deletesLists ? todoLists.length === 1 : todos.length === 1;
  const targetTitle = deletesLists
    ? todoLists[0]?.title || "無題のリスト"
    : todos[0]?.title || "無題のToDo";
  const title = deletesLists ? "ToDoリストを削除しますか？" : "ToDoを削除しますか？";
  const description = deletesLists
    ? isSingle
      ? `「${targetTitle}」と、その中のToDo ${affectedTaskCount}件を削除します。この操作は元に戻せません。`
      : `${todoLists.length}件のToDoリストと、その中のToDo ${affectedTaskCount}件を削除します。この操作は元に戻せません。`
    : isSingle
      ? `「${targetTitle}」を削除します。この操作は元に戻せません。`
      : `${todos.length}件のToDoを削除します。この操作は元に戻せません。`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className={`w-full max-w-sm rounded-lg border p-5 shadow-xl ${isDark ? "border-[#333333] bg-[#252525] text-[#ededed]" : "border-[#e4e1dc] bg-[#fbfaf8] text-[#2f2f2f]"}`}>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className={`mt-2 text-sm leading-6 ${isDark ? "text-[#bdbdbd]" : "text-[#6f6a62]"}`}>{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className={`rounded-md border px-3 py-2 text-sm transition ${isDark ? "border-[#3a3a3a] text-[#d6d6d6] hover:bg-[#303030]" : "border-[#ded9d1] text-[#5f5a52] hover:bg-[#eee9e1]"}`}>キャンセル</button>
          <button type="button" onClick={onConfirm} className={`rounded-md border px-3 py-2 text-sm transition ${isDark ? "border-[#5a2f2f] bg-[#3a2525] text-[#f0c9c9] hover:bg-[#4a2c2c]" : "border-[#e2c1b8] bg-[#fff2ef] text-[#9a3f2f] hover:bg-[#ffe8e1]"}`}>削除する</button>
        </div>
      </div>
    </div>
  );
}