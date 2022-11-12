import { NULL } from "../constants";
import { align16, def16, def8 } from "./memory";
import { scopeLookup } from "./scopes";
import { Cell, CodeRef, Ptr, NameRef } from "./types";
import { isCodeRef, isNameRef, lsb, msb } from "./utils";

// Code routines start with an byte with the num arguments followed by an byte containing number of locals
// followed by an array of bytes representing the code
// Code is rpresented by bytes. If the most significant bit is 0 then the byte is a primitive
// if it is 1 then it is followed by a 15 bit word which represents a word aligned 16 bit address (it must be shifted left by one bit)
// can this be handled by a macro in assembly language?
// better: if least significant byte is 0 then assume an address, this suits little endian better
// primitives can be shifted right (unless we decide to word align them) else this byte is the LSB and the next is the MSB
export const newCodeAction = (
  args: string[],
  locals: string[],
  body: (Cell | NameRef | CodeRef)[]
): Ptr => {
  align16();
  const start = def16(args.length);
  def16(locals.length);
  for (const item of body) {
    if (isNameRef(item)) {
      scopeLookup(item);
      return NULL;
    }
    if (isCodeRef(item)) {
      def8(lsb(item)) >> 1;
      def8(msb(item));
    }
    def8(item as number);
  }
  return start;
};
