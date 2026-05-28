"use client";

import { useEffect, useState } from "react";

/**
 * useState that persists to localStorage. SSR-safe: reads from storage on
 * mount, so the initial render uses `initial` and we hydrate after.
 */
export function usePersistedState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // ignore — corrupted entry, fall through to initial
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full / blocked — non-fatal
    }
  }, [key, value]);

  return [value, setValue];
}
