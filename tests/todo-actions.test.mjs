import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createTodoItem, removeTodos, toggleTodoCompletion } from '../lib/todo-actions.ts';

const todo = (id, overrides = {}) => ({
  id, listId: 'list-a', title: id, completed: false,
  createdAt: '2026/01/01', updatedAt: '2026/01/01', ...overrides,
});

test('追加時に前後の空白を除き、選択中のリストに未完了タスクを作る', () => {
  const result = createTodoItem('  買い物  ', 'list-b', () => 'new-id', '2026/10/04');
  assert.deepEqual(result, {
    id: 'new-id', listId: 'list-b', title: '買い物', completed: false,
    createdAt: '2026/10/04', updatedAt: '2026/10/04',
  });
});

test('空白だけのタスクは追加せず、IDも発行しない', () => {
  assert.equal(createTodoItem(' \t ', 'list-a', () => {
    throw new Error('ID must not be created');
  }, '2026/10/04'), null);
});

test('完了切り替えは対象だけを更新し、もう一度切り替えると未完了に戻る', () => {
  const original = [todo('a'), todo('b', { listId: 'list-b' })];
  const completed = toggleTodoCompletion(original, 'a', '2026/10/04');
  assert.equal(completed[0].completed, true);
  assert.equal(completed[0].updatedAt, '2026/10/04');
  assert.strictEqual(completed[1], original[1]);
  assert.equal(original[0].completed, false);
  assert.equal(toggleTodoCompletion(completed, 'a', '2026/10/05')[0].completed, false);
});

test('存在しないIDの完了切り替えではタスクを変更しない', () => {
  const original = [todo('a')];
  assert.deepEqual(toggleTodoCompletion(original, 'missing', '2026/10/04'), original);
});

test('削除は指定したタスクだけに作用し、別リストのタスクを残す', () => {
  const original = [todo('a'), todo('b', { listId: 'list-b' }), todo('c')];
  assert.deepEqual(removeTodos(original, ['a', 'c']).map((item) => item.id), ['b']);
  assert.equal(original.length, 3);
});

test('削除IDが空または存在しない場合はタスクを保持する', () => {
  const original = [todo('a')];
  assert.deepEqual(removeTodos(original, []), original);
  assert.deepEqual(removeTodos(original, ['missing']), original);
});
