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

const sampleNotes = [
  {
    title: "\u8cb7\u3044\u7269\u30e1\u30e2",
    content:
      "\u9031\u672b\u306b\u8cb7\u3046\u3082\u306e\u3092\u307e\u3068\u3081\u3066\u304a\u304f\u3002\u725b\u4e73\u3001\u5375\u3001\u30e8\u30fc\u30b0\u30eb\u30c8\u3001\u98df\u30d1\u30f3\u3001\u30b3\u30fc\u30d2\u30fc\u8c46\u3001\u6d17\u5264\u3002\u51b7\u8535\u5eab\u306e\u4e2d\u3092\u78ba\u8a8d\u3057\u3066\u304b\u3089\u51fa\u304b\u3051\u308b\u3002",
    tags: ["\u751f\u6d3b", "\u8cb7\u3044\u7269"],
  },
  {
    title: "JavaScript\u306e\u5fa9\u7fd2",
    content:
      "\u914d\u5217\u306emap\u3001filter\u3001find\u306e\u9055\u3044\u3092\u3082\u3046\u4e00\u5ea6\u6574\u7406\u3059\u308b\u3002filter\u306f\u6761\u4ef6\u306b\u5408\u3046\u8981\u7d20\u3060\u3051\u3092\u6b8b\u3057\u3066\u65b0\u3057\u3044\u914d\u5217\u3092\u4f5c\u308b\u3002",
    tags: ["\u5b66\u7fd2", "JavaScript"],
  },
  {
    title: "UI\u6539\u5584\u30a2\u30a4\u30c7\u30a2",
    content:
      "\u30bf\u30b0\u4e00\u89a7\u304c\u5897\u3048\u305f\u3068\u304d\u306e\u898b\u305f\u76ee\u3092\u78ba\u8a8d\u3059\u308b\u3002\u6298\u308a\u305f\u305f\u307f\u3001\u30af\u30ea\u30a2\u30dc\u30bf\u30f3\u3001\u9078\u629e\u4e2d\u30bf\u30b0\u306e\u898b\u305b\u65b9\u3092\u3082\u3046\u5c11\u3057\u81ea\u7136\u306b\u3067\u304d\u305d\u3046\u3002",
    tags: ["UI\u78ba\u8a8d", "\u30a2\u30a4\u30c7\u30a2"],
  },
  {
    title: "\u8aad\u307f\u305f\u3044\u672c",
    content:
      "\u30d7\u30ed\u30b0\u30e9\u30df\u30f3\u30b0\u306e\u5165\u9580\u66f8\u3060\u3051\u3067\u306a\u304f\u3001\u6587\u7ae0\u8853\u3084\u30c7\u30b6\u30a4\u30f3\u306e\u672c\u3082\u8aad\u307f\u305f\u3044\u3002\u5b66\u7fd2\u30e1\u30e2\u3068\u3057\u3066\u611f\u60f3\u3092\u6b8b\u305b\u308b\u3068\u3088\u3055\u305d\u3046\u3002",
    tags: ["\u8aad\u66f8", "\u5b66\u7fd2"],
  },
  {
    title: "\u4f5c\u696d\u30ed\u30b0",
    content:
      "\u4eca\u65e5\u306f\u30bf\u30b0\u6a5f\u80fd\u306eUI\u3092\u4e2d\u5fc3\u306b\u8abf\u6574\u3057\u305f\u3002\u5165\u529b\u6b04\u3001\u4e00\u89a7\u8868\u793a\u3001\u30d5\u30a3\u30eb\u30bf\u30fc\u306e\u52d5\u304d\u304c\u5c11\u3057\u305a\u3064\u81ea\u7136\u306b\u306a\u3063\u3066\u304d\u305f\u3002",
    tags: ["\u958b\u767a", "\u30ed\u30b0"],
  },
  {
    title: "\u65c5\u884c\u306e\u6301\u3061\u7269",
    content:
      "\u5145\u96fb\u5668\u3001\u30e2\u30d0\u30a4\u30eb\u30d0\u30c3\u30c6\u30ea\u30fc\u3001\u30a4\u30e4\u30db\u30f3\u3001\u6298\u308a\u305f\u305f\u307f\u5098\u3001\u5e38\u5099\u85ac\u3001\u8eab\u5206\u8a3c\u3002\u524d\u65e5\u306e\u591c\u306b\u307e\u3068\u3081\u3066\u78ba\u8a8d\u3059\u308b\u3002",
    tags: ["\u751f\u6d3b", "\u65c5\u884c"],
  },
  {
    title: "\u671d\u306e\u30eb\u30fc\u30c6\u30a3\u30f3",
    content:
      "\u8d77\u304d\u305f\u3089\u6c34\u3092\u98f2\u3080\u3002\u8efd\u304f\u30b9\u30c8\u30ec\u30c3\u30c1\u3059\u308b\u3002\u4eca\u65e5\u3084\u308b\u3053\u3068\u30923\u3064\u3060\u3051\u30e1\u30e2\u3059\u308b\u3002\u7121\u7406\u306b\u8a70\u3081\u8fbc\u307f\u3059\u304e\u306a\u3044\u3002",
    tags: ["\u751f\u6d3b", "\u7fd2\u6163"],
  },
  {
    title: "Next.js\u30e1\u30e2",
    content:
      "App Router\u3067\u306fapp\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u3092\u4e2d\u5fc3\u306b\u753b\u9762\u3092\u4f5c\u308b\u3002\u307e\u305a\u306fpage.tsx\u3092\u7406\u89e3\u3057\u3066\u3001\u5fc5\u8981\u306b\u306a\u3063\u305f\u3089\u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u3092\u5206\u3051\u308b\u3002",
    tags: ["Next.js", "\u5b66\u7fd2", "\u958b\u767a"],
  },
  {
    title: "\u30c7\u30b6\u30a4\u30f3\u89b3\u5bdf",
    content:
      "Notion\u98a8\u306e\u753b\u9762\u306f\u4f59\u767d\u3068\u6587\u5b57\u30b5\u30a4\u30ba\u306e\u30d0\u30e9\u30f3\u30b9\u304c\u5927\u4e8b\u3002\u88c5\u98fe\u3092\u5897\u3084\u3059\u3088\u308a\u3001\u8ff7\u308f\u305a\u66f8\u3051\u308b\u3053\u3068\u3092\u512a\u5148\u3057\u305f\u3044\u3002",
    tags: ["\u30c7\u30b6\u30a4\u30f3", "UI\u78ba\u8a8d"],
  },
  {
    title: "\u3042\u3068\u3067\u8a66\u3059\u3053\u3068",
    content:
      "\u30e1\u30e2\u306e\u4e26\u3073\u66ff\u3048\u3001\u30bf\u30b0\u306e\u8272\u5206\u3051\u3001\u691c\u7d22\u7d50\u679c\u4ef6\u6570\u306e\u8868\u793a\u3001\u524a\u9664\u524d\u306e\u78ba\u8a8dUI\u306a\u3069\u3092\u5c11\u3057\u305a\u3064\u8a66\u3057\u3066\u307f\u305f\u3044\u3002",
    tags: ["\u30a2\u30a4\u30c7\u30a2", "\u958b\u767a"],
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
    createNote,
    createSampleNotes,
    deleteNote,
    deleteNotes,
    resetNotes,
    selectNote: setSelectedNoteId,
    updateSelectedNote,
    updateSelectedNoteTags,
  };
}
