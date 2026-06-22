"use client";

import { useEffect, useMemo, useState } from "react";

import { getTodayText } from "@/lib/notes";
import {
  createTodoId,
  createTodoListId,
  initialTodoLists,
  initialTodos,
  parseSavedTodoData,
  TODO_STORAGE_KEY,
} from "@/lib/todos";
import type { Todo, TodoList } from "@/types/todo";

type TodoFilter = "all" | "active" | "completed";
const sampleTodoData = [
  { title: "週末の買い物", tags: ["生活", "買い物"], todos: [{ title: "牛乳と卵を買う", completed: false }, { title: "洗剤の残量を確認する", completed: true }, { title: "来週分のコーヒー豆を選ぶ", completed: false }] },
  { title: "部屋の片付け", tags: ["生活", "掃除"], todos: [{ title: "机の上を整理する", completed: true }, { title: "本棚をジャンル別に並べる", completed: false }, { title: "不要な書類をまとめる", completed: false }] },
  { title: "読みたい本", tags: ["読書", "趣味"], todos: [{ title: "積読から次の一冊を選ぶ", completed: false }, { title: "図書館の貸出期限を確認する", completed: false }] },
  { title: "旅行の準備", tags: ["旅行", "予定"], todos: [{ title: "宿泊先を確認する", completed: true }, { title: "持ち物リストを見直す", completed: false }, { title: "現地の天気を調べる", completed: false }] },
  { title: "朝の習慣", tags: ["習慣", "健康"], todos: [{ title: "コップ一杯の水を飲む", completed: true }, { title: "10分だけストレッチする", completed: false }, { title: "今日の予定を確認する", completed: false }] },
  { title: "料理してみたいもの", tags: ["料理", "趣味"], todos: [{ title: "スパイスカレーの材料を調べる", completed: false }, { title: "だし巻き卵を練習する", completed: false }] },
  { title: "今月やること", tags: ["予定", "重要"], isPinned: true, todos: [{ title: "定期契約を見直す", completed: false }, { title: "写真のバックアップを取る", completed: false }, { title: "歯科検診を予約する", completed: true }] },
  { title: "休日のアイデア", tags: ["休日", "アイデア"], todos: [{ title: "近所の喫茶店へ行く", completed: false }, { title: "気になっていた映画を見る", completed: false }, { title: "夕方に散歩する", completed: false }] },
  { title: "防災用品の確認", tags: ["生活", "重要"], todos: [{ title: "飲料水の期限を確認する", completed: true }, { title: "懐中電灯の電池を交換する", completed: false }, { title: "避難場所を家族と確認する", completed: false }] },
  { title: "小さな挑戦", tags: ["習慣", "アイデア"], todos: [{ title: "普段と違う道を歩く", completed: false }, { title: "新しい料理を一品作る", completed: false }, { title: "寝る前に今日の良かったことを書く", completed: true }] },
];

export function useTodos() {
  const [todoLists, setTodoLists] = useState<TodoList[]>(initialTodoLists);
  const [selectedTodoListId, setSelectedTodoListId] = useState(
    initialTodoLists[0].id,
  );
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTodoData = localStorage.getItem(TODO_STORAGE_KEY);

    if (savedTodoData) {
      const parsedTodoData = parseSavedTodoData(savedTodoData);

      if (parsedTodoData) {
        const firstActiveList = parsedTodoData.lists.find(
          (list) => !list.isArchived,
        );

        setTodoLists(parsedTodoData.lists);
        setTodos(parsedTodoData.todos);
        setSelectedTodoListId(
          firstActiveList?.id ?? parsedTodoData.lists[0].id,
        );
      } else {
        localStorage.removeItem(TODO_STORAGE_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem(
      TODO_STORAGE_KEY,
      JSON.stringify({ lists: todoLists, todos }),
    );
  }, [isLoaded, todoLists, todos]);

  const selectedTodoList =
    todoLists.find((list) => list.id === selectedTodoListId) ?? todoLists[0];

  const selectedTodos = useMemo(
    () => todos.filter((todo) => todo.listId === selectedTodoList.id),
    [selectedTodoList.id, todos],
  );

  const activeTodoCount = selectedTodos.filter((todo) => !todo.completed).length;
  const completedTodoCount = selectedTodos.length - activeTodoCount;

  const todoCountsByListId = useMemo(() => {
    return todoLists.reduce<Record<string, { active: number; total: number }>>(
      (counts, list) => {
        const listTodos = todos.filter((todo) => todo.listId === list.id);

        counts[list.id] = {
          active: listTodos.filter((todo) => !todo.completed).length,
          total: listTodos.length,
        };

        return counts;
      },
      {},
    );
  }, [todoLists, todos]);

  const filteredTodos = useMemo(() => {
    if (filter === "active") {
      return selectedTodos.filter((todo) => !todo.completed);
    }

    if (filter === "completed") {
      return selectedTodos.filter((todo) => todo.completed);
    }

    return selectedTodos;
  }, [filter, selectedTodos]);

  function createTodoList() {
    const today = getTodayText();
    const newTodoList: TodoList = {
      id: createTodoListId(),
      title: "新しいリスト",
      isArchived: false,
      isPinned: false,
      tags: [],
      createdAt: today,
      updatedAt: today,
    };

    setTodoLists((currentLists) => [newTodoList, ...currentLists]);
    setSelectedTodoListId(newTodoList.id);
    setFilter("all");
  }

  function selectTodoList(todoListId: string) {
    setSelectedTodoListId(todoListId);
    setFilter("all");
  }

  function updateSelectedTodoListTitle(title: string) {
    const nextTitle = title.trimStart();

    setTodoLists((currentLists) =>
      currentLists.map((list) =>
        list.id === selectedTodoList.id
          ? {
              ...list,
              title: nextTitle,
              updatedAt: getTodayText(),
            }
          : list,
      ),
    );
  }

  function updateSelectedTodoListTags(tags: string[]) {
    const normalizedTags = Array.from(
      new Set(tags.map((tag) => tag.trim()).filter((tag) => tag !== "")),
    );

    setTodoLists((currentLists) =>
      currentLists.map((list) =>
        list.id === selectedTodoList.id
          ? {
              ...list,
              tags: normalizedTags,
              updatedAt: getTodayText(),
            }
          : list,
      ),
    );
  }
  function setTodoListsArchived(todoListIds: string[], isArchived: boolean) {
    if (todoListIds.length === 0) {
      return;
    }

    setTodoLists((currentLists) => {
      const nextLists = currentLists.map((list) =>
        todoListIds.includes(list.id)
          ? { ...list, isArchived, updatedAt: getTodayText() }
          : list,
      );

      if (todoListIds.includes(selectedTodoListId)) {
        const nextVisibleList = nextLists.find(
          (list) => list.isArchived !== isArchived,
        );

        setSelectedTodoListId(nextVisibleList?.id ?? nextLists[0].id);
        setFilter("all");
      }

      return nextLists;
    });
  }

  function toggleArchivedTodoList(todoListId: string) {
    const targetList = todoLists.find((list) => list.id === todoListId);

    if (!targetList) {
      return;
    }

    setTodoListsArchived([todoListId], !targetList.isArchived);
  }

  function togglePinnedTodoList(todoListId: string) {
    setTodoLists((currentLists) =>
      currentLists.map((list) =>
        list.id === todoListId
          ? {
              ...list,
              isPinned: !list.isPinned,
              updatedAt: getTodayText(),
            }
          : list,
      ),
    );
  }

  function createSampleTodoLists() {
    const today = getTodayText();
    const sampleLists = sampleTodoData.map((sample) => ({
      id: createTodoListId(),
      title: sample.title,
      isArchived: false,
      isPinned: sample.isPinned ?? false,
      tags: sample.tags,
      createdAt: today,
      updatedAt: today,
    }));
    const sampleTodos = sampleTodoData.flatMap((sample, listIndex) =>
      sample.todos.map((todo) => ({
        id: createTodoId(),
        listId: sampleLists[listIndex].id,
        title: todo.title,
        completed: todo.completed,
        createdAt: today,
        updatedAt: today,
      })),
    );

    setTodoLists((currentLists) => [...sampleLists, ...currentLists]);
    setTodos((currentTodos) => [...sampleTodos, ...currentTodos]);
    setSelectedTodoListId(sampleLists[0].id);
    setFilter("all");
  }
  function resetTodos() {
    setTodoLists(initialTodoLists);
    setTodos(initialTodos);
    setSelectedTodoListId(initialTodoLists[0].id);
    setFilter("all");
  }
  function deleteTodoLists(todoListIds: string[]) {
    if (
      todoListIds.length === 0 ||
      todoLists.length - todoListIds.length < 1
    ) {
      return;
    }

    const nextLists = todoLists.filter(
      (list) => !todoListIds.includes(list.id),
    );

    setTodoLists(nextLists);
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => !todoListIds.includes(todo.listId)),
    );

    if (todoListIds.includes(selectedTodoListId)) {
      const nextActiveList = nextLists.find((list) => !list.isArchived);
      setSelectedTodoListId(nextActiveList?.id ?? nextLists[0].id);
      setFilter("all");
    }
  }

  function deleteTodoList(todoListId: string) {
    deleteTodoLists([todoListId]);
  }

  function createTodo(title: string) {
    const nextTitle = title.trim();

    if (nextTitle === "") {
      return;
    }

    const today = getTodayText();
    const newTodo: Todo = {
      id: createTodoId(),
      listId: selectedTodoList.id,
      title: nextTitle,
      completed: false,
      createdAt: today,
      updatedAt: today,
    };

    setTodos((currentTodos) => [newTodo, ...currentTodos]);
    setTodoLists((currentLists) =>
      currentLists.map((list) =>
        list.id === selectedTodoList.id ? { ...list, updatedAt: today } : list,
      ),
    );
  }

  function toggleTodo(todoId: string) {
    const today = getTodayText();

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId
          ? { ...todo, completed: !todo.completed, updatedAt: today }
          : todo,
      ),
    );
    setTodoLists((currentLists) =>
      currentLists.map((list) =>
        list.id === selectedTodoList.id ? { ...list, updatedAt: today } : list,
      ),
    );
  }

  function setSelectedTodosCompleted(completed: boolean) {
    const today = getTodayText();

    // 選択中のリストに属するToDoだけを、一括で同じ完了状態にします。
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.listId === selectedTodoList.id
          ? { ...todo, completed, updatedAt: today }
          : todo,
      ),
    );
    setTodoLists((currentLists) =>
      currentLists.map((list) =>
        list.id === selectedTodoList.id ? { ...list, updatedAt: today } : list,
      ),
    );
  }
  function deleteTodos(todoIds: string[]) {
    const targetIds = new Set(todoIds);
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => !targetIds.has(todo.id)),
    );
  }

  function deleteTodo(todoId: string) {
    deleteTodos([todoId]);
  }

  function clearCompletedTodos() {
    setTodos((currentTodos) =>
      currentTodos.filter(
        (todo) => todo.listId !== selectedTodoList.id || !todo.completed,
      ),
    );
  }

  return {
    activeTodoCount,
    completedTodoCount,
    filter,
    filteredTodos,
    selectedTodoList,
    selectedTodoListId,
    todoCountsByListId,
    todoLists,
    todos,
    clearCompletedTodos,
    createTodo,
    createTodoList,
    createSampleTodoLists,
    deleteTodo,
    deleteTodos,
    deleteTodoList,
    deleteTodoLists,
    resetTodos,
    selectTodoList,
    setFilter,
    setTodoListsArchived,
    setSelectedTodosCompleted,
    toggleArchivedTodoList,
    togglePinnedTodoList,
    toggleTodo,
    updateSelectedTodoListTags,
    updateSelectedTodoListTitle,
  };
}