export class Network {
  constructor() {
    this.subscribers = [];
  }

  subscribe(s) {
    this.subscribers.push(s);
  }

  unsubscribe(s) {
    this.subscribers = this.subscribers.filter((node) => node.ip !== s.ip);
  }

  generateNode() {}
}
