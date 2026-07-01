import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const bottomBtn = style({
  position: 'fixed',
  zIndex: 2,
  width: '100%',
  padding: '12px',
  bottom: 0,
});

const container = style({
  display: 'flex',
  padding: '1rem',
  flexDirection: 'column',
  gap: '1rem',
});

const btnWhite = style({
  backgroundColor: '#FFFFFF',
});
const btnQuiz = style({
  backgroundColor: '#9933FF',
});

const steps = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  margin: '2rem 0 1rem',
  width: '100%',
  justifyContent: 'center',
});

const step = recipe({
  base: {
    width: '100%',
    maxWidth: '64px',
    height: '4px',
    borderRadius: '100px',
    backgroundColor: '#DCDCDD',
    transition: 'all 0.3s ease-in-out',
  },
  variants: {
    active: {
      true: {
        backgroundColor: '#9933FF',
      },
    },
  },
});

const cellOption = recipe({
  base: {
    backgroundColor: '#EEEEFB8C',
    border: '1px solid transparent',
    borderRadius: '12px',
    padding: '12px',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    height: '72px',
  },
  variants: {
    selected: {
      true: {
        borderColor: '#7A63F1',
        backgroundColor: '#EEEDFF',
      },
    },
  },
});

export const appSt = {
  bottomBtn,
  container,
  cellOption,
  btnWhite,
  btnQuiz,
  steps,
  step,
};
