export type Value = number | string | null;

export class Environment {
  private store: Map<string, Value>;

  constructor() {
    this.store = new Map();
  }

  public get(name: string): Value {
    const value = this.store.get(name);
    if (value === undefined) {
      throw new Error(`Variável indefinida: ${name}`);
    }
    return value;
  }

  public set(name: string, value: Value): Value {
    this.store.set(name, value);
    return value;
  }
}