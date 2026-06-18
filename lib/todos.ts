import type { Todo, TodoList } from "@/types/todo";

export const TODO_STORAGE_KEY = "simple-notes-todos-ja-v1";
export const DEFAULT_TODO_LIST_ID = "todo-list-default";

export type SavedTodoData = {
  lists: TodoList[];
  todos: Todo[];
};

export const initialTodoLists: TodoList[] = [
  {
    id: DEFAULT_TODO_LIST_ID,
    title: "今日のToDo",
    createdAt: "2026/06/18",
    updatedAt: "2026/06/18",
  },
  {
    id: "todo-list-learning",
    title: "学習メモ用",
    createdAt: "2026/06/18",
    updatedAt: "2026/06/18",
  },
];

export const initialTodos: Todo[] = [
  {
    id: "todo-initial-1",
    listId: DEFAULT_TODO_LIST_ID,
    title: "メモとToDoを切り替えて使ってみる",
    completed: false,
    createdAt: "2026/06/18",
    updatedAt: "2026/06/18",
  },
  {
    id: "todo-initial-2",
    listId: DEFAULT_TODO_LIST_ID,
    title: "完了したToDoにチェックを入れる",
    completed: false,
    createdAt: "2026/06/18",
    updatedAt: "2026/06/18",
  },
  {
    id: "todo-initial-3",
    listId: "todo-list-learning",
    title: "ToDoリストをメモ一覧のように切り替える",
    completed: false,
    createdAt: "2026/06/18",
    updatedAt: "2026/06/18",
  },
];

export function createTodoId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return String(Date.now());
}

export function createTodoListId() {
  return `todo-list-${createTodoId()}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeTodoList(value: unknown): TodoList | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    (typeof value.id !== "string" && typeof value.id !== "number") ||
    typeof value.title !== "string" ||
    typeof value.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    id: String(value.id),
    title: value.title.trim() || "無題のリスト",
    createdAt:
      typeof value.createdAt === "string" ? value.createdAt : value.updatedAt,
    updatedAt: value.updatedAt,
  };
}

function normalizeTodo(value: unknown, fallbackListId: string): Todo | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    (typeof value.id !== "string" && typeof value.id !== "number") ||
    typeof value.title !== "string" ||
    typeof value.completed !== "boolean" ||
    typeof value.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    id: String(value.id),
    listId: typeof value.listId === "string" ? value.listId : fallbackListId,
    title: value.title,
    completed: value.completed,
    createdAt:
      typeof value.createdAt === "string" ? value.createdAt : value.updatedAt,
    updatedAt: value.updatedAt,
  };
}

export function parseSavedTodoData(value: string): SavedTodoData | null {
  try {
    const parsedValue = JSON.parse(value) as unknown;

    // 以前の保存形式は Todo[] だけだったので、読み込めるようにしておきます。
    if (Array.isArray(parsedValue)) {
      const todos = parsedValue
        .map((item) => normalizeTodo(item, DEFAULT_TODO_LIST_ID))
        .filter((todo): todo is Todo => todo !== null);

      return todos.length > 0
        ? { lists: initialTodoLists.slice(0, 1), todos }
        : null;
    }

    if (!isRecord(parsedValue)) {
      return null;
    }

    const listsSource = Array.isArray(parsedValue.lists)
      ? parsedValue.lists
      : [];
    const todosSource = Array.isArray(parsedValue.todos)
      ? parsedValue.todos
      : [];

    const lists = listsSource
      .map((item) => normalizeTodoList(item))
      .filter((list): list is TodoList => list !== null);

    if (lists.length === 0) {
      return null;
    }

    const listIds = new Set(lists.map((list) => list.id));
    const fallbackListId = lists[0].id;
    const todos = todosSource
      .map((item) => normalizeTodo(item, fallbackListId))
      .filter((todo): todo is Todo => todo !== null)
      .filter((todo) => listIds.has(todo.listId));

    return { lists, todos };
  } catch {
    return null;
  }
}