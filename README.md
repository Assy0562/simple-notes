# シンプルメモ

Next.js App Router、TypeScript、Tailwind CSSで作った学習用のNotion風メモアプリです。

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 実装済み

- メモの一覧表示
- タイトルと本文の検索
- 更新日が新しい順の一覧表示
- メモの選択
- タイトルと本文の編集
- 新規メモ作成
- メモ削除
- 削除前の確認
- localStorage保存
- 初期メモへのリセット
- 保存状態の表示
- ライト/ダークモード切り替え

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

## 学習ポイント

- `useState` と `useEffect` の基本
- localStorageを使った保存
- コンポーネント分割
- カスタムフックによる状態管理の整理
- TypeScriptの型定義
- Tailwind CSSでのUI調整
