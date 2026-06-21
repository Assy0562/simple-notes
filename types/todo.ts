export type TodoList = {
  id: string;
  title: string;
  isArchived: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type Todo = {
  id: string;
  listId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};