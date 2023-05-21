import { defineStore } from "pinia";

function getConnectorPoints(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  let angle = Math.atan2(-dy, dx);

  const FromRadius = 20;
  const ToRadius = 80;

  return [
    from.x + -FromRadius * Math.cos(angle + Math.PI),
    from.y + FromRadius * Math.sin(angle + Math.PI),
    to.x + -ToRadius * Math.cos(angle),
    to.y + ToRadius * Math.sin(angle),
  ];
}
export let useTopologyStore = defineStore("topology", {
  state() {
    return {
      networks: [],
      connections: [],
      nodes: [],
    };
  },
  actions: {
    addConnection(shapeEth, instanceEth, connectedNetwork, line) {
      this.connections.push({
        from: shapeEth,
        to: connectedNetwork,
        instanceEth: instanceEth,
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
          getConnectorPoints(
            connection.from.position(),
            connection.to.position()
          )
        );
      });
    },
    connectionExists(newConnection) {
      let exists = false;
      this.connections.forEach((connection) => {
        if (
          newConnection.from._id === connection.from._id &&
          newConnection.to._id === connection.to._id
        ) {
          exists = true;
        }
      });

      return exists;
    },
  },
});
