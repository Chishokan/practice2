import type { Visitor, VisitorId } from '../../domain/types';
import { baker } from './ch1-01-baker';
import { sailor } from './ch1-02-sailor';
import { child } from './ch1-03-child';
import { tinker } from './ch1-04-tinker';
import { teacher } from './ch1-05-teacher';
import { oldwoman } from './ch1-06-oldwoman';
import { bakerReturn } from './ch2-01-baker-return';
import { peddler } from './ch2-02-peddler';

// 全来訪者を order 順に集約する。
// order 1-6＝第1章、7以降＝第2章（章境界の演出は Phase 6）。

export const allVisitors: Visitor[] = [
  baker,
  sailor,
  child,
  tinker,
  teacher,
  oldwoman,
  bakerReturn,
  peddler,
].sort((a, b) => a.order - b.order);

const visitorById = new Map<VisitorId, Visitor>(
  allVisitors.map((v) => [v.id, v]),
);

export function getVisitor(id: VisitorId): Visitor | undefined {
  return visitorById.get(id);
}
