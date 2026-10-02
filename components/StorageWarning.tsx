"use client";

import type { StorageProblem } from "@/lib/storage-guard";

export function StorageWarning({ notesProblem, todosProblem }: {
  notesProblem: StorageProblem;
  todosProblem: StorageProblem;
}) {
  if (!notesProblem && !todosProblem) return null;
  const targets = [notesProblem && "メモ", todosProblem && "ToDo"].filter(Boolean).join("・");
  const conflict = notesProblem === "conflict" || todosProblem === "conflict";
  return (
    <section role="alert" className="sticky top-0 z-50 border-b border-amber-500 bg-amber-100 px-4 py-3 text-sm text-amber-950">
      <p className="font-semibold">{targets}の保存を停止しています。</p>
      <p>{conflict
        ? "別のタブで保存内容が変更されました。古い内容での上書きを防いでいます。"
        : "安全に保存できませんでした。ブラウザの保存設定・空き容量と、HTTPSで開いているかを確認してください。"}</p>
      <p>このタブの未保存の変更は再読み込みで失われます。必要な文章をコピーしてから、最新の内容を読み込んでください。</p>
      <button type="button" className="mt-2 rounded border border-amber-800 px-3 py-1 font-semibold" onClick={() => {
        if (window.confirm("このタブの未保存の変更を破棄して、最新の保存内容を読み込みますか？")) window.location.reload();
      }}>最新の内容を再読み込み</button>
    </section>
  );
}
