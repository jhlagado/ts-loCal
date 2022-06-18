// import 'regenerator-runtime/runtime';
import { inputBuffer, outputBuffer, setOutputBuffer } from "./io";
import { interpReset, interpret } from "./interpreter";
import { escapeHTML } from "./utils";
import { initListeners, log, setPrompt } from "./dom";

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
setPrompt(getPrompt());

const loop2 = async () => {
  const oldPrompt = getPrompt();
  const oldInputBuffer = inputBuffer;
  if (await interpret()) {
    log(`${oldPrompt} ${escapeHTML(oldInputBuffer)}`);
    setPrompt(getPrompt());
  }
  setTimeout(loop2);
};
loop2();
