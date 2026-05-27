# Simple Notes

シンプルに書いて、タグで整理できるメモ帳アプリです。

公開URL: https://simple-notes-drab.vercel.app/

## 概要

Simple Notes は、Next.js、TypeScript、Tailwind CSS で作ったブラウザ用のメモ帳アプリです。
メモの作成、編集、検索、タグ付け、削除ができます。保存にはブラウザの `localStorage` を使用しているため、バックエンドやデータベースは使っていません。

## 主な機能

- メモの作成、編集、削除
- Markdownショートカット入力による見出し、リスト、引用、コードブロックの作成
- メモのピン留め
- 更新日、作成日、タイトルによる並び替え
- 複数メモの選択削除
- タイトル、本文、タグを対象にした検索
- タグの追加、削除、再利用
- 複数タグによる絞り込み
- メモ一覧の表示件数切り替え
- ライトモード / ダークモードの切り替え
- `localStorage` による自動保存
- 初期メモへのリセット
- UI確認用のサンプルメモ追加
- Markdown入力確認用のテストメモ追加

## Markdown入力

本文エリアでは、編集とプレビューを分けずにそのまま書けるリッチエディタを使っています。
行頭で以下のように入力してスペースを押すと、Notionのようにブロックへ変換されます。

````txt
#   見出し1
##  見出し2
### 見出し3
-   箇条書き
1.  番号付きリスト
>   引用
``` コードブロック
````

## ローカルでの起動

```bash
npm install
npm run dev
```

ブラウザで以下を開きます。

```txt
http://localhost:3000
```

## 開発コマンド

```bash
npm run typecheck
npm run lint
npm run build
```

現在の `lint` は、Next.js 16 で `next lint` が提供されなくなったため、TypeScript の型チェックを実行する形にしています。

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

## 保存について

メモはブラウザの `localStorage` に保存されます。
別の端末や別のブラウザとは同期されません。また、ブラウザのデータを削除すると保存したメモも消える可能性があります。
