import assert from 'node:assert/strict';
import { test } from 'node:test';
import { archiveTodoLists, removeTodoLists, removeTodosInLists, toggleTodoListPinned } from '../lib/todo-list-actions.ts';

const list = (id, overrides = {}) => ({
  id, title: id, isArchived: false, isPinned: false, tags: [],
  createdAt: '2026/01/01', updatedAt: '2026/01/01', ...overrides,
});
const todo = (id, listId) => ({
  id, listId, title: id, completed: false,
  createdAt: '2026/01/01', updatedAt: '2026/01/01',
});

test('指定リストだけをアーカイブし、選択先を利用可能なリストへ移す', () => {
  const lists = [list('a'), list('b'), list('c')];
  const result = archiveTodoLists(lists, ['a', 'b'], true, 'b', '2026/10/04');
  assert.deepEqual(result.lists.map((item) => item.isArchived), [true, true, false]);
  assert.equal(result.lists[1].updatedAt, '2026/10/04');
  assert.equal(result.selectedId, 'c');
  assert.strictEqual(result.lists[2], lists[2]);
  assert.equal(lists[1].isArchived, false);
});

test('選択中でないリストをアーカイブしても選択先を変えない', () => {
  const result = archiveTodoLists([list('a'), list('b')], ['b'], true, 'a', '2026/10/04');
  assert.equal(result.selectedId, 'a');
});

test('アーカイブを解除したリストを再び選べる状態にする', () => {
  const result = archiveTodoLists([list('a'), list('b', { isArchived: true })], ['b'], false, 'a', '2026/10/04');
  assert.equal(result.lists[1].isArchived, false);
  assert.equal(result.selectedId, 'a');
});

test('ピン留めは対象だけを切り替え、もう一度で元に戻る', () => {
  const lists = [list('a'), list('b')];
  const pinned = toggleTodoListPinned(lists, 'a', '2026/10/04');
  assert.equal(pinned[0].isPinned, true);
  assert.equal(pinned[0].updatedAt, '2026/10/04');
  assert.strictEqual(pinned[1], lists[1]);
  assert.equal(lists[0].isPinned, false);
  assert.equal(toggleTodoListPinned(pinned, 'a', '2026/10/05')[0].isPinned, false);
});

test('複数リスト削除では配下のタスクだけを消し、選択先を切り替える', () => {
  const lists = [list('a'), list('b'), list('c')];
  const todos = [todo('one', 'a'), todo('two', 'b'), todo('three', 'c')];
  const result = removeTodoLists(lists, ['a', 'b'], 'b');
  assert.deepEqual(result.lists.map((item) => item.id), ['c']);
  assert.deepEqual(removeTodosInLists(todos, ['a', 'b']).map((item) => item.id), ['three']);
  assert.equal(result.selectedId, 'c');
  assert.equal(lists.length, 3);
  assert.equal(todos.length, 3);
});

test('削除対象以外を選択中なら選択先と無関係なデータを保持する', () => {
  const lists = [list('a'), list('b')];
  const todos = [todo('one', 'a'), todo('two', 'b')];
  const result = removeTodoLists(lists, ['b'], 'a');
  assert.equal(result.selectedId, 'a');
  assert.strictEqual(result.lists[0], lists[0]);
  assert.strictEqual(removeTodosInLists(todos, ['b'])[0], todos[0]);
});

test('最後の1リストは削除しない', () => {
  assert.equal(removeTodoLists([list('a')], ['a'], 'a'), null);
});

test('重複・存在しないIDを含んでも実際の削除件数で判定する', () => {
  const lists = [list('a'), list('b')];
  const result = removeTodoLists(lists, ['a', 'a', 'missing'], 'a');
  assert.deepEqual(result.lists.map((item) => item.id), ['b']);
  assert.equal(removeTodoLists(lists, ['missing'], 'a'), null);
});

test('選択中のリストを削除したら利用可能なリストを優先する', () => {
  const result = removeTodoLists(
    [list('a', { isArchived: true }), list('b'), list('c')], ['c'], 'c',
  );
  assert.equal(result.selectedId, 'b');
});
