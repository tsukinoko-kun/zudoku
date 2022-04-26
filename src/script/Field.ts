import { Cell } from "./Cell";

export class Field implements Iterable<Cell> {
  private readonly field: Map<string, Cell>;
  private readonly preset: Set<string>;
  private initialValues: Map<[number, number], number>;

  private deadlockCount = 0;
  private deadlockCountCopy = 0;

  constructor(startCount: number = 4) {
    this.field = new Map();
    this.preset = new Set();
    this.initialValues = new Map();

    this.initialize(startCount);
  }

  public get solved(): boolean {
    for (const cell of this) {
      if (cell.length !== 1) {
        return false;
      }
    }
    return true;
  }

  public get deadLock(): boolean {
    for (const cell of this) {
      if (cell.length === 0) {
        this.deadlockCount++;
        this.deadlockCountCopy = this.deadlockCount;
        return true;
      }
    }
    return false;
  }

  public setNextCell() {
    let nextCell: Cell | undefined;

    for (const cell of this) {
      if (cell.length === 1) {
        continue;
      }

      if (nextCell === undefined || cell.length < nextCell.length) {
        nextCell = cell;
      }
    }

    if (nextCell) {
      nextCell.set(undefined, this.deadlockCountCopy--);
      this.removeIllegalNumbers();
    } else {
      throw new Error("No next cell found");
    }
  }

  public removeIllegalNumbers() {
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        const cellData = this.field.get(Cell.id(x, y)!);

        if (!cellData) {
          throw new Error(`Cell [${Cell.id(x, y)}] not found`);
        }

        if (cellData.length === 1) {
          for (let x0 = 0; x0 < 9; x0++) {
            if (x0 === x) {
              continue;
            }

            const cellData0 = this.field.get(Cell.id(x0, y)!);
            if (!cellData0) {
              throw new Error(`Cell [${Cell.id(x0, y)}] not found`);
            }
            cellData0.remove(cellData.value);
          }

          for (let y0 = 0; y0 < 9; y0++) {
            if (y0 === y) {
              continue;
            }

            const cellData0 = this.field.get(Cell.id(x, y0)!);
            if (!cellData0) {
              throw new Error(`Cell [${Cell.id(x, y0)}] not found`);
            }
            cellData0.remove(cellData.value);
          }

          {
            const x0 = Math.floor(x / 3) * 3;
            const y0 = Math.floor(y / 3) * 3;

            for (let x1 = x0; x1 <= x0 + 2; x1++) {
              for (let y1 = y0; y1 <= y0 + 2; y1++) {
                if (x1 === x || y1 === y) {
                  continue;
                }

                const cellData1 = this.field.get(Cell.id(x1, y1)!);
                if (!cellData1) {
                  throw new Error(`Cell [${Cell.id(x1, y1)}] not found`);
                }
                cellData1.remove(cellData.value);
              }
            }
          }
        }
      }
    }
  }

  public initialize(startCount: number = 4) {
    this.field.clear();
    this.preset.clear();
    this.initialValues.clear();

    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const cellData = new Cell(x, y);
        this.field.set(cellData.id, cellData);
      }
    }

    while (this.preset.size < startCount) {
      const x = Math.floor(Math.random() * 9);
      const y = Math.floor(Math.random() * 9);
      const cellData = this.field.get(Cell.id(x, y));
      if (!cellData) {
        throw new Error(`Cell [${Cell.id(x, y)}] not found`);
      }
      cellData.set();
      this.removeIllegalNumbers();
      this.preset.add(cellData.id);
      this.initialValues.set([x, y], cellData.value);
    }
  }

  public reset() {
    this.field.clear();

    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const cellData = new Cell(x, y);
        this.field.set(cellData.id, cellData);
      }
    }

    for (const [cell, value] of this.initialValues) {
      this.field.get(Cell.id(cell[0], cell[1]))?.set(value);
    }
  }

  public isPreset(cellData: Cell): boolean {
    return this.preset.has(cellData.id);
  }

  public *[Symbol.iterator](): IterableIterator<Cell> {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        yield this.field.get(Cell.id(x, y)!)!;
      }
    }
  }
}
