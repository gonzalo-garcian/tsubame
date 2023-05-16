import crypto from "crypto";
import {IdGenerator} from "@/composables/IdGenerator";

export class Network {
  constructor() {
    this.id = new IdGenerator().generateId();
    this.nodeInterfaces = [];
  }

  _generateId() {
    const timestamp = Date.now().toString();
    return crypto.createHash("sha256").update(timestamp).digest("hex");
  }

  /*getAllGateways() {
    const nodeInterfaces = Object.entries(this.nodeInterfaces);
    let gateways = [];

    for (let [interfaceId, nodeRef] of nodeInterfaces) {
      if (nodeRef.type === "router") {
        gateways.push([interfaceId, nodeRef]);
      }
    }

    return gateways;
  }*/

  addNodeInterface(interfaceRef) {
    this.nodeInterfaces.push(interfaceRef);
  }

  removeNodeInterface(interfaceId) {
    delete this.nodeInterfaces.filter(
      (interfaceRef) => interfaceRef.id !== interfaceId
    );
  }
}
