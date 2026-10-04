import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getRestoredTodoListId } from '../lib/todos.ts';

const lists = [
  { id: 'first', isArchived: false },
  { id: 'second', isArchived: false },
  { id: 'archived', isArchived: true },
];

test('最後に選んだ利用可能なリストを復元する', () => {
  assert.equal(getRestoredTodoListId(lists, 'second'), 'second');
});

test('削除済みのリストなら最初の利用可能なリストへ戻る', () => {
  assert.equal(getRestoredTodoListId(lists, 'missing'), 'first');
});

test('アーカイブ済みのリストなら利用可能なリストへ戻る', () => {
  assert.equal(getRestoredTodoListId(lists, 'archived'), 'first');
});

test('利用可能なリストがない場合でも既存のリストを選ぶ', () => {
  assert.equal(getRestoredTodoListId([{ id: 'only', isArchived: true }], null), 'only');
});
