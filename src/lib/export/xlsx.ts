import type { ExportSession } from '../../types';
import { answerToCellString } from '../buildSession';

// xlsx is ~600KB minified — load it on demand the first time the user clicks
// "XLSX" so it doesn't bloat the initial PWA shell.
export async function buildXlsx(session: ExportSession): Promise<Blob> {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();

  const sessionRows: (string | number)[][] = [
    ['key', 'value'],
    ['schemaVersion', session.schemaVersion],
    ['participantId', session.participantId],
    ['scenario', session.scenario],
    ['startedAt', session.startedAt],
    ['completedAt', session.completedAt],
    ['userAgent', session.deviceInfo.userAgent],
    ['language', session.deviceInfo.language],
    ['timezone', session.deviceInfo.timezone],
  ];
  const sessionWs = XLSX.utils.aoa_to_sheet(sessionRows);
  sessionWs['!cols'] = [{ wch: 18 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, sessionWs, 'Session');

  const answerRows: (string | number)[][] = [
    [
      'participantId',
      'scenario',
      'questionId',
      'questionText',
      'answerType',
      'answerValue',
    ],
  ];
  for (const a of session.answers) {
    answerRows.push([
      session.participantId,
      session.scenario,
      a.id,
      a.question,
      a.type,
      answerToCellString(a.answer),
    ]);
  }
  const answersWs = XLSX.utils.aoa_to_sheet(answerRows);
  answersWs['!cols'] = [
    { wch: 14 },
    { wch: 14 },
    { wch: 8 },
    { wch: 60 },
    { wch: 14 },
    { wch: 40 },
  ];
  XLSX.utils.book_append_sheet(wb, answersWs, 'Answers');

  const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
