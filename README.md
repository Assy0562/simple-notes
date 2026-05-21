# Simple Notes

シンプルに書いて、タグで整理できるメモ帳アプリです。

公開URL: https://simple-notes-drab.vercel.app/

## 概要

Simple Notes は、Next.js、TypeScript、Tailwind CSS を使って作成したブラウザ用のメモ帳アプリです。

メモの作成、編集、検索、タグ付け、削除ができます。保存にはブラウザの `localStorage` を使用しているため、バックエンドやデータベースは使っていません。

## 主な機能

- メモの作成、編集、削除
- 複数メモの選択削除
- タイトル、本文、タグを対象にした検索
- タグの追加、削除、再利用
- 複数タグによる絞り込み
- メモ一覧の表示件数切り替え
- ライトモード / ダークモード切り替え
- `localStorage` による自動保存
- 初期メモへのリセット
- UI確認用のサンプルメモ追加

## 使い方

1. `+ 新規メモ` を押すと、新しいメモを作成できます。
2. 右側の編集エリアで、タイトルと本文を編集できます。
3. メモ上部のタグ入力欄から、タグを追加できます。
4. 過去に使ったタグは候補から再利用できます。
5. `メモを検索` に入力すると、タイトル・本文・タグを対象に検索できます。
6. タグを選択すると、そのタグを持つメモだけを絞り込めます。
7. `選択` を押すと、複数のメモをまとめて削除できます。
8. 左下の設定メニューから、サンプルメモ追加や初期メモへのリセットができます。

## 技術構成

- Next.js
- App Router
- TypeScript
- Tailwind CSS
- localStorage

## ディレクトリ構成

```txt
app/
  layout.tsx
  page.tsx
  globals.css

components/
  Sidebar.tsx
  NoteList.tsx
  NoteEditor.tsx

hooks/
  useNotes.ts
  useTheme.ts

lib/
  notes.ts

types/
  note.ts
```

## ローカルでの起動

```bash
npm install
npm run dev
```

ブラウザで以下を開きます。

```txt
http://localhost:3000
```

## ビルド

```bash
npm run build
```

## 保存について

メモはブラウザの `localStorage` に保存されます。

そのため、別の端末や別のブラウザとは同期されません。また、ブラウザのデータを削除すると、保存したメモも消える可能性があります。
