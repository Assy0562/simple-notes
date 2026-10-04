import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createStorageGuard } from '../lib/storage-guard.ts';

function setup(initial = 'original') {
  const values = new Map([['notes', initial]]);
  const storage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  let queue = Promise.resolve();
  const lock = action => {
    const result = queue.then(action);
    queue = result.catch(() => {});
    return result;
  };
  const problems = [];
  const tab = (key = 'notes') => createStorageGuard(key, storage, lock, p => problems.push(p));
  return { storage, values, problems, tab };
}

test('従来の全件保存では別タブの追加が消える（再現条件）', () => {
  const { storage } = setup('["existing"]');
  const stale = JSON.parse(storage.getItem('notes'));
  storage.setItem('notes', '["existing","added in A"]');
  stale[0] = 'edited in B';
  storage.setItem('notes', JSON.stringify(stale));
  assert.deepEqual(JSON.parse(storage.getItem('notes')), ['edited in B']);
});
test('別タブ更新後の保存を拒否し、新しい保存内容を守る', async () => {
  const { tab, storage, problems } = setup(); const a = tab(); const b = tab();
  a.read(); b.read();
  assert.equal(await a.save('A added'), true);
  assert.equal(await b.save('B stale'), false);
  assert.equal(storage.getItem('notes'), 'A added');
  assert.deepEqual(problems, ['conflict']);
});
test('イベントが届く前の同時保存でも一方だけが成功する', async () => {
  const { tab, storage } = setup(); const a = tab(); const b = tab(); a.read(); b.read();
  assert.deepEqual(await Promise.all([a.save('A'), b.save('B')]), [true, false]);
  assert.equal(storage.getItem('notes'), 'A');
});
test('自分の連続保存は古い順に処理し最後の編集を残す', async () => {
  const { tab, storage, problems } = setup(); const a = tab(); a.read();
  assert.deepEqual(await Promise.all([a.save('first'), a.save('last')]), [true, true]);
  a.check(); assert.equal(storage.getItem('notes'), 'last'); assert.deepEqual(problems, []);
});
test('外部更新を検出したら元の値に戻っても再読込まで保存を止める', async () => {
  const { tab, storage } = setup(); const a = tab(); a.read();
  storage.setItem('notes', 'external'); a.check(); storage.setItem('notes', 'original');
  assert.equal(await a.save('stale'), false);
});
test('別タブからの削除も競合として扱う', async () => {
  const { tab, values, storage } = setup(); const a = tab(); a.read(); values.delete('notes');
  assert.equal(await a.save('stale'), false); assert.equal(storage.getItem('notes'), null);
});
test('再読み込みしたタブでは最新内容から編集を再開できる', async () => {
  const { tab, storage } = setup(); const a = tab(); a.read(); storage.setItem('notes', 'latest'); a.check();
  const reloaded = tab(); assert.equal(reloaded.read(), 'latest');
  assert.equal(await reloaded.save('new edit'), true);
});
test('メモとToDoの保存は独立している', async () => {
  const { tab, storage } = setup(); const notes = tab(); const todos = tab('todos'); notes.read(); todos.read();
  storage.setItem('notes', 'external'); notes.check();
  assert.equal(await todos.save('todo edit'), true);
});
test('初回保存と同じ値の再保存が成功する', async () => {
  const { tab } = setup(null); const a = tab(); a.read();
  assert.equal(a.isBlocked(), false);
  assert.equal(await a.save('initial'), true); assert.equal(await a.save('initial'), true);
});
test('未読込の状態では保存しない', async () => {
  const { tab, storage } = setup(); assert.equal(await tab().save('bad'), false);
  assert.equal(storage.getItem('notes'), 'original');
});
test('容量超過やロック失敗を未処理の例外にしない', async () => {
  for (const failLock of [false, true]) {
    const problems = [];
    const guard = createStorageGuard('notes', {
      getItem: () => 'original', setItem: () => { throw new Error('quota'); },
    }, async action => { if (failLock) throw new Error('lock'); return action(); }, p => problems.push(p));
    guard.read(); assert.equal(await guard.save('new'), false); assert.deepEqual(problems, ['unavailable']);
  }
});
test('読込失敗時は初期データを保存しない', async () => {
  let writes = 0;
  const guard = createStorageGuard('notes', {
    getItem: () => { throw new Error('denied'); }, setItem: () => { writes++; },
  }, async action => action(), () => {});
  guard.read(); assert.equal(guard.isBlocked(), true);
  assert.equal(await guard.save('defaults'), false); assert.equal(writes, 0);
});
