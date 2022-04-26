export class Cell {
  public readonly x: number;
  public readonly y: number;
  public readonly id: `${number};${number}`;
  public readonly possibleNumbers: Array<number>;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.id = Cell.id(x, y);
    this.possibleNumbers = new Array();
    for (let i = 1; i <= 9; i++) {
      this.possibleNumbers.push(i);
    }
  }

  public set(value?: number, index?: number): void {
    if (value !== undefined) {
      this.possibleNumbers.length = 1;
      this.possibleNumbers[0] = value;
    } else if (index !== undefined) {
      const randomEl =
        this.possibleNumbers[Math.max(0, index % this.length)] ??
        this.possibleNumbers[0];
      if (randomEl !== undefined) {
        this.possibleNumbers.length = 1;
        this.possibleNumbers[0] = randomEl;
      } else {
        throw new Error(`Cell [${this.id}] has no possible numbers`);
      }
    } else {
      const randomEl =
        this.possibleNumbers[Math.round(Math.random() * (this.length - 1))] ??
        this.possibleNumbers[0];
      if (randomEl !== undefined) {
        this.possibleNumbers.length = 1;
        this.possibleNumbers[0] = randomEl;
      } else {
        throw new Error(`Cell [${this.id}] has no possible numbers`);
      }
    }
  }

  public get length(): number {
    return this.possibleNumbers.length;
  }

  public get value(): number {
    return this.possibleNumbers[0]!;
  }

  public get stringValue(): string {
    return this.possibleNumbers.length === 1
      ? this.possibleNumbers[0]!.toString()
      : "";
  }

  public set value(value: number) {
    this.set(value);
  }

  public remove(value: number): void {
    const i = this.possibleNumbers.findIndex((x) => x === value);
    if (i !== -1) {
      this.possibleNumbers.splice(i, 1);
    }
  }

  public static id(x: number, y: number): `${number};${number}` {
    return `${x};${y}`;
  }
}
