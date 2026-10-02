import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseSavedNotes } from '../lib/notes.ts';
import { parseSavedTodoData, DEFAULT_TODO_LIST_ID } from '../lib/todos.ts';
import { createStorageGuard } from '../lib/storage-guard.ts';

const note = { id: 1, title: '保持するメモ', content: '本文', updatedAt: '2026/10/02' };
const list = { id: 'list', title: '用事', updatedAt: '2026/10/02' };
const todo = { id: 1, title: '保持するタスク', completed: false, updatedAt: '2026/10/02' };
const current = { lists: [list], todos: [{ ...todo, listId: 'list' }] };

for (const [name, parse, raw] of [
  ['メモの壊れたJSON', parseSavedNotes, '{broken'],
  ['メモの空文字', parseSavedNotes, ''],
  ['メモの別形式', parseSavedNotes, '{}'],
  ['メモの空配列', parseSavedNotes, '[]'],
  ['一部だけ不正なメモ', parseSavedNotes, JSON.stringify([note, { title: '残したい' }])],
  ['不正なタグ', parseSavedNotes, JSON.stringify([{ ...note, tags: ['有効', 12] }])],
  ['不正なフラグ', parseSavedNotes, JSON.stringify([{ ...note, isPinned: 'yes' }])],
  ['重複したメモID', parseSavedNotes, JSON.stringify([note, { ...note, id: '1' }])],
  ['ToDoの壊れたJSON', parseSavedTodoData, '{broken'],
  ['ToDoの空文字', parseSavedTodoData, ''],
  ['ToDo配列の欠落', parseSavedTodoData, JSON.stringify({ lists: [list] })],
  ['ToDo配列の型不正', parseSavedTodoData, JSON.stringify({ lists: [list], todos: 'data' })],
  ['一部だけ不正なリスト', parseSavedTodoData, JSON.stringify({ lists: [list, { title: '残したい' }], todos: [] })],
  ['一部だけ不正なタスク', parseSavedTodoData, JSON.stringify({ ...current, todos: [...current.todos, { title: '残したい' }] })],
  ['所属不明のタスク', parseSavedTodoData, JSON.stringify({ ...current, todos: [{ ...todo, listId: 'missing' }] })],
  ['旧形式の不正タスク', parseSavedTodoData, JSON.stringify([todo, { title: '残したい' }])],
  ['リストの不正タグ', parseSavedTodoData, JSON.stringify({ ...current, lists: [{ ...list, tags: [1] }] })],
  ['重複したタスクID', parseSavedTodoData, JSON.stringify({ ...current, todos: [current.todos[0], current.todos[0]] })],
]) {
  test(`${name}：読み込み失敗後も元の文字列をそのまま残す`, async () => {
    let stored = raw; let writes = 0; const problems = [];
    const guard = createStorageGuard('data', {
      getItem: () => stored,
      setItem: (_key, value) => { writes++; stored = value; },
    }, async action => action(), problem => problems.push(problem));
    const loaded = guard.read();
    assert.equal(parse(loaded), null);
    guard.rejectRead();
    assert.equal(await guard.save('initial samples'), false);
    assert.equal(await guard.save('later edit'), false);
    assert.equal(stored, raw); assert.equal(writes, 0);
    assert.deepEqual(problems, ['unreadable']);
  });
}
test('旧形式のメモは欠落項目を補完して読み込める', () => {
  const result = parseSavedNotes(JSON.stringify([note]));
  assert.equal(result[0].id, '1'); assert.equal(result[0].content, '本文');
  assert.equal(result[0].createdAt, note.updatedAt); assert.deepEqual(result[0].tags, []);
});
test('現行形式のメモは内容を維持して読み込める', () => {
  const saved = { ...note, id: '1', tags: ['仕事'], createdAt: '2026/09/30', isPinned: true, isArchived: false };
  assert.deepEqual(parseSavedNotes(JSON.stringify([saved])), [saved]);
});
test('現行形式のToDoはタスクと所属を維持する', () => {
  const result = parseSavedTodoData(JSON.stringify(current));
  assert.equal(result.todos[0].title, todo.title); assert.equal(result.todos[0].listId, 'list');
});
test('旧形式のToDoは既定リストへ移行する', () => {
  assert.equal(parseSavedTodoData(JSON.stringify([todo])).todos[0].listId, DEFAULT_TODO_LIST_ID);
});
test('旧形式でタスク0件なら初期タスクを復活させない', () => {
  const result = parseSavedTodoData('[]');
  assert.equal(result.lists.length, 1); assert.deepEqual(result.todos, []);
});
test('現行形式の空のタスクリストも有効', () => {
  assert.deepEqual(parseSavedTodoData(JSON.stringify({ lists: [list], todos: [] })).todos, []);
});
test('読込拒否は既にロック待ちの保存も止める', async () => {
  let action; let writes = 0;
  const guard = createStorageGuard('data', { getItem: () => 'bad', setItem: () => { writes++; } },
    fn => new Promise(resolve => { action = () => resolve(fn()); }), () => {});
  guard.read(); const pending = guard.save('defaults'); guard.rejectRead(); action();
  assert.equal(await pending, false); assert.equal(writes, 0);
});
