export class IdGenerator {
  constructor() {
    if (IdGenerator.instance) {
      return IdGenerator.instance;
    }
    this.id = 1;
    IdGenerator.instance = this;
  }

  generateId() {
    return this.id++;
  }
}
