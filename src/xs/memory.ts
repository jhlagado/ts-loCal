import { MEM_START, MEM_SIZE } from "../constants";
import { putStr } from "../io";
import { Ptr } from "../types";

export const buffer = new ArrayBuffer(MEM_SIZE);
export const mem = new DataView(buffer);

export let asmPtr: Ptr = MEM_START;

const LSB = (value: number) => value & 0xff;

const MSB = (value: number) => (value / 256) & 0xff;

export const setOrigin = (value: Ptr): void => {
  asmPtr = value;
};

export const align16 = (): Ptr => {
  if (asmPtr % 2) asmPtr++;
  return asmPtr;
};

export const def8 = (value: number): Ptr => {
  const result = asmPtr;
  mem.setUint8(asmPtr++, value);
  return result;
};

export const def16 = (value: number): Ptr => {
  const result = asmPtr;
  mem.setUint16(asmPtr, value);
  asmPtr += 2;
  return result;
};

// export const def32 = (value: number): Ptr => {
//   const result = asmPtr;
//   mem.setUint32(asmPtr, value);
//   asmPtr += 4;
//   return result;
// };

export const defPStr = (str: string): Ptr => {
  const result = asmPtr;
  const bytes = new TextEncoder().encode(str);
  const length = bytes.length & 0xff; //only use LSB
  mem.setUint8(asmPtr++, length);
  for (let i = 0; i < length; i++) {
    mem.setUint8(asmPtr++, bytes[i]);
  }
  return result;
};

export const defCStr = (str: string): Ptr => {
  const result = asmPtr;
  const bytes = new TextEncoder().encode(str);
  const { length } = bytes;
  for (let i = 0; i < length; i++) {
    mem.setUint8(asmPtr++, bytes[i]);
  }
  mem.setUint8(asmPtr++, 0);
  return result;
};

export const defSpace = (size: number): Ptr => {
  const result = asmPtr;
  asmPtr += size;
  return result;
};

export const get8 = (offset: number): number => mem.getInt8(offset);

export const set8 = (offset: number, value: number): void => {
  mem.setInt8(offset, value);
};

export const get16 = (offset: number): number => {
  const lsb = mem.getInt8(offset);
  const msb = mem.getInt8(offset + 1);
  return msb * 256 + lsb;
};

export const set16 = (offset: number, value: number): void => {
  const lsb = LSB(value);
  const msb = MSB(value);
  mem.setInt8(offset, lsb);
  mem.setInt8(offset + 1, msb);
};

// export const tget = (offset: number): number => {
//   try {
//     return mem.getInt32(offset + 1);
//   } catch (e) {
//     putStr(`\n\nError: tried to fetch number at address ${offset + 1}\n`);
//     throw e;
//   }
// };

// export const tset = (offset: number, value: number): void => {
//   try {
//     return mem.setInt32(offset + 1, value);
//   } catch (e) {
//     putStr(
//       `\n\nError: tried to store number ${value} at address ${offset + 1}\n`
//     );
//     throw e;
//   }
// };
