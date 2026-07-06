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
  'a-investments://CA?type=sdui_screen&endpoint=v1/invest-main-screen-view/investment-longread/92441%3flocation=AI_MAIN%26campaignCode=OXV_KVIZ_AI%26presentationType=PRESENT',
  'a-investments://CA?type=sdui_screen&endpoint=v1/invest-main-screen-view/investment-longread/92398%3flocation=AI_MAIN%26campaignCode=OXV_KVIZ_AI%26presentationType=PRESENT',
  'a-investments://CA?type=sdui_screen&endpoint=v1/invest-main-screen-view/investment-longread/92472%3flocation=AI_MAIN%26campaignCode=OXV_KVIZ_AI%26presentationType=PRESENT',
  'a-investments://CA?type=sdui_screen&endpoint=v1/invest-main-screen-view/investment-longread/92479%3flocation=AI_MAIN%26campaignCode=OXV_KVIZ_AI%26presentationType=PRESENT',
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
      window.gtag('event', '7680_question_show', {
        question: `q${currentQuestion.id}`,
      });
    }
  }, [currentQuestion, view]);

  useEffect(() => {
    if (view === 'quiz') {
      document.body.style.background = '#FFFFFF';
    } else {
      window.gtag('event', '7680_quiz_show');
      document.body.style.background = 'linear-gradient(169.39deg, #00E8F0 -0.54%, #266FFF 70.32%, #9933FF 100.08%)';
    }
  }, [view]);

  const submit = () => {
    if (finished) {
      window.gtag('event', '7680_result_request');
      const fisrtAnswerIndex = questions[0].options.indexOf(
        answers.find(a => a.questionId === questions[0].id)?.answer || '',
      );
      const link = links[fisrtAnswerIndex] || links[links.length - 1];
      window.location.replace(link);
      return;
    }

    if (isActiveQuestionAnswered) {
      setRightAnswersCount(rightAnswersCount + (draftAnswer?.answer === currentQuestion.answer ? 1 : 0));
      setDraftAnswer(null);
      if (!answers.some(a => a.questionId === currentQuestion.id)) {
        return;
      }
      window.gtag('event', '7680_continue_click', {
        question: `q${currentQuestion.id}`,
        answer: `q${currentQuestion.id}_a${currentQuestion.options.indexOf(answers.find(a => a.questionId === currentQuestion.id)?.answer || '') + 1}`,
      });
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
          Пройди тест и узнай, какой ты
          <br />
          инвестор будущего
        </Typography.Text>
      </div>
      <Gap size={96} />

      <div className={appSt.bottomBtn}>
        <Button
          block
          view="secondary"
          onClick={() => {
            window.gtag('event', '7680_quiz_start');
            setView('quiz');
          }}
          className={appSt.btnWhite}
        >
          Пройти тест
        </Button>
      </div>
    </>
  );
};
