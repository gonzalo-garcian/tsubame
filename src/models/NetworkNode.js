import crypto from "crypto";
import { IdGenerator } from "@/models/IdGenerator";
export class NetworkNode {
  constructor(type, idString) {
    this.id = new IdGenerator().generateId();
    this.stringId = idString;
    this.type = type;
    this.interfaces = [];
  }

  _generateId() {
    const timestamp = Date.now().toString();
    return crypto.createHash("sha256").update(timestamp).digest("hex");
  }

  addInterface(newInterface) {
    this.interfaces.push(newInterface);
  }
}
