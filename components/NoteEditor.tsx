"use client";

import { useEffect, useRef, useState } from "react";

import type { Note } from "@/types/note";

type NoteEditorProps = {
  allTags: string[];
  isDark: boolean;
  note: Note;
  saveStatus: "idle" | "saving" | "saved";
  titleFocusRequest: number;
  onUpdateNote: (field: "title" | "content", value: string) => void;
  onUpdateTags: (tags: string[]) => void;
};

export function NoteEditor({
  allTags,
  isDark,
  note,
  saveStatus,
  titleFocusRequest,
  onUpdateNote,
  onUpdateTags,
}: NoteEditorProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [tagDraft, setTagDraft] = useState("");

  useEffect(() => {
    if (titleFocusRequest > 0) {
      titleInputRef.current?.focus();
    }
  }, [titleFocusRequest]);

  useEffect(() => {
    setTagDraft("");
  }, [note.id]);

  const saveText =
    saveStatus === "saving"
      ? "\u4fdd\u5b58\u4e2d..."
      : saveStatus === "saved"
        ? "\u4fdd\u5b58\u6e08\u307f"
        : "";
  const saveDotClass =
    saveStatus === "saving"
      ? "bg-[#d99a2b]"
      : saveStatus === "saved"
        ? "bg-[#4f9f68]"
        : isDark
          ? "bg-[#777777]"
          : "bg-[#b9b4ac]";

  return (
    <section className="flex-1 px-8 py-10">
      <article className="mx-auto max-w-3xl">
        <div
          className={`mb-6 border-b pb-4 text-xs ${
            isDark
              ? "border-[#2f2f2f] text-[#9b9b9b]"
              : "border-[#e4e1dc] text-[#8a857d]"
          }`}
        >
          <TagInput
            isDark={isDark}
            note={note}
            allTags={allTags}
            tagDraft={tagDraft}
            onAddTag={addTag}
            onAddExistingTag={addExistingTag}
            onRemoveTag={removeTag}
            onChangeTagDraft={setTagDraft}
          />
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

        <div
          className={`mt-6 flex items-center justify-between gap-5 border-t pt-4 text-xs ${
            isDark
              ? "border-[#2f2f2f] text-[#9b9b9b]"
              : "border-[#e4e1dc] text-[#8a857d]"
          }`}
        >
          <dl className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <dt>{"\u4f5c\u6210"}</dt>
              <dd className={isDark ? "text-[#c9c9c9]" : "text-[#5f5a52]"}>
                {note.createdAt}
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt>{"\u66f4\u65b0"}</dt>
              <dd className={isDark ? "text-[#c9c9c9]" : "text-[#5f5a52]"}>
                {note.updatedAt}
              </dd>
            </div>
          </dl>

          {saveText && (
            <div
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
                isDark
                  ? "border-[#333333] bg-[#202020] text-[#c9c9c9]"
                  : "border-[#e4e1dc] bg-[#fbfaf8] text-[#5f5a52]"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${saveDotClass}`} />
              <span>{saveText}</span>
            </div>
          )}
        </div>
      </article>
    </section>
  );

  function addTag() {
    const nextTag = tagDraft.trim();

    if (nextTag === "" || note.tags.includes(nextTag)) {
      setTagDraft("");
      return;
    }

    // Add one tag to the existing array without changing the old array directly.
    onUpdateTags([...note.tags, nextTag]);
    setTagDraft("");
  }

  function addExistingTag(tag: string) {
    if (note.tags.includes(tag)) {
      return;
    }

    // Reuse an existing tag from another note.
    onUpdateTags([...note.tags, tag]);
    setTagDraft("");
  }

  function removeTag(tagToRemove: string) {
    // filter creates a new array that excludes the clicked tag.
    onUpdateTags(note.tags.filter((tag) => tag !== tagToRemove));
  }
}

type TagInputProps = {
  allTags: string[];
  isDark: boolean;
  note: Note;
  tagDraft: string;
  onAddTag: () => void;
  onAddExistingTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onChangeTagDraft: (value: string) => void;
};

function TagInput({
  allTags,
  isDark,
  note,
  tagDraft,
  onAddTag,
  onAddExistingTag,
  onRemoveTag,
  onChangeTagDraft,
}: TagInputProps) {
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const normalizedTagDraft = tagDraft.trim().toLowerCase();
  const suggestedTags =
    normalizedTagDraft === ""
      ? []
      : allTags
          .filter((tag) => !note.tags.includes(tag))
          .filter((tag) => tag.toLowerCase().includes(normalizedTagDraft))
          .slice(0, 5);
  const menuTags = allTags.filter((tag) => !note.tags.includes(tag));
  const shownTags = normalizedTagDraft === "" ? menuTags : suggestedTags;
  const shouldShowTagMenu =
    shownTags.length > 0 && (isTagMenuOpen || normalizedTagDraft !== "");

  return (
    <div className="relative">
      <div
        className={`flex min-h-11 flex-wrap items-center gap-2 rounded-md border px-3 py-2 transition ${
          isDark
            ? "border-[#303030] bg-[#1f1f1f] focus-within:border-[#555555]"
            : "border-[#ded9d1] bg-[#fbfaf8] focus-within:border-[#b9b2a7]"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsTagMenuOpen((isOpen) => !isOpen)}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded transition ${
            isDark
              ? "text-[#8f8f8f] hover:bg-[#303030] hover:text-[#d6d6d6]"
              : "text-[#8a857d] hover:bg-[#eee9e1] hover:text-[#5f5a52]"
          }`}
          aria-label={"\u30bf\u30b0\u4e00\u89a7\u3092\u8868\u793a"}
          aria-expanded={isTagMenuOpen}
        >
          <svg
            aria-hidden="true"
            className="block h-4 w-4 shrink-0 overflow-hidden"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7.17a2.5 2.5 0 0 1 1.77.73l7.33 7.33a2.5 2.5 0 0 1 0 3.54l-6.17 6.17a2.5 2.5 0 0 1-3.54 0L3.73 13.44A2.5 2.5 0 0 1 3 11.67V4.5Zm6 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
            />
          </svg>
        </button>

        {note.tags.map((tag) => (
          <span
            key={tag}
            className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${
              isDark
                ? "border-[#3a3a3a] bg-[#282828] text-[#d6d6d6]"
                : "border-[#e1ddd5] bg-[#f4f1eb] text-[#5f5a52]"
            }`}
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className={`rounded-full px-1 transition ${
                isDark
                  ? "text-[#a8a8a8] hover:bg-[#3a3a3a] hover:text-[#f1f1f1]"
                  : "text-[#8a857d] hover:bg-[#e4ded5] hover:text-[#37352f]"
              }`}
              aria-label={`${tag} \u3092\u524a\u9664`}
            >
              {"\u00d7"}
            </button>
          </span>
        ))}

        <input
          value={tagDraft}
          onChange={(event) => {
            onChangeTagDraft(event.target.value);
            setIsTagMenuOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAddTag();
            }
          }}
          className={`min-w-32 flex-1 bg-transparent text-sm outline-none ${
            isDark
              ? "text-[#e6e6e6] placeholder:text-[#666666]"
              : "text-[#37352f] placeholder:text-[#9b968e]"
          }`}
          placeholder={"+ \u30bf\u30b0\u3092\u8ffd\u52a0"}
          aria-label={"\u30bf\u30b0\u540d\u3092\u5165\u529b\u3057\u3066 Enter \u3067\u8ffd\u52a0"}
        />
      </div>

      {shouldShowTagMenu && (
        <div
          className={`absolute left-0 top-full z-20 mt-2 w-64 rounded-md border p-1 shadow-lg ${
            isDark
              ? "border-[#333333] bg-[#252525]"
              : "border-[#e4e1dc] bg-[#fbfaf8]"
          }`}
        >
          {shownTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onAddExistingTag(tag);
                setIsTagMenuOpen(false);
              }}
              className={`block w-full rounded px-3 py-2 text-left text-sm transition ${
                isDark
                  ? "text-[#e6e6e6] hover:bg-[#303030]"
                  : "text-[#4f4b45] hover:bg-[#eeeae4]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
