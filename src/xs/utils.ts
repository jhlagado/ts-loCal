import { NameRef, CodeRef } from "./types";

export const isNameRef = (value: string | number): value is NameRef =>
  typeof value === "string";

export const isCodeRef = (value: string | number): value is CodeRef =>
  typeof value === "number" && (value & 1) === 0;

export const lsb = (value: number): number => value & 0xff;
export const msb = (value: number): number => (value >> 8) & 0xff;
