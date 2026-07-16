import { Button } from '@alfalab/core-components/button/cssm';
import { Gap } from '@alfalab/core-components/gap/cssm';
import { PureCell } from '@alfalab/core-components/pure-cell/cssm';
import { Radio } from '@alfalab/core-components/radio/cssm';
import { Typography } from '@alfalab/core-components/typography/cssm';
import { useEffect, useState } from 'react';
import hb from './assets/hb.png';
import { CountdownProgress } from './components/CountdownProgress';
import { LS, LSKeys } from './ls';
import { appSt } from './style.css';

const questions = [
  {
    id: 1,
    question: 'Акций какой компании больше всего в портфелях россиян?',
    options: ['Яндекс', 'Сбер', 'ВТБ', 'Газпром'],
    answer: 'Сбер',
  },
  {
    id: 2,
    question: 'Чем торговал герой Леонардо ди Каприо в фильме «Волк с Уолл-Стрит»?',
    options: ['акциями дешёвых компаний', 'гособлигациями', 'нефтью', 'недвижимостью'],
    answer: 'акциями дешёвых компаний',
  },
  {
    id: 3,
    question: 'Какого индекса не существует?',
    options: ['S&P 500', 'MOEX', 'SUPER 100', 'Dow Jones'],
    answer: 'SUPER 100',
  },
];

const links = [
  'alfabank://longread?endpoint=v1/adviser/longreads/129870&utm_source=crm_am_publication&utm_medium=mon_pas&utm_campaign=ENG_VICTMIL&utm_term=ba&utm_content=collection_buy',
  'alfabank://longread?endpoint=v1/adviser/longreads/129872&utm_source=crm_am_publication&utm_medium=mon_pas&utm_campaign=ENG_VICTMIL&utm_term=ba&utm_content=collection_buy',
  'alfabank://longread?endpoint=v1/adviser/longreads/129873&utm_source=crm_am_publication&utm_medium=mon_pas&utm_campaign=ENG_VICTMIL&utm_term=ba&utm_content=collection_buy',
  'alfabank://longread?endpoint=v1/adviser/longreads/129875&utm_source=crm_am_publication&utm_medium=mon_pas&utm_campaign=ENG_VICTMIL&utm_term=ba&utm_content=collection_buy',
];

const QUESTION_TIME_MS = 30 * 1000;

export const App = () => {
  const [view, setView] = useState<'start' | 'quiz'>('start');
  const [draftAnswer, setDraftAnswer] = useState<{ questionId: number; answer: string } | null>(null);
  const [answers, setAnswers] = useState<{ questionId: number; answer: string }[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rightAnswersCount, setRightAnswersCount] = useState(0);

  const currentQuestion = questions[activeIndex];
  const finished = answers.length === questions.length;
  const isActiveQuestionAnswered = answers.some(a => a.questionId === currentQuestion?.id);

  useEffect(() => {
    if (!LS.getItem(LSKeys.UserId, null)) {
      LS.setItem(LSKeys.UserId, Date.now());
    }
  }, []);
  useEffect(() => {
    if (currentQuestion && view === 'quiz') {
      window.gtag('event', '7680_question_impression', { var: 'var1', dimension_1: currentQuestion.question });
    }
  }, [currentQuestion, view]);

  useEffect(() => {
    if (view === 'quiz') {
      document.body.style.background = '#FFFFFF';
    } else {
      window.gtag('event', '7680_landing_impression', { var: 'var1' });
      document.body.style.background = 'linear-gradient(169.39deg, #00E8F0 -0.54%, #266FFF 70.32%, #9933FF 100.08%)';
    }
  }, [view]);

  const submit = () => {
    if (finished) {
      const link = links[rightAnswersCount] || links[links.length - 1];
      window.location.replace(link);
      return;
    }

    if (isActiveQuestionAnswered) {
      if (!answers.some(a => a.questionId === currentQuestion.id)) {
        return;
      }
      /**
       * dimension_1: текст вопроса
dimension_2: выбранный ответ
dimension_3: правильно ли выбран ответ
dimension_4: вышло ли время
dimension_5: количество набранных очков (сколько раз ответил правильно) 

       */
      window.gtag('event', '7680_continue_click', {
        var: 'var1',
        dimension_1: currentQuestion.question,
        dimension_2: draftAnswer?.answer || '',
        dimension_3: draftAnswer?.answer === currentQuestion.answer ? 'Да' : 'Нет',
        dimension_4: isActiveQuestionAnswered ? 'Нет' : 'Да',
        dimension_5: String(rightAnswersCount),
      });
      setDraftAnswer(null);

      setActiveIndex(index => index + 1);
    } else {
      if (!draftAnswer) {
        return;
      }

      setAnswers(
        answers.some(a => a.questionId === currentQuestion.id)
          ? answers.map(a =>
              a.questionId === currentQuestion.id
                ? {
                    questionId: currentQuestion.id,
                    answer: draftAnswer?.answer || '',
                  }
                : a,
            )
          : [
              ...answers,
              {
                questionId: currentQuestion.id,
                answer: draftAnswer?.answer || '',
              },
            ],
      );
      setRightAnswersCount(rightAnswersCount + (draftAnswer?.answer === currentQuestion.answer ? 1 : 0));
    }
  };

  if (view === 'quiz') {
    if (!currentQuestion) {
      return null;
    }
    return (
      <>
        <div className={appSt.container}>
          <div className={appSt.steps}>
            {questions.map((q, index) => (
              <div key={q.id} className={appSt.step({ active: activeIndex >= index })} />
            ))}
          </div>

          <CountdownProgress
            key={currentQuestion.id}
            durationMs={QUESTION_TIME_MS}
            isRunning={!isActiveQuestionAnswered}
            onComplete={() => {
              // just set active question as answered
              setAnswers(
                answers.some(a => a.questionId === currentQuestion.id)
                  ? answers.map(a =>
                      a.questionId === currentQuestion.id
                        ? {
                            questionId: currentQuestion.id,
                            answer: draftAnswer?.answer || '',
                          }
                        : a,
                    )
                  : [
                      ...answers,
                      {
                        questionId: currentQuestion.id,
                        answer: draftAnswer?.answer || '',
                      },
                    ],
              );
              setRightAnswersCount(rightAnswersCount + (draftAnswer?.answer === currentQuestion.answer ? 1 : 0));
            }}
          />

          <Typography.TitleResponsive tag="h1" view="large" weight="bold">
            {currentQuestion.question}
          </Typography.TitleResponsive>

          {currentQuestion.options.map((option, index) => (
            <PureCell
              key={index}
              onClick={() => {
                if (isActiveQuestionAnswered) {
                  return;
                }
                setDraftAnswer({ questionId: currentQuestion.id, answer: option });
              }}
              className={appSt.cellOption({
                selected: draftAnswer?.questionId === currentQuestion.id && draftAnswer?.answer === option,
                wrong: isActiveQuestionAnswered && currentQuestion.answer !== option && draftAnswer?.answer === option,
                right: isActiveQuestionAnswered && currentQuestion.answer === option,
              })}
            >
              <PureCell.Graphics verticalAlign="center">
                <Radio
                  size={24}
                  checked={draftAnswer?.questionId === currentQuestion.id && draftAnswer?.answer === option}
                />
              </PureCell.Graphics>
              <PureCell.Content>
                <PureCell.Main>
                  <Typography.Text view="primary-medium">{option}</Typography.Text>
                </PureCell.Main>
              </PureCell.Content>
            </PureCell>
          ))}
        </div>
        <div className={appSt.bottomBtn}>
          <Button block view="primary" onClick={submit} className={appSt.btnQuiz}>
            {isActiveQuestionAnswered ? 'Продолжить' : 'Подтвердить'}
          </Button>
        </div>
      </>
    );
  }
  return (
    <>
      <div className={appSt.container}>
        <img src={hb} alt="hb" width="100%" height={489} style={{ objectFit: 'contain', margin: '1rem auto 0' }} />

        <Typography.Text color="primary-inverted" view="primary-medium" style={{ textAlign: 'center' }}>
          Проверьте свои знания
          <br />в викторине для инвесторов
        </Typography.Text>
      </div>
      <Gap size={96} />

      <div className={appSt.bottomBtn}>
        <Button
          block
          view="secondary"
          onClick={() => {
            window.gtag('event', '7680_start_click', { var: 'var1' });
            setView('quiz');
          }}
          className={appSt.btnWhite}
        >
          Сыграть
        </Button>
      </div>
    </>
  );
};
