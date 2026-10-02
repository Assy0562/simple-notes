import assert from 'node:assert/strict';
import { test } from 'node:test';
import { selectNotes } from '../lib/note-list.ts';

const note = (id, overrides = {}) => ({
  id, title: '', content: '', tags: [],
  createdAt: '2026/01/01', updatedAt: '2026/01/01',
  isPinned: false, isArchived: false, ...overrides,
});
const ids = (notes, search = '', tags = [], sort = 'updated-desc', archived = false) =>
  selectNotes(notes, search, tags, sort, archived).map(n => n.id);

for (const [field, value] of [['title', 'React入門'], ['content', '<p>Reactの学習</p>'], ['tags', ['React']]]) {
  test(`${field}を大文字小文字と検索語の前後空白を無視して検索する`, () => {
    assert.deepEqual(ids([note('match', { [field]: value }), note('other')], '  rEaCt  '), ['match']);
  });
}
test('空白だけの検索は全件、該当なしと空配列は0件になる', () => {
  const notes = [note('a'), note('b')];
  assert.deepEqual(ids(notes, ' \t '), ['a', 'b']);
  assert.deepEqual(ids(notes, '見つからない'), []);
  assert.deepEqual(ids([]), []);
});
test('選択したすべてのタグと検索語を同時に満たすメモだけを返す', () => {
  const notes = [
    note('both', { title: '学習', tags: ['React', '仕事'] }),
    note('one', { title: '学習', tags: ['React'] }),
    note('wrong-text', { title: '買い物', tags: ['React', '仕事'] }),
  ];
  assert.deepEqual(ids(notes, '学習', ['React', '仕事']), ['both']);
  assert.deepEqual(ids(notes, '', ['react']), []);
});
test('通常表示とアーカイブ表示を分ける', () => {
  const notes = [note('active'), note('archived', { isArchived: true, isPinned: true })];
  assert.deepEqual(ids(notes), ['active']);
  assert.deepEqual(ids(notes, '', [], 'updated-desc', true), ['archived']);
});
const sortable = [
  note('a', { title: 'あ', createdAt: '2026/01/03', updatedAt: '2026/01/02' }),
  note('c', { title: 'う', createdAt: '2026/01/02', updatedAt: '2026/01/03' }),
  note('b', { title: 'い', createdAt: '2026/01/01', updatedAt: '2026/01/01' }),
];
for (const [mode, expected] of [
  ['updated-desc', ['c', 'a', 'b']],
  ['created-desc', ['a', 'c', 'b']],
  ['title-asc', ['a', 'b', 'c']],
]) {
  test(`${mode}: 指定した順序で並ぶ`, () => {
    assert.deepEqual(ids(sortable, '', [], mode), expected);
  });
  test(`${mode}: ピン留めが先頭で、ピン留め同士も指定順になる`, () => {
    const pinned = sortable.map(n => ({ ...n, id: 'pin-' + n.id, isPinned: true }));
    assert.deepEqual(ids([...sortable, ...pinned], '', [], mode), [...expected.map(id => 'pin-' + id), ...expected]);
  });
}
test('空タイトルは「無題のメモ」と同じ並び順になる', () => {
  const notes = [note('empty'), note('named', { title: '無題のメモ' }), note('first', { title: 'あ' })];
  assert.deepEqual(ids(notes, '', [], 'title-asc'), ['first', 'empty', 'named']);
});
test('同じ並び替え値のメモは元の順序を保つ', () => {
  assert.deepEqual(ids([note('second'), note('first')]), ['second', 'first']);
});
test('検索・並び替えで入力配列やメモ、タグを書き換えない', () => {
  const input = structuredClone(sortable);
  const before = structuredClone(input);
  for (const n of input) { Object.freeze(n.tags); Object.freeze(n); }
  Object.freeze(input);
  const result = selectNotes(input, '', [], 'title-asc', false);
  assert.deepEqual(result.map(n => n.id), ['a', 'b', 'c']);
  assert.notEqual(result, input);
  assert.deepEqual(input, before);
});
