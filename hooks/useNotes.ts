"use client";

import { useEffect, useState } from "react";

import {
  createNoteId,
  getTodayText,
  initialNotes,
  parseSavedNotes,
  STORAGE_KEY,
} from "@/lib/notes";
import type { Note } from "@/types/note";

type NoteField = "title" | "content";
type SaveStatus = "idle" | "saving" | "saved";

const longTestNoteContent =
  "This is a long test note for checking how the editor behaves with a larger amount of text. " +
  "Short notes are useful, but they do not show whether the writing area, spacing, scrolling, preview text, and saved status still feel comfortable during real use. " +
  "A notes app should stay calm and readable even when the user writes a longer work log, study record, or idea draft. " +
  "\n\n" +
  "In this note, the content is intentionally plain. There are no special headings or rich text blocks, so it is easy to see the basic writing experience. " +
  "You can check whether the body width feels right, whether the line height is easy to read, and whether the metadata at the bottom appears in a natural place after a longer entry. " +
  "The sidebar preview should also remain compact, because the note list should not become noisy just because one memo has a lot of text. " +
  "\n\n" +
  "The tag feature can be tested here as well. This note includes tags for testing, UI review, and long text. " +
  "When a tag is selected in the sidebar, this note should appear only if it has the selected tag. " +
  "The search box should also find words from the title, body, and tags without changing the original note data. " +
  "\n\n" +
  "This kind of test note is helpful because it gives the interface a realistic amount of content. " +
  "If anything feels crowded, hard to scan, or visually unbalanced, that is a useful signal for the next small improvement.";

const markdownTestNoteContent =
  "<h1>Markdown \u30b7\u30e7\u30fc\u30c8\u30ab\u30c3\u30c8\u30c6\u30b9\u30c8</h1>" +
  "<p>\u3053\u306e\u30e1\u30e2\u306f\u3001\u5165\u529b\u4e2d\u306b\u30d6\u30ed\u30c3\u30af\u304c\u5909\u63db\u3055\u308c\u308b\u304b\u3092\u78ba\u8a8d\u3059\u308b\u305f\u3081\u306e\u30c6\u30b9\u30c8\u7528\u3067\u3059\u3002</p>" +
  "<h2>\u8a66\u305b\u308b\u5165\u529b</h2>" +
  "<ul><li><p><code># </code>\u3067\u5927\u898b\u51fa\u3057</p></li><li><p><code>## </code>\u3067\u4e2d\u898b\u51fa\u3057</p></li><li><p><code>- </code>\u3067\u7b87\u6761\u66f8\u304d</p></li><li><p><code>1. </code>\u3067\u756a\u53f7\u4ed8\u304d\u30ea\u30b9\u30c8</p></li><li><p><code>&gt; </code>\u3067\u5f15\u7528</p></li><li><p><code>```</code>\u3067\u30b3\u30fc\u30c9\u30d6\u30ed\u30c3\u30af</p></li></ul>" +
  "<blockquote><p>Notion\u306e\u3088\u3046\u306b\u3001\u66f8\u3044\u3066\u3044\u308b\u5834\u6240\u3067\u305d\u306e\u307e\u307e\u30d6\u30ed\u30c3\u30af\u3068\u3057\u3066\u8868\u793a\u3055\u308c\u307e\u3059\u3002</p></blockquote>" +
  "<pre><code>const message = \"Hello, editor shortcuts!\";\nconsole.log(message);</code></pre>";

const sampleNotes = [
  {
    title: "\u30d0\u30ca\u30ca\u306f\u8349",
    content:
      "\u30d0\u30ca\u30ca\u306e\u6728\u3068\u547c\u3070\u308c\u308b\u3082\u306e\u306f\u3001\u6b63\u78ba\u306b\u306f\u6728\u3067\u306f\u306a\u304f\u5de8\u5927\u306a\u8349\u306e\u4ef2\u9593\u3067\u3059\u3002\u5e79\u306e\u3088\u3046\u306b\u898b\u3048\u308b\u90e8\u5206\u306f\u3001\u8449\u306e\u6839\u5143\u304c\u91cd\u306a\u3063\u305f\u3082\u306e\u3067\u3059\u3002",
    tags: ["\u96d1\u5b66", "\u690d\u7269"],
  },
  {
    title: "\u30cf\u30c1\u30df\u30c4\u306f\u9577\u6301\u3061",
    content:
      "\u30cf\u30c1\u30df\u30c4\u306f\u6c34\u5206\u304c\u5c11\u306a\u304f\u7cd6\u5206\u304c\u591a\u3044\u305f\u3081\u3001\u7d30\u83cc\u304c\u5897\u3048\u306b\u304f\u3044\u98df\u3079\u7269\u3067\u3059\u3002\u4fdd\u5b58\u72b6\u614b\u304c\u826f\u3051\u308c\u3070\u3068\u3066\u3082\u9577\u304f\u98df\u3079\u3089\u308c\u307e\u3059\u3002",
    tags: ["\u96d1\u5b66", "\u98df\u3079\u7269"],
  },
  {
    title: "\u30ab\u30f3\u30ac\u30eb\u30fc\u306f\u5f8c\u308d\u306b\u9032\u307f\u306b\u304f\u3044",
    content:
      "\u30ab\u30f3\u30ac\u30eb\u30fc\u306f\u5927\u304d\u306a\u5c3e\u3068\u5f8c\u308d\u8db3\u306e\u69cb\u9020\u306e\u305f\u3081\u3001\u5f8c\u308d\u5411\u304d\u306b\u6b69\u304f\u306e\u304c\u82e6\u624b\u3067\u3059\u3002\u30aa\u30fc\u30b9\u30c8\u30e9\u30ea\u30a2\u306e\u7d0b\u7ae0\u306b\u3082\u3001\u524d\u9032\u306e\u8c61\u5fb4\u3068\u3057\u3066\u63cf\u304b\u308c\u3066\u3044\u307e\u3059\u3002",
    tags: ["\u96d1\u5b66", "\u52d5\u7269"],
  },
  {
    title: "\u30c1\u30e7\u30b3\u30ec\u30fc\u30c8\u306f\u6614\u3001\u98f2\u307f\u7269\u3060\u3063\u305f",
    content:
      "\u73fe\u5728\u306e\u3088\u3046\u306a\u677f\u30c1\u30e7\u30b3\u306f\u6bd4\u8f03\u7684\u65b0\u3057\u3044\u5f62\u3067\u3059\u3002\u3082\u3068\u3082\u3068\u30ab\u30ab\u30aa\u306f\u3001\u82e6\u307f\u306e\u3042\u308b\u98f2\u307f\u7269\u3068\u3057\u3066\u98f2\u307e\u308c\u3066\u3044\u307e\u3057\u305f\u3002",
    tags: ["\u96d1\u5b66", "\u98df\u3079\u7269", "\u6b74\u53f2"],
  },
  {
    title: "\u4e00\u5186\u7389\u306f\u6c34\u306b\u6d6e\u304f\u3053\u3068\u304c\u3042\u308b",
    content:
      "\u4e00\u5186\u7389\u306f\u30a2\u30eb\u30df\u30cb\u30a6\u30e0\u88fd\u3067\u3068\u3066\u3082\u8efd\u304f\u3001\u6c34\u9762\u306b\u305d\u3063\u3068\u7f6e\u304f\u3068\u8868\u9762\u5f35\u529b\u3067\u6d6e\u304f\u3053\u3068\u304c\u3042\u308a\u307e\u3059\u3002\u305f\u3060\u3057\u3001\u6c5a\u308c\u3084\u7f6e\u304d\u65b9\u3067\u3059\u3050\u6c88\u3080\u3053\u3068\u3082\u3042\u308a\u307e\u3059\u3002",
    tags: ["\u96d1\u5b66", "\u304a\u91d1", "\u79d1\u5b66"],
  },
  {
    title: "\u30a8\u30d9\u30ec\u30b9\u30c8\u306f\u5c11\u3057\u305a\u3064\u9ad8\u304f\u306a\u3063\u3066\u3044\u308b",
    content:
      "\u30a4\u30f3\u30c9\u30d7\u30ec\u30fc\u30c8\u3068\u30e6\u30fc\u30e9\u30b7\u30a2\u30d7\u30ec\u30fc\u30c8\u304c\u62bc\u3057\u5408\u3046\u3053\u3068\u3067\u3001\u30d2\u30de\u30e9\u30e4\u5c71\u8108\u306f\u308f\u305a\u304b\u306b\u9686\u8d77\u3057\u7d9a\u3051\u3066\u3044\u307e\u3059\u3002\u5730\u7403\u306f\u610f\u5916\u3068\u52d5\u3044\u3066\u3044\u307e\u3059\u3002",
    tags: ["\u96d1\u5b66", "\u5730\u7406", "\u5730\u7403"],
  },
  {
    title: "\u30b7\u30ed\u30af\u30de\u306e\u6bdb\u306f\u900f\u660e",
    content:
      "\u30b7\u30ed\u30af\u30de\u306e\u6bdb\u306f\u767d\u3044\u8272\u304c\u3064\u3044\u3066\u3044\u308b\u308f\u3051\u3067\u306f\u306a\u304f\u3001\u4e00\u672c\u4e00\u672c\u306f\u307b\u307c\u900f\u660e\u3067\u3059\u3002\u5149\u306e\u6563\u4e71\u306b\u3088\u3063\u3066\u767d\u304f\u898b\u3048\u307e\u3059\u3002",
    tags: ["\u96d1\u5b66", "\u52d5\u7269", "\u81ea\u7136"],
  },
  {
    title: "\u30aa\u30bb\u30ed\u306f\u65e5\u672c\u751f\u307e\u308c",
    content:
      "\u30aa\u30bb\u30ed\u306f\u65e5\u672c\u3067\u751f\u307e\u308c\u305f\u30dc\u30fc\u30c9\u30b2\u30fc\u30e0\u3067\u3059\u3002\u30eb\u30fc\u30eb\u306f\u30b7\u30f3\u30d7\u30eb\u3067\u3059\u304c\u3001\u5c55\u958b\u306f\u5965\u6df1\u304f\u3001\u4e16\u754c\u4e2d\u3067\u904a\u3070\u308c\u3066\u3044\u307e\u3059\u3002",
    tags: ["\u96d1\u5b66", "\u30b2\u30fc\u30e0", "\u65e5\u672c"],
  },
  {
    title: "\u8679\u306f\u672c\u5f53\u306f\u5186",
    content:
      "\u5730\u4e0a\u304b\u3089\u898b\u308b\u8679\u306f\u534a\u5186\u306b\u898b\u3048\u307e\u3059\u304c\u3001\u6761\u4ef6\u304c\u5408\u3048\u3070\u7a7a\u304b\u3089\u306f\u5186\u306b\u898b\u3048\u308b\u3053\u3068\u304c\u3042\u308a\u307e\u3059\u3002\u666e\u6bb5\u306f\u5730\u9762\u3067\u4e0b\u534a\u5206\u304c\u96a0\u308c\u3066\u3044\u308b\u3060\u3051\u3067\u3059\u3002",
    tags: ["\u96d1\u5b66", "\u5929\u6c17", "\u81ea\u7136"],
  },
  {
    title: "\u30d1\u30a4\u30ca\u30c3\u30d7\u30eb\u306f\u677e\u307c\u3063\u304f\u308a\u3063\u307d\u3044\u679c\u7269",
    content:
      "\u82f1\u8a9e\u306e pineapple \u306f\u3001\u677e\u307c\u3063\u304f\u308a\u306b\u4f3c\u305f\u898b\u305f\u76ee\u304b\u3089\u540d\u524d\u304c\u3064\u3044\u305f\u3068\u3055\u308c\u3066\u3044\u307e\u3059\u3002\u5b9f\u306f\u5c0f\u3055\u306a\u679c\u5b9f\u304c\u591a\u6570\u96c6\u307e\u3063\u305f\u3082\u306e\u3067\u3059\u3002",
    tags: ["\u96d1\u5b66", "\u98df\u3079\u7269", "\u8a00\u8449"],
  },
];

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = useState(initialNotes[0].id);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [titleFocusRequest, setTitleFocusRequest] = useState(0);

  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);

    if (savedNotes) {
      const parsedNotes = parseSavedNotes(savedNotes);

      if (parsedNotes) {
        setNotes(parsedNotes);
        setSelectedNoteId(parsedNotes[0].id);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    setSaveStatus("saving");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));

    const timerId = window.setTimeout(() => {
      setSaveStatus("saved");
    }, 300);

    return () => window.clearTimeout(timerId);
  }, [isLoaded, notes]);

  const selectedNote =
    notes.find((note) => note.id === selectedNoteId) ??
    notes[0] ??
    initialNotes[0];

  function createNote() {
    const today = getTodayText();
    const newNote: Note = {
      id: createNoteId(),
      title: "",
      content: "",
      tags: [],
      createdAt: today,
      updatedAt: today,
      isPinned: false,
    };

    setNotes((currentNotes) => [newNote, ...currentNotes]);
    setSelectedNoteId(newNote.id);
    setTitleFocusRequest((currentValue) => currentValue + 1);
  }

  function createLongTestNote() {
    const today = getTodayText();
    const newNote: Note = {
      id: createNoteId(),
      title: "\u9577\u6587\u30c6\u30b9\u30c8\u30e1\u30e2",
      content: longTestNoteContent,
      tags: ["\u30c6\u30b9\u30c8", "UI\u78ba\u8a8d", "\u9577\u6587"],
      createdAt: today,
      updatedAt: today,
      isPinned: false,
    };

    setNotes((currentNotes) => [newNote, ...currentNotes]);
    setSelectedNoteId(newNote.id);
  }

  function createMarkdownTestNote() {
    const today = getTodayText();
    const newNote: Note = {
      id: createNoteId(),
      title: "Markdown \u30b7\u30e7\u30fc\u30c8\u30ab\u30c3\u30c8\u30c6\u30b9\u30c8",
      content: markdownTestNoteContent,
      tags: ["Markdown", "\u30c6\u30b9\u30c8"],
      createdAt: today,
      updatedAt: today,
      isPinned: false,
    };

    setNotes((currentNotes) => [newNote, ...currentNotes]);
    setSelectedNoteId(newNote.id);
  }

  function createSampleNotes() {
    const today = getTodayText();
    const newNotes = sampleNotes.map((sampleNote) => ({
      id: createNoteId(),
      title: sampleNote.title,
      content: sampleNote.content,
      tags: sampleNote.tags,
      createdAt: today,
      updatedAt: today,
      isPinned: false,
    }));

    setNotes((currentNotes) => [...newNotes, ...currentNotes]);
    setSelectedNoteId(newNotes[0].id);
  }

  function updateSelectedNote(field: NoteField, value: string) {
    setNotes((currentNotes) =>
      currentNotes.map((note) => {
        if (note.id !== selectedNoteId) {
          return note;
        }

        return {
          ...note,
          [field]: value,
          updatedAt: getTodayText(),
        };
      }),
    );
  }

  function updateSelectedNoteTags(tags: string[]) {
    setNotes((currentNotes) =>
      currentNotes.map((note) => {
        if (note.id !== selectedNoteId) {
          return note;
        }

        return {
          ...note,
          tags,
          updatedAt: getTodayText(),
        };
      }),
    );
  }

  function deleteNote(noteId: string) {
    if (notes.length <= 1) {
      return;
    }

    deleteNotes([noteId]);
  }

  function togglePinnedNote(noteId: string) {
    setNotes((currentNotes) =>
      currentNotes.map((note) => {
        if (note.id !== noteId) {
          return note;
        }

        return {
          ...note,
          isPinned: !note.isPinned,
        };
      }),
    );
  }

  function deleteNotes(noteIds: string[]) {
    const idsToDelete = new Set(noteIds);
    const nextNotes = notes.filter((note) => !idsToDelete.has(note.id));

    if (nextNotes.length === 0) {
      return;
    }

    setNotes(nextNotes);

    // If the open note was deleted, select the first remaining note.
    if (idsToDelete.has(selectedNoteId)) {
      setSelectedNoteId(nextNotes[0].id);
    }
  }

  function resetNotes() {
    const shouldReset = window.confirm(
      "\u521d\u671f\u30e1\u30e2\u306b\u623b\u3057\u307e\u3059\u304b\uff1f",
    );

    if (!shouldReset) {
      return;
    }

    setNotes(initialNotes);
    setSelectedNoteId(initialNotes[0].id);
  }

  return {
    notes,
    saveStatus,
    selectedNote,
    selectedNoteId,
    titleFocusRequest,
    createLongTestNote,
    createMarkdownTestNote,
    createNote,
    createSampleNotes,
    deleteNote,
    deleteNotes,
    resetNotes,
    selectNote: setSelectedNoteId,
    togglePinnedNote,
    updateSelectedNote,
    updateSelectedNoteTags,
  };
}
