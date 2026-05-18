"use client";

import { useEffect, useRef } from "react";

import type { Note } from "@/types/note";

type NoteEditorProps = {
  isDark: boolean;
  note: Note;
  saveStatus: "idle" | "saving" | "saved";
  titleFocusRequest: number;
  onUpdateNote: (field: "title" | "content", value: string) => void;
};

export function NoteEditor({
  isDark,
  note,
  saveStatus,
  titleFocusRequest,
  onUpdateNote,
}: NoteEditorProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFocusRequest > 0) {
      titleInputRef.current?.focus();
    }
  }, [titleFocusRequest]);

  const saveText =
    saveStatus === "saving"
      ? "\u4fdd\u5b58\u4e2d..."
      : saveStatus === "saved"
        ? "\u4fdd\u5b58\u6e08\u307f"
        : "";

  return (
    <section className="flex-1 px-8 py-10">
      <article className="mx-auto max-w-3xl">
        <div
          className={`mb-6 flex items-center justify-between text-xs ${
            isDark ? "text-[#9b9b9b]" : "text-[#8a857d]"
          }`}
        >
          <p>
            {"\u4f5c\u6210\u65e5"}: {note.createdAt}
            <span className="mx-2">/</span>
            {"\u66f4\u65b0\u65e5"}: {note.updatedAt}
          </p>
          <p>{saveText}</p>
        </div>

        <input
          ref={titleInputRef}
          value={note.title}
          onChange={(event) => onUpdateNote("title", event.target.value)}
          className={`mb-6 w-full bg-transparent text-4xl font-bold tracking-normal outline-none ${
            isDark ? "placeholder:text-[#666666]" : "placeholder:text-[#b9b4ac]"
          }`}
          placeholder={"\u7121\u984c\u306e\u30e1\u30e2"}
        />

        <textarea
          value={note.content}
          onChange={(event) => onUpdateNote("content", event.target.value)}
          className={`min-h-[520px] w-full resize-none border-none bg-transparent text-base leading-8 outline-none ${
            isDark
              ? "text-[#dedede] placeholder:text-[#666666]"
              : "text-[#37352f] placeholder:text-[#b9b4ac]"
          }`}
          placeholder={"\u30e1\u30e2\u3092\u66f8\u3044\u3066\u304f\u3060\u3055\u3044..."}
        />
      </article>
    </section>
  );
}
