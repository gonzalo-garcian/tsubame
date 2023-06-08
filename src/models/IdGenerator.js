export class IdGenerator {
  constructor() {
    if (IdGenerator.instance) {
      return IdGenerator.instance;
    }
    this.id = 1;
    this.host_id = 1;
    this.router_id = 1;
    this.network_id = 1;
    IdGenerator.instance = this;
  }

  generateId() {
    return this.id++;
  }
  generateHostId() {
    console.log(this.host_id);
    return this.host_id++;
  }
  generateRouterId() {
    console.log(this.router_id);
    return this.router_id++;
  }
  generateNetworkId() {
    return this.network_id++;
  }
}
