import { useEffect, useMemo, useRef, useState } from 'react';

type UseCountdownParams = {
  durationMs: number;
  onComplete: () => void;
  intervalMs?: number;
  isRunning?: boolean;
};

export const useCountdown = ({
  durationMs,
  onComplete,
  intervalMs = 250,
  isRunning = true,
}: UseCountdownParams) => {
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const callbackRef = useRef(onComplete);
  const completedRef = useRef(false);

  useEffect(() => {
    callbackRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setRemainingMs(durationMs);
    completedRef.current = false;
  }, [durationMs]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const endTime = Date.now() + durationMs;

    const tick = () => {
      const nextRemainingMs = Math.max(endTime - Date.now(), 0);

      setRemainingMs(nextRemainingMs);

      if (nextRemainingMs === 0 && !completedRef.current) {
        completedRef.current = true;
        callbackRef.current();
      }
    };

    tick();

    const intervalId = window.setInterval(tick, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [durationMs, intervalMs, isRunning]);

  const progress = useMemo(() => {
    if (durationMs <= 0) {
      return 0;
    }

    return Math.max(0, Math.min(remainingMs / durationMs, 1));
  }, [durationMs, remainingMs]);

  return {
    remainingMs,
    progress,
    isComplete: remainingMs === 0,
  };
};
