import crypto from "crypto";
import { IdGenerator } from "@/models/IdGenerator";
export class NetworkNode {
  constructor(type) {
    this.id = new IdGenerator().generateId();
    this.stringId =
      type[0].toUpperCase() +
      (type === "host"
        ? new IdGenerator().generateHostId()
        : new IdGenerator().generateRouterId());
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
