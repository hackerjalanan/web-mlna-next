export type Lang = "id" | "en";

export type Rec = {
  word: string;
  typed: string;
  ok: boolean;
  wrong: number;
  errAt: number | null;
};

export type Sample = {
  t: number;
  kpm: number;
  acc: number;
};

export type Mark = {
  t: number;
  word: string;
  typed: string;
  ok: boolean;
  wrong: number;
};

export type Result = {
  id: string;
  kpm: number;
  cpm: number;
  acc: number;
  errors: number;
  okWords: number;
  badWords: number;
  lang: Lang;
  dur: number;
  date: string;
  marks: Mark[];
  samples: Sample[];
};
