"use client";

import { useEffect, useRef, useState } from "react";
import { Extension } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { BackToListButton } from "@/components/BackToListButton";
import type { Note } from "@/types/note";

const MarkdownShortcuts = Extension.create({
  name: "markdownShortcuts",

  addKeyboardShortcuts() {
    return {
      Space: () => {
        const { editor } = this;
        const { selection } = editor.state;

        if (!selection.empty) {
          return false;
        }

        const { $from } = selection;

        if ($from.parent.type.name !== "paragraph") {
          return false;
        }

        const lineText = $from.parent.textBetween(0, $from.parentOffset, "\n");
        const markerStart = $from.start();
        const markerEnd = $from.pos;
        const chain = editor.chain().deleteRange({
          from: markerStart,
          to: markerEnd,
        });

        if (/^#{1,3}$/.test(lineText)) {
          return chain
            .setHeading({ level: lineText.length as 1 | 2 | 3 })
            .run();
        }

        if (lineText === "-") {
          return chain.toggleBulletList().run();
        }

        if (lineText === "1.") {
          return chain.toggleOrderedList().run();
        }

        if (lineText === ">") {
          return chain.toggleBlockquote().run();
        }

        if (lineText === "```") {
          return chain.setCodeBlock().run();
        }

        return false;
      },
    };
  },
});

type NoteEditorProps = {
  allTags: string[];
  isDark: boolean;
  note: Note;
  saveStatus: "idle" | "saving" | "saved";
  titleFocusRequest: number;
  onUpdateNote: (field: "title" | "content", value: string) => void;
  onUpdateTags: (tags: string[]) => void;
  onBackToList?: () => void;
};

export function NoteEditor({
  allTags,
  isDark,
  note,
  saveStatus,
  titleFocusRequest,
  onUpdateNote,
  onUpdateTags,
  onBackToList,
}: NoteEditorProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [tagDraft, setTagDraft] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      MarkdownShortcuts,
      Link.configure({
        autolink: true,
        defaultProtocol: "https",
        openOnClick: false,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: "\u30e1\u30e2\u3092\u66f8\u3044\u3066\u304f\u3060\u3055\u3044...",
      }),
    ],
    content: toEditorHtml(note.content),
    editorProps: {
      attributes: {
        class: "note-rich-editor",
      },
    },
    immediatelyRender: false,
    onUpdate({ editor: currentEditor }) {
      onUpdateNote("content", currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (titleFocusRequest > 0) {
      titleInputRef.current?.focus();
    }
  }, [titleFocusRequest]);

  useEffect(() => {
    setTagDraft("");
  }, [note.id]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextContent = toEditorHtml(note.content);

    if (editor.getHTML() !== nextContent) {
      editor.commands.setContent(nextContent, { emitUpdate: false });
    }
  }, [editor, note.content, note.id]);

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
    <section className="flex-1 px-4 py-5 md:px-8 md:py-10">
      <article className="mx-auto max-w-3xl">
        {onBackToList && <BackToListButton isDark={isDark} onClick={onBackToList} />}

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
          className={`mb-5 w-full bg-transparent text-3xl font-bold tracking-normal outline-none md:mb-6 md:text-4xl ${
            isDark ? "placeholder:text-[#666666]" : "placeholder:text-[#b9b4ac]"
          }`}
          placeholder={"\u7121\u984c\u306e\u30e1\u30e2"}
        />

        <div
          className={`min-h-[420px] text-base leading-8 md:min-h-[520px] ${
            isDark ? "text-[#dedede]" : "text-[#37352f]"
          }`}
        >
          <EditorContent editor={editor} />
        </div>

        <div
          className={`mt-6 flex flex-col items-start gap-3 border-t pt-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-5 ${
            isDark
              ? "border-[#2f2f2f] text-[#9b9b9b]"
              : "border-[#e4e1dc] text-[#8a857d]"
          }`}
        >
          <dl className="flex flex-wrap items-center gap-x-5 gap-y-2">
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

function toEditorHtml(content: string) {
  if (content.trim() === "") {
    return "";
  }

  if (/<\/?[a-z][\s\S]*>/i.test(content)) {
    return content;
  }

  return markdownTextToEditorHtml(content);
}

function markdownTextToEditorHtml(content: string) {
  const lines = content.split(/\r?\n/);
  const html: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmedLine = line.trim();

    if (trimmedLine === "") {
      index += 1;
      continue;
    }

    const codeFenceMatch = trimmedLine.match(/^```/);

    if (codeFenceMatch) {
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
      continue;
    }

    const headingMatch = trimmedLine.match(/^(#{1,3})\s+(.+)$/);

    if (headingMatch) {
      html.push(
        `<h${headingMatch[1].length}>${formatInlineMarkdown(headingMatch[2])}</h${headingMatch[1].length}>`,
      );
      index += 1;
      continue;
    }

    if (/^>\s+/.test(trimmedLine)) {
      const quoteLines: string[] = [];

      while (index < lines.length && /^>\s+/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s+/, ""));
        index += 1;
      }

      html.push(
        `<blockquote><p>${formatInlineMarkdown(quoteLines.join(" ").trim())}</p></blockquote>`,
      );
      continue;
    }

    if (/^-\s+\[[ xX]\]\s+/.test(trimmedLine)) {
      const items: string[] = [];

      while (
        index < lines.length &&
        /^-\s+\[[ xX]\]\s+/.test(lines[index].trim())
      ) {
        const itemMatch = lines[index]
          .trim()
          .match(/^-\s+\[([ xX])\]\s+(.+)$/);
        const isChecked = itemMatch?.[1].toLowerCase() === "x";
        const text = itemMatch?.[2] ?? "";

        items.push(
          `<li data-type="taskItem" data-checked="${isChecked ? "true" : "false"}"><label><input type="checkbox"${
            isChecked ? ' checked="checked"' : ""
          }></label><div><p>${formatInlineMarkdown(text)}</p></div></li>`,
        );
        index += 1;
      }

      html.push(`<ul data-type="taskList">${items.join("")}</ul>`);
      continue;
    }

    if (/^-\s+/.test(trimmedLine)) {
      const items: string[] = [];

      while (index < lines.length && /^-\s+/.test(lines[index].trim())) {
        items.push(
          `<li><p>${formatInlineMarkdown(lines[index].trim().replace(/^-\s+/, ""))}</p></li>`,
        );
        index += 1;
      }

      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmedLine)) {
      const items: string[] = [];

      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(
          `<li><p>${formatInlineMarkdown(lines[index].trim().replace(/^\d+\.\s+/, ""))}</p></li>`,
        );
        index += 1;
      }

      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    const paragraphLines = [line];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() !== "" &&
      !/^(#{1,3})\s+/.test(lines[index].trim()) &&
      !/^>\s+/.test(lines[index].trim()) &&
      !/^-\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim()) &&
      !lines[index].trim().startsWith("```")
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    html.push(
      `<p>${formatInlineMarkdown(paragraphLines.join("\n")).replace(/\n/g, "<br>")}</p>`,
    );
  }

  return html.join("");
}

function formatInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
