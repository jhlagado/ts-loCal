import { inputBuffer, outputBuffer, setOutputBuffer } from "./io";
import { interpReset, interpret } from "./interpreter";
import { escapeHTML } from "./utils";
import { initListeners, log } from "./dom";

initListeners();

export const getPrompt = (): string => {
  return `>`;
};

const loop = () => {
  setTimeout(loop);
  if (outputBuffer.length > 0) {
    log(outputBuffer);
    setOutputBuffer("");
  }
};
loop();

setOutputBuffer("");
log(
  `ts-loCal <a href="https://github.com/jhlagado/ts-loCal"
        target="_blank" 
        title="An implementation of the loCal language in Typescript by John Hardy ">(?)</a>`
);
interpReset();

const loop2 = async () => {
  const oldInputBuffer = inputBuffer;
  if (await interpret()) {
    log(`> ${escapeHTML(oldInputBuffer)}`);
  }
  setTimeout(loop2);
};
loop2();
