import { Field } from "./Field";

const fieldEl = document.getElementById("sudoku-field")!;
const countGivenEl = document.getElementById("count-given") as HTMLInputElement;

const field = new Field(countGivenEl.valueAsNumber);
(globalThis as any).field = field;

const render = () => {
  fieldEl.innerHTML = "";

  for (const cellData of field) {
    const cellEl = document.createElement("div");
    cellEl.classList.add("cell");
    if (field.isPreset(cellData)) {
      cellEl.classList.add("preset");
    }

    if (cellData.possibleNumbers.length === 1) {
      cellEl.classList.add("solved");
      cellEl.innerText = cellData.possibleNumbers[0]!.toString();
    } else {
      for (const n of cellData.possibleNumbers) {
        const numberEl = document.createElement("span");
        numberEl.classList.add("number");
        numberEl.innerText = n.toString();
        cellEl.appendChild(numberEl);
      }
    }

    fieldEl.appendChild(cellEl);
  }
};

const create = () => {
  field.initialize(countGivenEl.valueAsNumber);
  render();
};

create();

const solveStep = () => {
  if (field.dead) {
    console.log("Dead End");
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
  }, 10);
};

(globalThis as any).create = create;
(globalThis as any).solve = solve;
(globalThis as any).solveStep = solveStep;
(globalThis as any).reset = () => {
  field.reset();
  render();
};
