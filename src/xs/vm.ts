import { DSTACK_SIZE, MEM_START, ROM_SIZE, RSTACK_SIZE } from "../constants";
import { asmPtr, def16, defSpace, get16, set16, setOrigin } from "./memory";
import { HEAP_SIZE } from "./constants";
import { getFunc } from "./prims";
import { Action, Cell, ClosureAction, CodeAction, PrimAction, XState } from "./types";

let rom: number;
let ram: number;
let dstack: number;
let rstack: number;
let vars: number;
let here: number;
let heap: number;

export const init = () => {
  setOrigin(MEM_START);
  rom = defSpace(ROM_SIZE);
  ram = asmPtr;
  dstack = defSpace(DSTACK_SIZE);
  rstack = defSpace(RSTACK_SIZE);
  vars = asmPtr;
  here = def16(0);
  heap = defSpace(HEAP_SIZE);
};

export const xs: XState = {
  ip: 0,
  dsp: 0,
  rsp: 0,
  bp: 0,
};

export const dpush = (d: Cell) => {
  set16(xs.dsp++, d);
};

export const dpop = () => {
  return get16(--xs.dsp);
};

export const rpush = (d: Cell) => {
  set16(xs.rsp++, d);
};

export const rpop = () => {
  return get16(--xs.rsp);
};

export const allot = (size: Cell) => {
  let h = get16(here);
  h += size;
  set16(here, h);
};

export const beforeEnterAction = () => {
  rpush(xs.ip); // push ip to rstack
  rpush(xs.bp); // push bp to rstack
  xs.bp = xs.rsp; // point bp at just after old bp
};

export const enterPrim = (prim: PrimAction) => {
  rpush(xs.ip); // push ip to rstack
  rpush(xs.bp); // push bp to rstack
  xs.bp = xs.rsp; // point bp at just after old bp
  let args:number[] = [];
  for (let i = 0; i < prim.numArgs; i++) {
    args.unshift(dpop());
  }
};

export const enterCode = (code: CodeAction) => {
  rpush(xs.ip); // push ip to rstack
  rpush(xs.bp); // push bp to rstack
  xs.bp = xs.rsp; // point bp at just after old bp
  for (const item of code.arr) {
    // push 0 or more args from closure o rstack
    rpush(item);
  }
  const p0 = xs.dsp - code.numArgs; // point p0 to the start of the args on the data stack
  let p = p0;
  for (let i = 0; i < code.numArgs; i++) {
    // transfer numArgs from dstack to rstack
    rpush(dstack[p++]);
  }
  xs.dsp = p0;
  for (let i = 0; i < code.numLocals; i++) {
    // allocate numLocals on rstack, init to 0
    rpush(0);
  }
};

export const enterClosure = (closure: ClosureAction) => {
  beforeEnterAction();
  for (const item of closure.arr) {
    rpush(item);
  }
  enterAction(closure.action, false);
};

export const enterAction = (action: Action, newFrame: boolean) => {
  if (newFrame) {
    rpush(xs.ip); // push ip to rstack
    rpush(xs.bp); // push bp to rstack
    xs.bp = xs.rsp; // point bp at just after old bp
  }
  const cfaFunc = getFunc(action.cfa);
};

export const exitAction = () => {
  xs.rsp = xs.bp;
  xs.bp = rpop();
  xs.ip = rpop();
};

