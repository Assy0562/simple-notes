# シンプルメモ

Next.js App Router、TypeScript、Tailwind CSSで作ったシンプルなメモ帳アプリです。

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 主な機能

- メモの作成、編集、削除
- メモ一覧の検索
- タグの追加、再利用、絞り込み
- 複数メモの選択削除
- メモ一覧の表示件数切り替え
- localStorageによる自動保存
- ライトモード / ダークモード切り替え

## 主な構成

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

## メモ

保存先はブラウザの localStorage です。別の端末や別のブラウザとは同期されません。
