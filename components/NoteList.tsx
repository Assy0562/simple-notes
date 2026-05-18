import { getNotePreview } from "@/lib/notes";
import type { Note } from "@/types/note";

type NoteListProps = {
  isDark: boolean;
  notes: Note[];
  selectedNoteId: string;
  canDelete: boolean;
  onDeleteNote: (id: string) => void;
  onSelectNote: (id: string) => void;
};

export function NoteList({
  isDark,
  notes,
  selectedNoteId,
  canDelete,
  onDeleteNote,
  onSelectNote,
}: NoteListProps) {
  return (
    <nav className="space-y-1">
      {notes.map((note) => {
        const isSelected = note.id === selectedNoteId;

        return (
          <div
            key={note.id}
            className={`group flex items-start gap-2 rounded-md px-3 py-2 transition ${
              isSelected
                ? isDark
                  ? "bg-[#2b2b2b]"
                  : "bg-white shadow-sm"
                : isDark
                  ? "hover:bg-[#282828]"
                  : "hover:bg-[#e7e3dd]"
            }`}
          >
            <button
              onClick={() => onSelectNote(note.id)}
              className="min-w-0 flex-1 text-left"
            >
              <span className="block truncate text-sm font-medium">
                {note.title || "\u7121\u984c\u306e\u30e1\u30e2"}
              </span>
              <span
                className={`mt-1 block truncate text-xs ${
                  isDark ? "text-[#9b9b9b]" : "text-[#78746d]"
                }`}
              >
                {getNotePreview(note.content)}
              </span>
            </button>

            <button
              onClick={() => onDeleteNote(note.id)}
              disabled={!canDelete}
              className={`h-6 w-6 rounded text-sm opacity-0 transition disabled:cursor-not-allowed disabled:opacity-30 group-hover:opacity-100 ${
                isDark
                  ? "text-[#9b9b9b] hover:bg-[#3a3a3a] hover:text-[#f1f1f1]"
                  : "text-[#8a857d] hover:bg-[#ddd8d0] hover:text-[#37352f]"
              }`}
              title={
                canDelete
                  ? "\u30e1\u30e2\u3092\u524a\u9664"
                  : "\u30e1\u30e2\u306f\u6700\u4f4e1\u4ef6\u5fc5\u8981\u3067\u3059"
              }
            >
              {"\u00d7"}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
