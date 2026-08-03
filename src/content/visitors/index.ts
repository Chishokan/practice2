import type { Visitor, VisitorId } from '../../domain/types';
import { baker } from './ch1-01-baker';
import { sailor } from './ch1-02-sailor';
import { child } from './ch1-03-child';
import { tinker } from './ch1-04-tinker';
import { teacher } from './ch1-05-teacher';

// 全来訪者を order 順に集約する。

export const allVisitors: Visitor[] = [baker, sailor, child, tinker, teacher].sort(
  (a, b) => a.order - b.order,
);

const visitorById = new Map<VisitorId, Visitor>(
  allVisitors.map((v) => [v.id, v]),
);

export function getVisitor(id: VisitorId): Visitor | undefined {
  return visitorById.get(id);
}
