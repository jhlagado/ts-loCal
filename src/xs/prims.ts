import { get16 } from "./memory";
import { Cell } from "./types";
import { xs } from "./vm";

const prims: Function[] = [];

export const newPrim = (func: Function) => {
  prims.push(func);
  return prims.length - 1;
};

export const getFunc = (index: number) => prims[index];

export const DoCode = newPrim(() => {});
export const DoClosure = newPrim(() => {});
export const DoAddress = newPrim(() => {});
export const DoAccess = newPrim(() => {});
export const DoStore = newPrim(() => {});
export const DoValue = newPrim(() => {});
export const DoAssign = newPrim(() => {});
export const DoLit = newPrim(() => {
  const d = get16(++xs.ip);
  return [d];
});

export const Add = newPrim((x: Cell, y: Cell) => {
  return [x + y];
});

export const Power = newPrim((x: Cell, y: Cell) => {
  return [x ** y];
});
