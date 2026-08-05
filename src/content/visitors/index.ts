import type { Visitor, VisitorId } from '../../domain/types';
import { baker } from './ch1-01-baker';
import { sailor } from './ch1-02-sailor';
import { child } from './ch1-03-child';
import { tinker } from './ch1-04-tinker';
import { teacher } from './ch1-05-teacher';
import { oldwoman } from './ch1-06-oldwoman';
import { bakerReturn } from './ch2-01-baker-return';
import { peddler } from './ch2-02-peddler';
import { clerk } from './ch2-03-clerk';
import { antiquarian } from './ch2-04-antiquarian';
import { musician } from './ch2-05-musician';
import { mother } from './ch2-06-mother';
import { teacherReturn } from './ch3-01-teacher-return';
import { sailorReturn } from './ch3-02-sailor-return';
import { antiquarianReturn } from './ch3-03-antiquarian-return';

// 全来訪者を order 順に集約する。
// order 1-6＝第1章、7-12＝第2章、13-＝第3章（再訪＝新顔ゼロ）。

export const allVisitors: Visitor[] = [
  baker,
  sailor,
  child,
  tinker,
  teacher,
  oldwoman,
  bakerReturn,
  peddler,
  clerk,
  antiquarian,
  musician,
  mother,
  teacherReturn,
  sailorReturn,
  antiquarianReturn,
].sort((a, b) => a.order - b.order);

const visitorById = new Map<VisitorId, Visitor>(
  allVisitors.map((v) => [v.id, v]),
);

export function getVisitor(id: VisitorId): Visitor | undefined {
  return visitorById.get(id);
}
