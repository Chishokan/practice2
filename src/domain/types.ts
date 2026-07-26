// ゲームルールの型定義。設計書「4. データモデル」に対応する。
// このファイルは React に依存させない（domain/ の規約）。

export type BookId = string;
export type VisitorId = string;
export type FlagId = string;

export interface Book {
  id: BookId;
  title: string;
  author?: string;
  category: 'history' | 'magic' | 'story' | 'record' | 'unknown';
  /** 書架で見える説明。嘘は書かないが、全ては書かない */
  summary: string;
  /** この本が消えた後に、世界に起こること */
  erasureEffects?: ErasureEffect[];
  /** 消えた後にのみ開示される事実。プレイヤーが真相に至る材料 */
  hiddenNote?: string;
  /** 消えると特定の来訪者ルートが封じられる */
  gatesVisitors?: VisitorId[];
}

export interface ErasureEffect {
  /** 街の描写テキストの差し替え、来訪者の記憶欠落、など */
  kind: 'townDescription' | 'visitorAmnesia' | 'ledgerRewrite' | 'searchBlock';
  payload: string;
}

// --- 以下は設計書「4.」の型が参照する補助型。設計書に定義がないため、
//     コンパイルを通すのに必要な最小形として定義する。後フェーズで拡張する。

/**
 * 会話の1単位。Visitor のシーン列を構成する。
 * 表示ロジックは持たせず、データとしてのみ扱う（domain は純粋関数のみ）。
 */
export interface Scene {
  id: string;
  /** 話者。地の文は未指定 */
  speaker?: string;
  text: string;
}

/**
 * 来訪者の登場条件。フラグ・消去済みの本・周回数で制御する。
 * 「消去された本で来訪者ルートが封じられる」機構に必要。
 */
export interface VisitorCondition {
  requiredFlags?: FlagId[];
  forbiddenFlags?: FlagId[];
  /** この周回数以上で登場 */
  minCycle?: number;
  /** これらの本が消去済みであることを要求する */
  requiresErased?: BookId[];
}

/**
 * 貸出台帳の1行。綻び演出（ledgerRewrite）が書き換える対象。
 * 台帳は本作のシグネチャ要素。
 */
export interface LedgerEntry {
  id: string;
  cycle: number;
  visitorId: VisitorId;
  bookId: BookId;
  /** 台帳の備考。綻びで書き換わり得る */
  note?: string;
}

export interface Visitor {
  id: VisitorId;
  displayName: string;
  chapter: 1 | 2 | 3;
  order: number;
  /** 来訪の条件（フラグ／消去済みの本／周回数） */
  conditions?: VisitorCondition;
  scenes: Scene[];
  /** 要望に応え得る本。複数正解を許す */
  acceptableBooks: BookId[];
  /** 本ごとの個別反応。未定義なら generic にフォールバック */
  reactions: Partial<Record<BookId, Scene[]>>;
  genericAcceptScene: Scene[];
  refuseScene: Scene[];
  flagsOnResolve: FlagId[];
}

export interface WorldState {
  cycle: number; // 周回数
  chapter: 1 | 2 | 3;
  shelf: BookId[]; // 書架にある本
  shelfCapacity: number;
  erasedBooks: BookId[]; // 周回を跨いで累積する（重要）
  flags: Set<FlagId>;
  anomalyLevel: number; // 0-4
  ledger: LedgerEntry[]; // 貸出台帳。改変対象
  reputation: number;
  /**
   * 人柄の隠し評価値。案内役が主人公の性格を見る軸（設計書「12.5」）。
   * 不可視・周回永続。トゥルーの意志ゲート（B）に使う。
   */
  conscience: number;

  // --- 綻び演出が書き換える対象。設計書「5.」の実装に必要なため追加する。
  /** 窓外の街の描写。綻びで段階的に簡素化される（townDescription） */
  townText: string;
  /** 存在するのに検索に出さない本（searchBlock）。参照先は必ず実在する本に限る */
  searchBlocked: BookId[];
}
