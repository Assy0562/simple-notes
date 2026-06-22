# ディレクトリ構成と各ファイルの役割

この資料は、現在のコードを読むときの案内図です。
機能の使い方は `README.md`、開発の現在地は `DEVELOPMENT_STATUS.md`、設計判断は `IMPLEMENTATION_NOTES.md` を参照してください。

## 全体構成

```txt
simple-memo/
├─ app/           Next.jsのページと全体スタイル
├─ components/    画面を構成するUI
├─ hooks/         状態管理とlocalStorage保存
├─ lib/           初期データとデータ変換
├─ types/         TypeScriptのデータ型
├─ docs/          開発資料
├─ AGENTS.md      AIと作業するときのルール
├─ README.md      アプリ概要と利用方法
└─ 設定ファイル
```

処理の基本的な流れは次のとおりです。

```txt
ユーザー操作
  ↓
components/ のUI
  ↓
app/page.tsx が操作を受け渡す
  ↓
hooks/ が状態を更新
  ↓
localStorageへ自動保存
```

読み込み時は `lib/` の関数がlocalStorageのデータを安全な形式へ整えます。

## app/

Next.js App Routerのページとアプリ全体の設定を置きます。

### `app/page.tsx`

アプリ全体を組み立てるページです。

主な役割:

- メモ / ToDoモードの切り替え
- `useNotes`、`useTodos`、`useTheme`の利用
- サイドバーと編集領域への状態・操作関数の受け渡し
- メモ、ToDo、ToDoリストの削除確認状態の管理
- PCとスマートフォンでの一覧・詳細表示の切り替え

データ操作の詳細はフックへ、個別の見た目はコンポーネントへ任せています。

### `app/layout.tsx`

全ページ共通のHTML構造、メタデータ、`globals.css`の読み込みを担当します。

### `app/globals.css`

Tailwind CSSの読み込みと、リッチテキストエディタを含む全体共通スタイルを定義します。

## components/

画面に表示するUI部品を置きます。

### メモ

#### `components/Sidebar.tsx`

メモ側のサイドバーです。

- ユーザー名、新規作成、検索
- タグ絞り込み、並び替え
- 通常 / アーカイブ表示
- メモ一覧と複数選択操作
- 設定、テーマ、開発者コマンド

#### `components/NoteList.tsx`

メモ一覧と各メモ行を表示します。

- タイトルと本文プレビュー
- 選択中、ピン留め、タグの表示
- アーカイブ、削除、複数選択
- PCのホバー操作とスマートフォンの展開メニュー

#### `components/NoteEditor.tsx`

選択中メモの編集画面です。

- タイトルと本文の編集
- Tiptapによるリッチテキスト編集
- Markdownショートカットの変換
- タグの追加、削除、再利用
- 作成日、更新日、保存状態の表示

#### `components/DeleteConfirmModal.tsx`

メモを1件または複数件削除する前の確認画面です。

### ToDo

#### `components/TodoSidebar.tsx`

ToDo側のサイドバーです。

- ToDoリストの新規作成、検索
- タグ絞り込み、並び替え
- 通常 / アーカイブ表示
- リスト一覧と複数選択操作
- 設定、テーマ、開発者コマンド

#### `components/TodoPanel.tsx`

選択中のToDoリストと、その中のタスクを操作します。

- リスト名とタグの編集
- タスクの追加、完了切り替え
- すべて / 未完了 / 完了の絞り込み
- 個別削除と複数選択削除
- すべて完了、すべて未完了、完了済み削除

#### `components/TodoDeleteConfirmModal.tsx`

ToDoまたはToDoリストを削除する前の確認画面です。対象の種類と件数に応じて説明を切り替えます。

### 共通

#### `components/BackToListButton.tsx`

スマートフォンの詳細画面から一覧へ戻る共通ボタンです。

#### `components/ResetConfirmModal.tsx`

メモまたはToDoを初期データへ戻す前の確認画面です。

#### `components/ThemeSelector.tsx`

ライト、ダーク、端末設定に合わせるテーマ選択UIです。

## hooks/

Reactの状態、データ操作、副作用をまとめます。UIからデータ管理を分離する層です。

### `hooks/useNotes.ts`

メモ機能の状態管理を担当します。

- 初期データとlocalStorageからの読み込み
- 作成、編集、削除、複数削除
- タグ、ピン留め、アーカイブ
- サンプルデータ作成と初期化
- 自動保存と保存状態

### `hooks/useTodos.ts`

ToDoリストとタスクの状態管理を担当します。

- ToDoリストの作成、編集、削除、複数削除
- タグ、ピン留め、アーカイブ
- タスクの追加、完了切り替え、個別・複数削除
- 完了状態の一括変更と完了済み削除
- サンプルデータ作成と初期化
- localStorageへの自動保存

### `hooks/useTheme.ts`

テーマ設定を管理し、端末設定の監視とlocalStorageへの保存を行います。

## lib/

ReactやUIへ直接依存しないデータ処理を置きます。

### `lib/notes.ts`

- メモ用localStorageキー
- 初期メモとサンプル内容
- ID、日付、プレビューの生成
- 保存済みメモの検証と正規化

### `lib/todos.ts`

- ToDo用localStorageキー
- 初期ToDoリストとタスク
- ID生成
- 保存済みToDoデータの検証と正規化

localStorageの値は古い形式や不正な形式の可能性があるため、フックで直接信用せず `lib/` の関数を通して読み込みます。

## types/

アプリで扱うデータ構造を定義します。

### `types/note.ts`

`Note`を定義します。

```ts
export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isArchived: boolean;
};
```

### `types/todo.ts`

ToDoリストを表す `TodoList` と、リストに所属するタスクを表す `Todo` を定義します。

```ts
export type TodoList = {
  id: string;
  title: string;
  isArchived: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type Todo = {
  id: string;
  listId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};
```

## docs/

用途の異なる開発情報を分けて保存します。

### `docs/DEVELOPMENT_STATUS.md`

完成している機能、現在の注意点、次の開発候補をまとめます。作業開始時に最初に確認する資料です。

### `docs/PROJECT_STRUCTURE.md`

この資料です。現在のディレクトリと責務を説明します。ファイル追加や責務変更があったときだけ更新します。

### `docs/IMPLEMENTATION_NOTES.md`

不具合修正や設計判断について、変更理由、採用方法、代替案、確認結果を記録します。

## ルートのファイル

### `AGENTS.md`

CodexなどのAIが、このプロジェクトで実装するときに守る手順と判断基準です。

### `README.md`

利用者向けのアプリ概要、機能、操作方法、起動方法を説明します。

### `package.json`

依存ライブラリと `dev`、`typecheck`、`lint`、`build` などのコマンドを定義します。

### `package-lock.json`

依存ライブラリの正確なバージョンを固定します。通常は手で編集しません。

### `tsconfig.json`

TypeScriptと `@/` パスエイリアスを設定します。

### `next.config.ts`

Next.js全体の設定です。

### `postcss.config.mjs`

Tailwind CSSを含むCSS変換の設定です。

### `next-env.d.ts`

Next.jsが管理する型定義です。手で編集しません。

## 生成物と依存関係

次の項目は実装コードではなく、基本的にGitへ含めません。

- `.next/`: Next.jsの生成物
- `node_modules/`: インストール済みパッケージ
- `tsconfig.tsbuildinfo`: TypeScriptのビルドキャッシュ
- `*.log`: ログファイル

`.vscode/` は個人設定だけならコミットせず、共有する明確な理由がある場合だけ内容を確認して追加します。

## 機能を変更するときの読み始め

| 変更内容 | 最初に確認するファイル |
| --- | --- |
| メモのデータ操作 | `hooks/useNotes.ts`、`lib/notes.ts`、`types/note.ts` |
| メモ一覧・検索 | `components/Sidebar.tsx`、`components/NoteList.tsx` |
| メモ編集 | `components/NoteEditor.tsx` |
| ToDoのデータ操作 | `hooks/useTodos.ts`、`lib/todos.ts`、`types/todo.ts` |
| ToDoリスト一覧 | `components/TodoSidebar.tsx` |
| ToDoタスク操作 | `components/TodoPanel.tsx` |
| 画面切り替え・モーダル | `app/page.tsx` |
| テーマ | `hooks/useTheme.ts`、`components/ThemeSelector.tsx` |
| 全体スタイル | `app/globals.css` |

## 今後の分割候補

現在の構成は機能の所在が分かりやすく、すぐに大規模な移動は必要ありません。
ただし `Sidebar.tsx` と `TodoSidebar.tsx` は機能が多いため、変更が難しくなった段階で次の単位を候補にします。

- 検索・タグ・並び替え
- 一覧行
- 選択操作
- 設定メニュー

学習用プロジェクトなので、ファイル数を増やすこと自体を目的にせず、責務が明確に分かれるときだけ分割します。
