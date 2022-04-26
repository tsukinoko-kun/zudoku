import { Cell } from "./Cell";
import { Field } from "./Field";

const fieldEl = document.getElementById("sudoku-field")!;
const stepDelayEl = document.getElementById("step-delay") as HTMLInputElement;

const field = new Field();
(globalThis as any).field = field;

const getOrCreateCell = (id: string, cellData: Cell) => {
  let cellEl = document.getElementById(id) as HTMLInputElement | null;
  if (!cellEl) {
    cellEl = document.createElement("input");
    cellEl.id = id;
    cellEl.classList.add("cell");
    cellEl.type = "number";
    cellEl.min = "1";
    cellEl.max = "9";
    cellEl.value = cellData.stringValue;
    cellEl.placeholder = cellData.possibleNumbers.join(",");
    fieldEl.appendChild(cellEl);
  }

  return cellEl;
};

const render = () => {
  field.initialize();

  fieldEl.innerHTML = "";

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      const id = Cell.id(x, y);
      const cellData = field.get(x, y);
      if (!cellData) {
        throw new Error(`Cell [${id}] not found`);
      }

      const cellEl = getOrCreateCell(id, cellData);

      const score = 1 - cellData.length / 9;
      cellEl.style.backgroundColor =
        "hsla(" + ((score * 120) | 0) + ", 100%, 50%, 0.2)";

      if (field.isPreset(cellData)) {
        cellEl.classList.add("preset");
      } else {
        cellEl.classList.remove("preset");
      }

      if (cellData.possibleNumbers.length === 1) {
        cellEl.classList.add("solved");
        cellEl.value = cellData.value.toString();
      } else {
        cellEl.classList.remove("solved");
      }

      cellEl.placeholder = cellData.possibleNumbers.join(",");

      fieldEl.appendChild(cellEl);
    }
  }
};

const create = () => {
  field.initialize();

  const presetData = new Map<[number, number], number>();

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      const id = Cell.id(x, y);

      const cellEl = document.getElementById(id) as HTMLInputElement | null;

      if (cellEl && cellEl.value) {
        presetData.set([x, y], cellEl.valueAsNumber);
      }
    }
  }

  field.setPreset(presetData);

  render();
};

create();

const solveStep = () => {
  if (field.deadLock) {
    console.log("Dead Lock");
    field.reset();
  }

  field.setNextCell();
  render();
};

const solve = () => {
  const timer = setInterval(() => {
    if (field.solved) {
      clearInterval(timer);
    } else {
      solveStep();
    }
  }, stepDelayEl.valueAsNumber);
};

(globalThis as any).create = create;
(globalThis as any).solve = solve;
(globalThis as any).solveStep = solveStep;
(globalThis as any).reset = () => {
  field.reset();
  render();
};
