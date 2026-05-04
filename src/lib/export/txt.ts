import type { ExportSession } from '../../types';
import { answerToCellString } from '../buildSession';

export function buildTxt(session: ExportSession): string {
  const header = [
    'Questionnaire export',
    '====================',
    `Participant ID : ${session.participantId}`,
    `Scenario       : ${session.scenario}`,
    `Started        : ${session.startedAt}`,
    `Completed      : ${session.completedAt}`,
    `Schema version : ${session.schemaVersion}`,
    `User agent     : ${session.deviceInfo.userAgent}`,
    `Language       : ${session.deviceInfo.language}`,
    `Timezone       : ${session.deviceInfo.timezone}`,
    '',
  ].join('\n');

  const body = session.answers
    .map((a, i) => {
      const num = i + 1;
      // Indent multi-line ranking answers under the "A:" label.
      const rendered = answerToCellString(a.answer);
      const indented = rendered.split('\n').join('\n    ');
      return `Q${num}: ${a.question}\nA${num}: ${indented}`;
    })
    .join('\n\n');

  return `${header}\n${body}\n`;
}
