import { defineStore } from "pinia";
import { supabase } from "@/composables/supabase";
import { useUserStore } from "@/stores/useUser";
import { useNode } from "@/composables/useNode";
import { IdGenerator } from "@/models/IdGenerator";

export let useTopologyStore = defineStore("topology", {
  state() {
    return {
      networks: [],
      connections: [],
      nodes: [],
      dropedNodeType: "",
    };
  },
  actions: {
    async saveProject(stage) {
      try {
        let projectJSON = JSON.parse(stage.toJSON());
        projectJSON["hostCount"] = new IdGenerator().host_id;
        console.log(projectJSON["hostCount"]);
        projectJSON["routerCount"] = new IdGenerator().router_id;
        console.log(projectJSON["routerCount"]);
        projectJSON["networkCount"] = new IdGenerator().network_id;
        console.log(projectJSON["networkCount"]);
        console.log(projectJSON);
        projectJSON = JSON.stringify(projectJSON);
        const updates = {
          id: useUserStore().currentProject[0].id,
          user_id: useUserStore().id,
          data: projectJSON,
        };

        let { error } = await supabase.from("projects").upsert(updates);

        if (error) throw error;
      } catch (error) {
        console.log(error.message);
        console.log(useUserStore().id);
        alert(useUserStore().id);
      }
    },
    loadProject(stage, layer) {
      console.log("STRING JSON: ");
      console.log(useUserStore().currentProject);
      const stageCurrentProject = JSON.parse(
        useUserStore().currentProject[0].data
      );

      console.log("JSON: ");
      console.log(stageCurrentProject);
      const layerCurrentProject =
        stageCurrentProject["children"][0]["children"];
      layerCurrentProject.forEach((children) => {
        console.log("LOS CHILDREN");
        console.log(children);

        if (children.attrs.name === "rect") {
          const NODE_SIZE = 75;
          const x = children.attrs.x + NODE_SIZE / 2;
          const y = children.attrs.y + NODE_SIZE / 2;
          if (children.attrs.id[0] === "H") {
            useNode().createHost(
              stage,
              layer,
              x,
              y,
              "red",
              "white",
              "green",
              "host",
              children.attrs.id
            );
          } else if (children.attrs.id[0] === "R") {
            useNode().createHost(
              stage,
              layer,
              x,
              y,
              "orange",
              "white",
              "green",
              "router",
              children.attrs.id
            );
          }
        }
        if (children.attrs.name === "network") {
          useNode().createNetwork(
            stage,
            layer,
            children.attrs.x,
            children.attrs.y,
            "yellow",
            children.attrs.id
          );
        }
      });
      new IdGenerator().host_id = stageCurrentProject["hostCount"];
      console.log(new IdGenerator().host_id);
      new IdGenerator().router_id = stageCurrentProject["routerCount"];
      console.log(new IdGenerator().router_id);
      new IdGenerator().network_id = stageCurrentProject["networkCount"];
      console.log(new IdGenerator().network_id);
    },
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
    getAllNetworkConnections(networkId) {
      let result = [];
      this.connections.forEach((connection) => {
        if (connection.to._id === networkId) {
          result.push(connection.from);
        }
      });
      return result;
    },
    getNodeInstance(nodeId) {
      let result = null;
      this.nodes.forEach((node) => {
        if (node.instanceNode.id === nodeId) {
          result = node.instanceNode;
        }
      });
      return result;
    },
    getNodeInstanceByStringId(nodeStringId) {
      let result = null;
      this.nodes.forEach((node) => {
        console.log(node.shapeNode.id());
        if (node.shapeNode.id() === nodeStringId) {
          result = node.instanceNode;
        }
      });
      return result;
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
