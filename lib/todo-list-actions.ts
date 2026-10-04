import type { Todo, TodoList } from "@/types/todo";

export function archiveTodoLists(
  lists: TodoList[],
  ids: string[],
  archived: boolean,
  selectedId: string,
  today: string,
) {
  if (ids.length === 0) return { lists, selectedId };

  const targets = new Set(ids);
  const nextLists = lists.map((list) =>
    targets.has(list.id)
      ? { ...list, isArchived: archived, updatedAt: today }
      : list,
  );
  const nextSelectedId = targets.has(selectedId)
    ? nextLists.find((list) => list.isArchived !== archived)?.id ?? nextLists[0].id
    : selectedId;

  return { lists: nextLists, selectedId: nextSelectedId };
}

export function toggleTodoListPinned(lists: TodoList[], id: string, today: string) {
  return lists.map((list) =>
    list.id === id
      ? { ...list, isPinned: !list.isPinned, updatedAt: today }
      : list,
  );
}

export function removeTodosInLists(todos: Todo[], ids: string[]) {
  const targets = new Set(ids);
  return todos.filter((todo) => !targets.has(todo.listId));
}

export function removeTodoLists(
  lists: TodoList[],
  ids: string[],
  selectedId: string,
) {
  if (ids.length === 0) return null;

  const targets = new Set(ids);
  const nextLists = lists.filter((list) => !targets.has(list.id));
  if (nextLists.length === lists.length || nextLists.length === 0) return null;

  const nextSelectedId = targets.has(selectedId)
    ? nextLists.find((list) => !list.isArchived)?.id ?? nextLists[0].id
    : selectedId;

  return {
    lists: nextLists,
    selectedId: nextSelectedId,
  };
}
