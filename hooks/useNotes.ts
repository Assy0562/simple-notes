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
    notes.find((note) => note.id === selectedNoteId) ?? notes[0] ?? initialNotes[0];

  function createNote() {
    const today = getTodayText();
    const newNote: Note = {
      id: createNoteId(),
      title: "",
      content: "",
      createdAt: today,
      updatedAt: today,
    };

    setNotes((currentNotes) => [newNote, ...currentNotes]);
    setSelectedNoteId(newNote.id);
    setTitleFocusRequest((currentValue) => currentValue + 1);
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

  function deleteNote(noteId: string) {
    if (notes.length <= 1) {
      return;
    }

    const shouldDelete = window.confirm(
      "\u3053\u306e\u30e1\u30e2\u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f",
    );

    if (!shouldDelete) {
      return;
    }

    const nextNotes = notes.filter((note) => note.id !== noteId);

    setNotes(nextNotes);

    // If the deleted note was open, select the first remaining note.
    if (noteId === selectedNoteId) {
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
    createNote,
    deleteNote,
    resetNotes,
    selectNote: setSelectedNoteId,
    updateSelectedNote,
  };
}
