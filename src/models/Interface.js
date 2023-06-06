import crypto from "crypto";
import { IdGenerator } from "@/models/IdGenerator";

export class Interface {
  static DIRECTIONS = {
    RIGHT: 0,
    DOWN: 1,
    LEFT: 2,
    UP: 3,
  };
  constructor(network = null, father, direction) {
    this.internetProtocolAddress = "0.0.0.0";
    this.mediaAccessControlAddress = new IdGenerator().generateId();
    this.network = network;
    this.father = father;
    this.direction = direction;
  }

  _generateId() {
    const timestamp = Date.now().toString();
    return crypto.createHash("sha256").update(timestamp).digest("hex");
  }
}
