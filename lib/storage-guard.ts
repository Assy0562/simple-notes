export type StorageProblem = "conflict" | "unavailable" | "unreadable" | null;

type StorageAccess = Pick<Storage, "getItem" | "setItem">;
type WithLock = (action: () => boolean) => Promise<boolean>;

// 比較と保存を同じロック内で行い、同時編集でも先に保存したタブを守ります。
export function createStorageGuard(
  key: string,
  storage: StorageAccess,
  withLock: WithLock,
  onProblem: (problem: Exclude<StorageProblem, null>) => void,
) {
  let expected: string | null | undefined;
  let blocked = false;
  function stop(problem: Exclude<StorageProblem, null>) {
    blocked = true;
    onProblem(problem);
    return false;
  }
  return {
    rejectRead() { stop("unreadable"); },
    read() {
      try {
        expected = storage.getItem(key);
        return expected;
      } catch {
        stop("unavailable");
        return null;
      }
    },
    check() {
      if (blocked || expected === undefined) return;
      try {
        if (storage.getItem(key) !== expected) stop("conflict");
      } catch {
        stop("unavailable");
      }
    },
    async save(value: string) {
      if (blocked || expected === undefined) return false;
      try {
        return await withLock(() => {
          if (blocked) return false;
          if (storage.getItem(key) !== expected) return stop("conflict");
          if (value !== expected) storage.setItem(key, value);
          expected = value;
          return true;
        });
      } catch {
        return stop("unavailable");
      }
    },
  };
}
