"use client";

type ResetConfirmModalProps = {
  description: string;
  isDark: boolean;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
};

export function ResetConfirmModal({ description, isDark, isOpen, onCancel, onConfirm, title }: ResetConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className={`w-full max-w-sm rounded-lg border p-5 shadow-xl ${isDark ? "border-[#333333] bg-[#252525] text-[#ededed]" : "border-[#e4e1dc] bg-[#fbfaf8] text-[#2f2f2f]"}`}>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className={`mt-2 text-sm leading-6 ${isDark ? "text-[#bdbdbd]" : "text-[#6f6a62]"}`}>{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className={`rounded-md border px-3 py-2 text-sm transition ${isDark ? "border-[#3a3a3a] text-[#d6d6d6] hover:bg-[#303030]" : "border-[#ded9d1] text-[#5f5a52] hover:bg-[#eee9e1]"}`}>キャンセル</button>
          <button type="button" onClick={onConfirm} className={`rounded-md border px-3 py-2 text-sm transition ${isDark ? "border-[#5a2f2f] bg-[#3a2525] text-[#f0c9c9] hover:bg-[#4a2c2c]" : "border-[#e2c1b8] bg-[#fff2ef] text-[#9a3f2f] hover:bg-[#ffe8e1]"}`}>初期状態に戻す</button>
        </div>
      </div>
    </div>
  );
}