import { newCodeAction } from "./compile";
import { Add, DoAccess, DoLit, DoStore, Power } from "./prims";
import { i16 } from "./types";
import { init } from "./vm";

const execCode = (codeAction: i16) => {};

init();

// square of Hypotenuse
const hypSqr = newCodeAction(
  ["a", "b"],
  ["c"],
  [
    "a",
    DoAccess,
    DoLit,
    2,
    Power,
    "c",
    DoStore,
    "b",
    DoAccess,
    DoLit,
    2,
    Power,
    "c",
    DoAccess,
    Add,
  ]
);

const main = newCodeAction([], [], [DoLit, 3, DoLit, 4, hypSqr]);

execCode(main);
