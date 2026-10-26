import { useEffect, useState } from "react";

// -----value changes only after user stops for "delay" ms
export function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // ----wait, then update
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // ----value changed again before time up, cancel old timer
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
