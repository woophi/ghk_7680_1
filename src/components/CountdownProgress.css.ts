import { style } from '@vanilla-extract/css';

const root = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
});

const track = style({
  width: '100%',
  height: '4px',
  overflow: 'hidden',
  borderRadius: '100px',
  backgroundColor: '#E6E6E6',
});

const fill = style({
  height: '100%',
  borderRadius: 'inherit',
  backgroundColor: '#9933FF',
  transition: 'width 0.25s linear',
});

const time = style({
  width: '35px',
  color: '#9933FF',
  textAlign: 'right',
});

export const countdownProgressSt = {
  root,
  track,
  fill,
  time,
};
