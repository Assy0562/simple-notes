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
        setTodoLists(parsedTodoData.lists);
        setTodos(parsedTodoData.todos);
        setSelectedTodoListId(parsedTodoData.lists[0].id);
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

  function deleteTodoList(todoListId: string) {
    if (todoLists.length <= 1) {
      return;
    }

    const nextLists = todoLists.filter((list) => list.id !== todoListId);

    setTodoLists(nextLists);
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.listId !== todoListId),
    );

    if (selectedTodoListId === todoListId) {
      setSelectedTodoListId(nextLists[0].id);
      setFilter("all");
    }
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

  function deleteTodo(todoId: string) {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== todoId),
    );
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
    deleteTodo,
    deleteTodoList,
    selectTodoList,
    setFilter,
    toggleTodo,
    updateSelectedTodoListTitle,
  };
}
