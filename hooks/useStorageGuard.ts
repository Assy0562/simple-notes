"use client";

import { useEffect, useState } from "react";
import { createStorageGuard, type StorageProblem } from "@/lib/storage-guard";

export function useStorageGuard(key: string) {
  const [problem, setProblem] = useState<StorageProblem>(null);
  const [guard] = useState(() => createStorageGuard(
    key,
    {
      getItem: (name) => localStorage.getItem(name),
      setItem: (name, value) => localStorage.setItem(name, value),
    },
    async (action) => {
      // ロックが使えない環境では、安全性を保証できない保存を行いません。
      if (!navigator.locks) throw new Error("Storage lock unavailable");
      return navigator.locks.request(`simple-notes:${key}`, action);
    },
    setProblem,
  ));

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.storageArea === localStorage && (event.key === key || event.key === null)) {
        guard.check();
      }
    }
    function onFocus() { guard.check(); }
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [guard, key]);

  return { guard, problem };
}
