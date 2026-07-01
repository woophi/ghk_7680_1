import { Button } from '@alfalab/core-components/button/cssm';
import { Gap } from '@alfalab/core-components/gap/cssm';
import { PureCell } from '@alfalab/core-components/pure-cell/cssm';
import { Radio } from '@alfalab/core-components/radio/cssm';
import { Typography } from '@alfalab/core-components/typography/cssm';
import { useEffect, useState } from 'react';
import hb from './assets/hb.png';
import { LS, LSKeys } from './ls';
import { appSt } from './style.css';

const questions = [
  {
    id: 1,
    question: 'Какие технологии вас вдохновляют?',
    options: [
      '🤖 Искусственный интеллект и Big Data',
      '🚀 Космос и аэрокосмические компании',
      '🧬 Биотехнологии и медицина будущего',
      '📡 Всё сразу — я за прогресс!',
    ],
  },
  {
    id: 2,
    question: 'Как вы относитесь к новым трендам?',
    options: [
      '🧠 Читаю, изучаю, но действую осторожно',
      '⚡ Слежу за всем и готов пробовать',
      '🚀 Врываюсь первым — люблю быть early adopter',
      '🤷 Пока не в теме, но хочу разобраться',
    ],
  },
  {
    id: 3,
    question: 'Сколько вы готовы инвестировать регулярно?',
    options: [
      '💸 До 3 000 ₽ — по чуть-чуть, но стабильно',
      '💰 3 000–10 000 ₽ — комфортная сумма, без нагрузки на бюджет',
      '🚀 10 000 ₽ и больше — у меня серьёзные планы',
      '🤷 Пока не знаю. Хочу попробовать, а там посмотрим',
    ],
  },
  {
    id: 4,
    question: 'Какой формат инвестирования вам ближе?',
    options: [
      '📦 Готовые технологические фонды',
      '🛠️ Сам выбираю инструменты',
      '🔁 Автоинвестирование — минимальное участие с моей стороны',
      '🤝 Хочу совет от эксперта',
    ],
  },
  {
    id: 5,
    question: 'Что вы ожидаете от своих инвестиций?',
    options: ['🌱 Устойчивый рост', '🚀 Потенциал x2–x3', '💰 Стабильный доход'],
  },
];

const links = [
  'a-investments://CA?type=sdui_screen&endpoint=v1/invest-main-screen-view/investment-longread/92441%3flocation=AI_MAIN%26campaignCode=OXV_KVIZ_AI%26presentationType=PRESENT',
  'a-investments://CA?type=sdui_screen&endpoint=v1/invest-main-screen-view/investment-longread/92398%3flocation=AI_MAIN%26campaignCode=OXV_KVIZ_AI%26presentationType=PRESENT',
  'a-investments://CA?type=sdui_screen&endpoint=v1/invest-main-screen-view/investment-longread/92472%3flocation=AI_MAIN%26campaignCode=OXV_KVIZ_AI%26presentationType=PRESENT',
  'a-investments://CA?type=sdui_screen&endpoint=v1/invest-main-screen-view/investment-longread/92479%3flocation=AI_MAIN%26campaignCode=OXV_KVIZ_AI%26presentationType=PRESENT',
];

export const App = () => {
  const [view, setView] = useState<'start' | 'quiz'>('start');
  const [answers, setAnswers] = useState<{ questionId: number; answer: string }[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const currentQuestion = questions[activeIndex];
  const finished = answers.length === questions.length;

  useEffect(() => {
    if (!LS.getItem(LSKeys.UserId, null)) {
      LS.setItem(LSKeys.UserId, Date.now());
    }
  }, []);
  useEffect(() => {
    if (currentQuestion && view === 'quiz') {
      window.gtag('event', '7307_question_show', {
        question: `q${currentQuestion.id}`,
      });
    }
  }, [currentQuestion, view]);

  useEffect(() => {
    if (view === 'quiz') {
      document.body.style.background = '#FFFFFF';
    } else {
      window.gtag('event', '7307_quiz_show');
      document.body.style.background = 'linear-gradient(172.56deg, #3B0A72 -5.43%, #FDF8BD 40.77%, #08146C 86.97%)';
    }
  }, [view]);

  const submit = () => {
    if (finished) {
      window.gtag('event', '7307_result_request');
      const fisrtAnswerIndex = questions[0].options.indexOf(
        answers.find(a => a.questionId === questions[0].id)?.answer || '',
      );
      const link = links[fisrtAnswerIndex] || links[links.length - 1];
      window.location.replace(link);
      return;
    } else {
      if (!answers.some(a => a.questionId === currentQuestion.id)) {
        return;
      }
      window.gtag('event', '7307_continue_click', {
        question: `q${currentQuestion.id}`,
        answer: `q${currentQuestion.id}_a${currentQuestion.options.indexOf(answers.find(a => a.questionId === currentQuestion.id)?.answer || '') + 1}`,
      });
      setActiveIndex(index => index + 1);
    }
    // sendDataToGA({
    //   autopayments: Number(checked) as 1 | 0,
    //   limit: Number(checked2) as 1 | 0,
    //   limit_sum: limit ?? 0,
    //   insurance: Number(checked3) as 1 | 0,
    //   email: email ? 1 : 0,
    // }).then(() => {
    //   LS.setItem(LSKeys.ShowThx, true);
    //   setThx(true);
    //   setLoading(false);
    // });
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

          <Typography.TitleResponsive tag="h1" view="large" font="system" weight="semibold">
            {currentQuestion.question}
          </Typography.TitleResponsive>

          {currentQuestion.options.map((option, index) => (
            <PureCell
              key={index}
              onClick={() => {
                setAnswers(
                  answers.some(a => a.questionId === currentQuestion.id)
                    ? answers.map(a =>
                        a.questionId === currentQuestion.id
                          ? {
                              questionId: currentQuestion.id,
                              answer: option,
                            }
                          : a,
                      )
                    : [
                        ...answers,
                        {
                          questionId: currentQuestion.id,
                          answer: option,
                        },
                      ],
                );
              }}
              className={appSt.cellOption({
                selected: answers.some(a => a.questionId === currentQuestion.id && a.answer === option),
              })}
            >
              <PureCell.Graphics verticalAlign="center">
                <Radio size={24} checked={answers.some(a => a.questionId === currentQuestion.id && a.answer === option)} />
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
            {finished ? 'Узнать ответ' : 'Продолжить'}
          </Button>
        </div>
      </>
    );
  }
  return (
    <>
      <div className={appSt.container}>
        <img src={hb} alt="hb" width={343} height={379} style={{ objectFit: 'contain', margin: '5rem auto 0' }} />

        <Typography.TitleResponsive
          color="primary-inverted"
          tag="h1"
          view="large"
          font="system"
          weight="semibold"
          style={{ textAlign: 'center' }}
        >
          Добро пожаловать в 2030-й!
        </Typography.TitleResponsive>
        <Typography.Text color="primary-inverted" view="primary-medium" style={{ textAlign: 'center' }}>
          Пройдите квиз и узнайте, какой вы инвестор будущего
        </Typography.Text>
      </div>
      <Gap size={96} />

      <div className={appSt.bottomBtn}>
        <Button
          block
          view="secondary"
          onClick={() => {
            window.gtag('event', '7307_quiz_start');
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
