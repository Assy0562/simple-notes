"use client";

type BackToListButtonProps = {
  isDark: boolean;
  onClick: () => void;
};

// メモとToDoで同じ見た目・操作感を使うためのモバイル用戻るボタンです。
export function BackToListButton({ isDark, onClick }: BackToListButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-5 inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium transition md:hidden ${
        isDark
          ? "text-[#c9c9c9] hover:bg-[#2d2d2d] hover:text-[#f1f1f1]"
          : "text-[#5f5a52] hover:bg-[#eee9e1] hover:text-[#37352f]"
      }`}
      aria-label="一覧へ戻る"
    >
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      <span>一覧</span>
    </button>
  );
}