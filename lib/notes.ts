import type { Note } from "@/types/note";

export const STORAGE_KEY = "simple-notion-notes-ja-v1";

export const initialNotes: Note[] = [
  {
    id: "initial-1",
    title: "\u306f\u3058\u3081\u306b",
    content:
      "\u3053\u306e\u30a2\u30d7\u30ea\u306f\u3001\u30d6\u30e9\u30a6\u30b6\u3067\u4f7f\u3048\u308b\u30b7\u30f3\u30d7\u30eb\u306a\u30e1\u30e2\u5e33\u3067\u3059\u3002\n" +
      "\u5de6\u5074\u306e\u30e1\u30e2\u4e00\u89a7\u304b\u3089\u30e1\u30e2\u3092\u9078\u3073\u3001\u53f3\u5074\u3067\u30bf\u30a4\u30c8\u30eb\u3084\u672c\u6587\u3092\u7de8\u96c6\u3067\u304d\u307e\u3059\u3002\n" +
      "\u65b0\u3057\u3044\u30e1\u30e2\u3092\u4f5c\u308b\u3068\u304d\u306f\u3001\u300c+\u65b0\u898f\u30e1\u30e2\u300d\u3092\u62bc\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    tags: ["\u4f7f\u3044\u65b9", "\u57fa\u672c"],
    createdAt: "2026/05/21",
    updatedAt: "2026/05/21",
    isPinned: true,
  },
  {
    id: "initial-2",
    title: "\u691c\u7d22\u3068\u30bf\u30b0",
    content:
      "\u30e1\u30e2\u4e00\u89a7\u306e\u691c\u7d22\u6b04\u3067\u3001\u30bf\u30a4\u30c8\u30eb\u30fb\u672c\u6587\u30fb\u30bf\u30b0\u3092\u307e\u3068\u3081\u3066\u691c\u7d22\u3067\u304d\u307e\u3059\u3002\n" +
      "\u30e1\u30e2\u4e0a\u90e8\u306e\u30bf\u30b0\u5165\u529b\u6b04\u3067\u3001\u300c+\u30bf\u30b0\u3092\u8ffd\u52a0\u300d\u306b\u5165\u529b\u3057\u3066 Enter \u3092\u62bc\u3059\u3068\u30bf\u30b0\u3092\u8ffd\u52a0\u3067\u304d\u307e\u3059\u3002\n" +
      "\u904e\u53bb\u306b\u4f7f\u3063\u305f\u30bf\u30b0\u306f\u5019\u88dc\u3068\u3057\u3066\u518d\u5229\u7528\u3067\u304d\u307e\u3059\u3002",
    tags: ["\u4f7f\u3044\u65b9", "\u30bf\u30b0", "\u691c\u7d22"],
    createdAt: "2026/05/21",
    updatedAt: "2026/05/21",
    isPinned: false,
  },
  {
    id: "initial-3",
    title: "\u4fdd\u5b58\u3068\u6ce8\u610f\u70b9",
    content:
      "\u7de8\u96c6\u3057\u305f\u30e1\u30e2\u306f\u3001\u3053\u306e\u30d6\u30e9\u30a6\u30b6\u306e localStorage \u306b\u81ea\u52d5\u4fdd\u5b58\u3055\u308c\u307e\u3059\u3002\n" +
      "\u30da\u30fc\u30b8\u3092\u518d\u8aad\u307f\u8fbc\u307f\u3057\u3066\u3082\u3001\u540c\u3058\u30d6\u30e9\u30a6\u30b6\u3067\u3042\u308c\u3070\u30e1\u30e2\u306f\u6b8b\u308a\u307e\u3059\u3002\n" +
      "\u5225\u306e\u7aef\u672b\u3084\u5225\u306e\u30d6\u30e9\u30a6\u30b6\u3068\u306f\u540c\u671f\u3055\u308c\u306a\u3044\u306e\u3067\u3001\u516c\u958b\u7248\u3067\u306f\u30c6\u30b9\u30c8\u7528\u306e\u30e1\u30e2\u3068\u3057\u3066\u4f7f\u3063\u3066\u304f\u3060\u3055\u3044\u3002",
    tags: ["\u4f7f\u3044\u65b9", "\u4fdd\u5b58"],
    createdAt: "2026/05/21",
    updatedAt: "2026/05/21",
    isPinned: false,
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
  const plainText = content
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  return plainText || "\u307e\u3060\u672c\u6587\u304c\u3042\u308a\u307e\u305b\u3093";
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

  const tags = Array.isArray(value.tags)
    ? value.tags.filter((tag): tag is string => typeof tag === "string")
    : [];

  return {
    id: String(value.id),
    title: value.title,
    content: value.content,
    tags,
    createdAt:
      typeof value.createdAt === "string" ? value.createdAt : value.updatedAt,
    updatedAt: value.updatedAt,
    isPinned: value.isPinned === true,
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
