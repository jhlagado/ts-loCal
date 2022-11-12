// Code is of the form
// byte8, byte8, ... etc.
// if the least significatnt bit is 0 then it is the LSB of an address
// which is 2 byte aligned, the following byte is the MSB
// a ctually we don't need to use intel byte order but then makes
// assemblers defines easier

export type i8 = number;
export type i16 = number;
export type Ptr = i16;
export type Cell = Ptr | i16;

export interface XState {
  // run: boolean;
  // oldHere: number;

  ip: number;
  dsp: Ptr;
  rsp: Ptr;
  bp: Ptr;
}

export interface Action {
  cfa: number;
  numArgs: number;
}

export interface CodeAction extends Action {
  numLocals: number;
  arr: Cell[];
}

export interface PrimAction extends Action {}

export interface ClosureAction extends Action {
  arr: Cell[];
  action: Action;
}

export interface Address extends Action {
  arr: Cell[];
}

export interface Value extends Action {
  arr: Cell[];
}

export interface Header {
  name: string;
  backlink: Header | null;
  action: Action;
}

export type NameRef = string;

export type CodeRef = number;
