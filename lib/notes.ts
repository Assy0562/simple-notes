import type { Note } from "@/types/note";

export const STORAGE_KEY = "simple-notion-notes-ja-v1";

export const initialNotes: Note[] = [
  {
    id: "initial-1",
    title: "\u4eca\u65e5\u306e\u30e1\u30e2",
    content:
      "\u307e\u305a\u306f\u5c0f\u3055\u306a\u753b\u9762\u304b\u3089\u4f5c\u308a\u307e\u3059\u3002\n" +
      "\u5de6\u306b\u30e1\u30e2\u4e00\u89a7\u3001\u53f3\u306b\u672c\u6587\u30a8\u30ea\u30a2\u3092\u7f6e\u304d\u307e\u3059\u3002\n" +
      "\u4fdd\u5b58\u6a5f\u80fd\u306f localStorage \u3067\u6271\u3044\u307e\u3059\u3002",
    createdAt: "2026/05/18",
    updatedAt: "2026/05/18",
  },
  {
    id: "initial-2",
    title: "\u5b66\u7fd2\u30e1\u30e2",
    content:
      "Note \u578b\u3092\u5148\u306b\u4f5c\u308b\u3068\u3001\u30e1\u30e2\u304c\u6301\u3064\u60c5\u5831\u304c\u308f\u304b\u308a\u3084\u3059\u304f\u306a\u308a\u307e\u3059\u3002\n" +
      "\u6700\u521d\u306f\u578b\u3092\u5c0f\u3055\u304f\u4fdd\u3064\u3068\u8aad\u307f\u3084\u3059\u3044\u3067\u3059\u3002",
    createdAt: "2026/05/17",
    updatedAt: "2026/05/17",
  },
  {
    id: "initial-3",
    title: "\u30a2\u30a4\u30c7\u30a2",
    content:
      "Notion \u98a8\u306b\u3001\u4f59\u767d\u3092\u5e83\u3081\u306b\u3057\u3066\u843d\u3061\u7740\u3044\u305f\u898b\u305f\u76ee\u306b\u3057\u307e\u3059\u3002",
    createdAt: "2026/05/16",
    updatedAt: "2026/05/16",
  },
];

export function getTodayText() {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getNotePreview(content: string) {
  return content.trim() || "\u307e\u3060\u672c\u6587\u304c\u3042\u308a\u307e\u305b\u3093";
}

export function createNoteId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return String(Date.now());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeNote(value: unknown): Note | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    (typeof value.id !== "string" && typeof value.id !== "number") ||
    typeof value.title !== "string" ||
    typeof value.content !== "string" ||
    typeof value.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    id: String(value.id),
    title: value.title,
    content: value.content,
    createdAt:
      typeof value.createdAt === "string" ? value.createdAt : value.updatedAt,
    updatedAt: value.updatedAt,
  };
}

export function parseSavedNotes(value: string): Note[] | null {
  try {
    const parsedValue = JSON.parse(value) as unknown;

    if (!Array.isArray(parsedValue)) {
      return null;
    }

    const notes = parsedValue
      .map((item) => normalizeNote(item))
      .filter((note): note is Note => note !== null);

    return notes.length > 0 ? notes : null;
  } catch {
    return null;
  }
}
