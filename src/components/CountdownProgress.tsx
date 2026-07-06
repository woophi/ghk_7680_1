import { Typography } from '@alfalab/core-components/typography/cssm';
import { useCountdown } from '../hooks/useCountdown';
import { countdownProgressSt } from './CountdownProgress.css';

type CountdownProgressProps = {
  durationMs: number;
  onComplete: () => void;
  isRunning?: boolean;
};

const formatRemainingTime = (remainingMs: number) => {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export const CountdownProgress = ({ durationMs, onComplete, isRunning }: CountdownProgressProps) => {
  const { remainingMs, progress } = useCountdown({
    durationMs,
    onComplete,
    isRunning,
  });

  return (
    <div className={countdownProgressSt.root}>
      <div className={countdownProgressSt.track}>
        <div className={countdownProgressSt.fill} style={{ width: `${progress * 100}%` }} />
      </div>
      <Typography.Text className={countdownProgressSt.time} view="primary-small" weight="bold">
        {formatRemainingTime(remainingMs)}
      </Typography.Text>
    </div>
  );
};
