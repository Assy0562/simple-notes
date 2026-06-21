# ディレクトリ構成と各ファイルの役割

このファイルは、メモアプリのコードを学習しやすくするために、各ディレクトリとファイルの役割をまとめたものです。

## 全体像

```txt
simple-memo/
  app/
  components/
  hooks/
  lib/
  types/
  public/
  README.md
  package.json
  tsconfig.json
  next.config.ts
  postcss.config.mjs
```

このアプリは Next.js の App Router を使っています。

大まかには、次のように役割を分けています。

```txt
app/         画面全体とページ設定
components/ UI部品
hooks/       状態管理や保存処理
lib/         汎用的な関数や初期データ
types/       TypeScriptの型定義
```

## app/

Next.js の画面や全体設定を置くディレクトリです。

### app/page.tsx

トップページの本体です。

このアプリでは、左のサイドバーと右のメモ編集エリアを並べています。

主な役割:

- `Sidebar` を表示する
- `NoteEditor` を表示する
- 削除確認モーダルを表示する
- `useNotes` から受け取ったメモ操作を各コンポーネントに渡す

ポイント:

`page.tsx` は「アプリ全体を組み立てる場所」です。  
細かいUIや処理を全部ここに書きすぎると読みにくくなるため、必要に応じて `components/` や `hooks/` に分けています。

### app/layout.tsx

アプリ全体の共通レイアウトです。

主な役割:

- HTML全体の設定
- ページタイトルや説明文などのメタデータ設定
- `globals.css` の読み込み

### app/globals.css

アプリ全体に効くCSSです。

主な役割:

- Tailwind CSS の読み込み
- 全体の基本スタイル
- リッチテキストエディタ用の共通スタイル

## components/

画面を構成するUI部品を置くディレクトリです。

### components/Sidebar.tsx

左側のサイドバーです。

主な役割:

- ユーザー名の表示・編集
- 新規メモ作成ボタン
- メモ検索
- タグフィルター
- メモ一覧の表示切り替え
- 通常メモ / アーカイブの切り替え
- 並び替え
- 選択削除モード
- 設定メニュー
- ダークモード切り替え

ポイント:

サイドバーは機能が多いので、今後さらに大きくなる場合は、検索欄・タグフィルター・設定メニューなどを小さなコンポーネントに分ける候補です。

### components/NoteList.tsx

メモ一覧を表示するコンポーネントです。

主な役割:

- メモタイトルを表示する
- 本文プレビューを表示する
- 選択中のメモを分かるようにする
- ピン留めボタンを表示する
- タグ表示ボタンを表示する
- アーカイブボタンを表示する
- 削除ボタンを表示する
- 複数選択モード用のチェックボタンを表示する

ポイント:

`NoteList` は「一覧の1件1件をどう見せるか」に集中しています。  
検索や並び替えの処理は `Sidebar` 側で行い、ここには表示済みのメモ配列を渡しています。

### components/NoteEditor.tsx

右側のメモ編集エリアです。

主な役割:

- メモタイトルの編集
- 本文の編集
- タグの追加・削除
- 過去に使ったタグの再利用
- 作成日・更新日の表示
- 保存状態の表示

ポイント:

本文編集には Tiptap を使っています。  
通常の `textarea` より少し複雑ですが、見出し・箇条書き・チェックリストなどを扱いやすくするためです。

### components/BackToListButton.tsx

スマートフォンで編集画面から一覧へ戻るための共通ボタンです。

主な役割:

- Chevronアイコンと `一覧` の表示
- ライト・ダークテーマに応じた配色
- メモとToDoで同じ戻る操作を提供

同じUIを1つのコンポーネントにまとめることで、片方だけデザインが変わる問題を防いでいます。
### components/TodoPanel.tsx

ToDo一覧を表示するコンポーネントです。

主な役割:

- ToDoの追加
- 完了 / 未完了の切り替え
- ToDoの削除
- すべて / 未完了 / 完了の絞り込み
- 完了済みToDoの一括削除

ポイント:

メモ本文とは別のデータとしてToDoを扱うため、メモの情報量を増やさずにタスク管理を追加できます。

### components/ResetConfirmModal.tsx

メモやToDoを初期状態へ戻す前に表示する共通確認モーダルです。

主な役割:

- リセット内容と元に戻せないことを説明
- キャンセルと実行ボタンを表示
- メモとToDoで同じ確認UIを提供
### components/DeleteConfirmModal.tsx

メモ削除前に表示する確認モーダルです。

主な役割:

- 1件削除の確認
- 複数削除の確認
- キャンセルボタン
- 削除実行ボタン

ポイント:

以前は `page.tsx` に直接書いていた削除確認UIを、読みやすくするために分けています。

## hooks/

React の状態管理や副作用をまとめるディレクトリです。

### hooks/useNotes.ts

メモアプリの中心的な状態管理です。

主な役割:

- メモ一覧の状態を持つ
- 選択中のメモを管理する
- メモの新規作成
- メモの編集
- タグの更新
- メモの削除
- 複数削除
- ピン留め
- アーカイブ
- localStorage への保存
- localStorage からの読み込み
- 保存状態の管理

ポイント:

`useNotes` は、このアプリの「メモ操作の司令塔」です。  
UIコンポーネントは、ここから渡された関数を呼ぶことでメモを操作します。

### hooks/useTodos.ts

ToDo機能の状態管理です。

主な役割:

- ToDo一覧の状態を持つ
- ToDoの追加
- 完了状態の切り替え
- ToDoの削除
- 完了済みToDoの一括削除
- localStorage への保存
- localStorage からの読み込み

### hooks/useTheme.ts

ダークモード・ライトモードを管理するためのフックです。

主な役割:

- 現在のテーマを保持する
- テーマを切り替える
- localStorage にテーマを保存する
- 次回アクセス時に前回のテーマを復元する

## lib/

UIに直接依存しない、便利関数や初期データを置くディレクトリです。

### lib/todos.ts

ToDoに関する共通処理をまとめています。

主な役割:

- ToDo用 localStorage キーの定義
- 初期ToDoデータ
- ToDo IDを作る関数
- localStorage から読み込んだToDoデータを安全に整形する関数

### lib/notes.ts

メモに関する共通処理をまとめています。

主な役割:

- localStorage のキー定義
- 初期メモデータ
- 今日の日付を文字列にする関数
- メモ本文からプレビュー文を作る関数
- メモIDを作る関数
- localStorage から読み込んだデータを安全に整形する関数

ポイント:

localStorage の中身はユーザーのブラウザに保存されるため、必ず正しい形とは限りません。  
そのため `parseSavedNotes` や `normalizeNote` で、安全に使えるデータか確認しています。

## types/

TypeScript の型定義を置くディレクトリです。

### types/todo.ts

ToDo1件分の型を定義しています。

```ts
export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### types/note.ts

メモ1件分の型を定義しています。

現在の `Note` 型は、だいたい次のような情報を持っています。

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

ポイント:

型を見れば「メモがどんなデータでできているか」が分かります。  
新しい機能を追加するときは、まずこの型に情報を追加する必要があるか考えると理解しやすいです。

## 設定ファイル

### package.json

プロジェクトの基本情報と、使用しているライブラリ、実行コマンドを管理します。

よく使うコマンド:

```bash
npm run dev
npm run build
```

### package-lock.json

インストールされたライブラリの正確なバージョンを記録するファイルです。

基本的に手で編集しません。

### tsconfig.json

TypeScript の設定ファイルです。

主な役割:

- TypeScript のコンパイル設定
- パスエイリアス `@/` の設定

このアプリでは、次のような import が使えます。

```ts
import { Sidebar } from "@/components/Sidebar";
```

### next.config.ts

Next.js の設定ファイルです。

現時点では大きな設定は少ないですが、Next.js全体の挙動を変えたい場合に使います。

### postcss.config.mjs

Tailwind CSS など、CSS変換に関する設定ファイルです。

基本的には最初に作られた設定のままでOKです。

### next-env.d.ts

Next.js が自動生成・管理する型定義ファイルです。

注意:

このファイルは基本的に手で編集しません。

### tsconfig.tsbuildinfo

TypeScript がビルドを速くするために使うキャッシュファイルです。

基本的に手で編集しません。

## 生成・依存関係のディレクトリ

### node_modules/

インストールされたライブラリが入るディレクトリです。

基本的に中身は読みません。  
Gitにも通常は含めません。

### .next/

Next.js が開発サーバーやビルド時に作る生成物です。

基本的に中身は編集しません。  
Gitにも通常は含めません。

### .git/

Git の管理情報が入っているディレクトリです。

基本的に手で編集しません。

### .vscode/

VS Code のワークスペース設定を置くディレクトリです。

チームや自分の環境で共有したい設定がある場合はGitに含めることがあります。  
個人環境だけの設定なら含めないこともあります。

## 今後整理するなら

今後ファイルが増えてきたら、`components/` を次のように分けるとさらに読みやすくなります。

```txt
components/
  layout/
    Sidebar.tsx

  notes/
    NoteEditor.tsx
    NoteList.tsx
    DeleteConfirmModal.tsx
    TodoPanel.tsx
```

ただし、今すぐ必須ではありません。  
学習中は「分けすぎて分からなくなる」こともあるので、まずは今の構成を理解してから少しずつ整理するのがおすすめです。

