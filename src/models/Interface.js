import crypto from "crypto";
import { IdGenerator } from "@/models/IdGenerator";

export class Interface {
  constructor(network = null, father) {
    this.internetProtocolAddress = "0.0.0.0";
    this.mediaAccessControlAddress = new IdGenerator().generateId();
    this.network = network;
    this.father = father;
  }

  _generateId() {
    const timestamp = Date.now().toString();
    return crypto.createHash("sha256").update(timestamp).digest("hex");
  }
}
