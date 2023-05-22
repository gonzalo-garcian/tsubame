import { defineStore } from "pinia";

export let useTopologyStore = defineStore("topology", {
  state() {
    return {
      networks: [],
      connections: [],
      nodes: [],
    };
  },
  actions: {
    addConnection(
      shapeEth,
      instanceEth,
      connectedNetwork,
      networkInstance,
      line
    ) {
      this.connections.push({
        from: shapeEth,
        instanceEth: instanceEth,
        to: connectedNetwork,
        networkInstance: networkInstance,
        line: line,
      });
    },
    addNetwork(shape, network) {
      this.networks.push({ shapeNetwork: shape, instanceNetwork: network });
    },
    addNode(shape, node) {
      this.nodes.push({ shapeNode: shape, instanceNode: node });
    },
    updateConnections() {
      this.connections.forEach((connection) => {
        connection.line.points(
          this.getConnectorPoints(
            connection.from.position(),
            connection.to.position()
          )
        );
      });
    },
    connectionExists(newConnection) {
      let exists = false;
      this.connections.forEach((connection) => {
        if (newConnection.from._id === connection.from._id) {
          exists = true;
        }
      });
      return exists;
    },
    removeConnection(fromId) {
      this.connections = this.connections.filter(function (connection) {
        return connection.from._id !== fromId;
      });
    },
    getConnectorPoints(from, to, FromRadius = 20, ToRadius = 80) {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      let angle = Math.atan2(-dy, dx);

      return [
        from.x + -FromRadius * Math.cos(angle + Math.PI),
        from.y + FromRadius * Math.sin(angle + Math.PI),
        to.x + -ToRadius * Math.cos(angle),
        to.y + ToRadius * Math.sin(angle),
      ];
    },
  },
});
