import { describe, expect, it } from 'vitest';
import { createInitialWorldState } from './worldState';
import { addToShelf, isShelfOverCapacity, removeFromShelf } from './shelf';

function world() {
  return createInitialWorldState({ shelf: ['a', 'b', 'c'], shelfCapacity: 3 });
}

describe('shelf', () => {
  it('容量ちょうどでは超過しない', () => {
    expect(isShelfOverCapacity(world())).toBe(false);
  });

  it('本を加えると容量を超過する', () => {
    const next = addToShelf(world(), 'd');
    expect(next.shelf).toEqual(['a', 'b', 'c', 'd']);
    expect(isShelfOverCapacity(next)).toBe(true);
  });

  it('同じ本は二重に積まない', () => {
    const next = addToShelf(world(), 'a');
    expect(next.shelf).toEqual(['a', 'b', 'c']);
  });

  it('降ろした本は書架から消え erasedBooks に累積する', () => {
    const next = removeFromShelf(world(), 'b');
    expect(next.shelf).toEqual(['a', 'c']);
    expect(next.erasedBooks).toEqual(['b']);
  });

  it('元の state を破壊しない', () => {
    const w = world();
    removeFromShelf(w, 'a');
    addToShelf(w, 'z');
    expect(w.shelf).toEqual(['a', 'b', 'c']);
    expect(w.erasedBooks).toEqual([]);
  });

  it('書架にない本は降ろせない（no-op）', () => {
    const next = removeFromShelf(world(), 'zzz');
    expect(next.shelf).toEqual(['a', 'b', 'c']);
    expect(next.erasedBooks).toEqual([]);
  });
});
