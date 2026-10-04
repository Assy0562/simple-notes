import type { Todo } from "@/types/todo";

export function createTodoItem(
  title: string,
  listId: string,
  createId: () => string,
  today: string,
): Todo | null {
  const nextTitle = title.trim();
  if (nextTitle === "") return null;

  return {
    id: createId(),
    listId,
    title: nextTitle,
    completed: false,
    createdAt: today,
    updatedAt: today,
  };
}

export function toggleTodoCompletion(
  todos: Todo[],
  todoId: string,
  today: string,
): Todo[] {
  return todos.map((todo) =>
    todo.id === todoId
      ? { ...todo, completed: !todo.completed, updatedAt: today }
      : todo,
  );
}

export function removeTodos(todos: Todo[], todoIds: string[]): Todo[] {
  const targetIds = new Set(todoIds);
  return todos.filter((todo) => !targetIds.has(todo.id));
}
