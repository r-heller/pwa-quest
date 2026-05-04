// Switchboard between question type and concrete component. Keeps the
// Questionnaire page tidy.

import type { AnswerValue, Question } from '../../types';
import { Likert5 } from './Likert5';
import { Stars10 } from './Stars10';
import { SingleSelect } from './SingleSelect';
import { MultiSelect } from './MultiSelect';
import { Slider } from './Slider';
import { YesNoUnsure } from './YesNoUnsure';
import { ShortText } from './ShortText';
import { LongText } from './LongText';
import { Numeric } from './Numeric';
import { Ranking } from './Ranking';

interface Props {
  question: Question;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export function QuestionRenderer({ question, value, onChange }: Props) {
  switch (question.type) {
    case 'likert5':
      return (
        <Likert5
          question={question}
          value={typeof value === 'number' ? value : null}
          onChange={onChange}
        />
      );
    case 'stars10':
      return (
        <Stars10
          question={question}
          value={typeof value === 'number' ? value : null}
          onChange={onChange}
        />
      );
    case 'singleSelect':
      return (
        <SingleSelect
          question={question}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
        />
      );
    case 'multiSelect':
      return (
        <MultiSelect
          question={question}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
        />
      );
    case 'slider': {
      const fallback = Math.round((question.min + question.max) / 2);
      return (
        <Slider
          question={question}
          value={typeof value === 'number' ? value : fallback}
          onChange={onChange}
        />
      );
    }
    case 'yesNoUnsure':
      return (
        <YesNoUnsure
          question={question}
          value={
            value === 'yes' || value === 'no' || value === 'unsure' ? value : ''
          }
          onChange={onChange}
        />
      );
    case 'shortText':
      return (
        <ShortText
          question={question}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
        />
      );
    case 'longText':
      return (
        <LongText
          question={question}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
        />
      );
    case 'numeric':
      return (
        <Numeric
          question={question}
          value={typeof value === 'number' ? value : null}
          onChange={onChange}
        />
      );
    case 'ranking':
      return (
        <Ranking
          question={question}
          value={Array.isArray(value) ? value : [...question.items]}
          onChange={onChange}
        />
      );
  }
}
