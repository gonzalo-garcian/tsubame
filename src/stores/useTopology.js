import { defineStore } from "pinia";
import { supabase } from "@/composables/supabase";
import { useUserStore } from "@/stores/useUser";
import { useNode } from "@/composables/useNode";
import { IdGenerator } from "@/models/IdGenerator";
import Konva from "konva";

export let useTopologyStore = defineStore("topology", {
  state() {
    return {
      networks: [],
      connections: [],
      nodes: [],
      anchorsInterf: [],
      dropedNodeType: "",
      stageRef: null,
    };
  },
  actions: {
    async saveProject() {
      try {
        const stage = this.stageRef;
        let projectJSON = JSON.parse(stage.toJSON());
        projectJSON["hostCount"] = new IdGenerator().host_id;
          
        projectJSON["routerCount"] = new IdGenerator().router_id;
          
        projectJSON["networkCount"] = new IdGenerator().network_id;
        projectJSON["connections"] = [];
          
        this.connections.forEach((connection) => {
            
            
          projectJSON["connections"].push({
            from: connection.from._id,
            instanceEth: connection.instanceEth.mediaAccessControlAddress,
            to: connection.to._id,
            networkInstance: connection.networkInstance.id,
            line: connection.line._id,
          });
        });
          
        projectJSON = JSON.stringify(projectJSON);
        const updates = {
          id: useUserStore().currentProject[0].id,
          user_id: useUserStore().id,
          data: projectJSON,
        };

        let { error } = await supabase.from("projects").upsert(updates);

        if (error) throw error;
      } catch (error) {
        console.log(error);
      }
    },
    loadProject(stage, layer) {
        
        
      const stageCurrentProject = JSON.parse(
        useUserStore().currentProject[0].data
      );

        
        
      const layerCurrentProject =
        stageCurrentProject["children"][0]["children"];
      layerCurrentProject.forEach((children) => {
          
          

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
        } else if (children.attrs.name === "network") {
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

      stageCurrentProject["connections"].forEach((connection) => {
          
          
        const networkConnected = this.networks.find(function (network) {
          return network.instanceNetwork.id === connection.networkInstance;
        });
        const anchorConnected = this.anchorsInterf.find((
          anchorInterf
        )  => {
            
            
            
          return (
            anchorInterf.instanceAnchor.mediaAccessControlAddress ===
            connection.instanceEth
          );
        });
          

        let connectionLine = new Konva.Line({
          points: this.getConnectorPoints(
            anchorConnected.shapeAnchor.position(),
            networkConnected.shapeNetwork.position()
          ),
          stroke: "white",
          strokeWidth: 5,
          lineCap: "round",
          lineJoin: "round",
        });

        if (
          this.connectionExists({
            from: anchorConnected.shapeAnchor,
            to: networkConnected.shapeNetwork,
          })
        ) {
          return;
        }

        anchorConnected.instanceAnchor.network =
          networkConnected.instanceNetwork;
        networkConnected.instanceNetwork.addNodeInterface(
          anchorConnected.instanceAnchor
        );
        layer.add(connectionLine);
        this.addConnection(
          anchorConnected.shapeAnchor,
          anchorConnected.instanceAnchor,
          networkConnected.shapeNetwork,
          networkConnected.instanceNetwork,
          connectionLine
        );
      });
      new IdGenerator().host_id = stageCurrentProject["hostCount"];
        
      new IdGenerator().router_id = stageCurrentProject["routerCount"];
        
      new IdGenerator().network_id = stageCurrentProject["networkCount"];
        
    },
    addAnchor(shape, anchor) {
      this.anchorsInterf.push({ shapeAnchor: shape, instanceAnchor: anchor });
        
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
