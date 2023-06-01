import Konva from "konva";
import { useTopologyStore } from "@/stores/useTopology";
import { Interface } from "@/models/Interface";
import { NetworkNode } from "@/models/NetworkNode";
import { Network } from "@/models/Network";
import { IdGenerator } from "@/models/IdGenerator";

let topology = useTopologyStore();

export function useNode() {
  function createHost(
    stage,
    layer,
    x,
    y,
    color = "red",
    anchorColor = "white",
    selectedAnchorColor = "green",
    ntype = "host"
  ) {
    /* CONSTANTS */
    const ANCHOR_OFFSET = 15;
    const ANCHOR_SIZE = 15;
    const NODE_SIZE = 75;
    /* CONSTANTS */
    let tempConnectionLine = new Konva.Line({
      stroke: "white",
      strokeWidth: 5,
      lineCap: "round",
      lineJoin: "round",
      visible: false,
    });

    let tempAnchor = new Konva.Circle({
      name: "anchor",
      width: ANCHOR_SIZE,
      height: ANCHOR_SIZE,
      fill: "white",
      visible: false,
    });

    layer.add(tempConnectionLine);
    layer.add(tempAnchor);

    tempConnectionLine.setZIndex(0);

    function setEvents(eth, ethL) {
      eth.deleteConnection = function () {
        let connectionToRemove = null;

        topology.connections.forEach((connection) => {
          if (connection.from._id === this._id) {
            connectionToRemove = connection;
          }
        });
        if (connectionToRemove === null) {
          return;
        }

        connectionToRemove.instanceEth.network = null;

        connectionToRemove.networkInstance.removeNodeInterface(
          connectionToRemove.instanceEth.mediaAccessControlAddress
        );

        connectionToRemove.line.remove();

        topology.removeConnection(connectionToRemove.from._id);
      };

      eth.on("mouseover", function () {
        stage.container().style.cursor = "grab";
      });

      eth.on("mouseout", function () {
        stage.container().style.cursor = "default";
      });

      eth.on("click", function (e) {
        if (e.evt.button === 2 && topology.connectionExists({ from: eth })) {
          eth.deleteConnection();
        }
      });

      eth.on("mouseover", function () {
        if (topology.connectionExists({ from: eth })) {
          eth.fill("red");
        } else {
          eth.fill(selectedAnchorColor);
        }
      });

      eth.on("mouseleave", function () {
        eth.fill(anchorColor);
      });

      let initialPosition;
      eth.on("dragstart", function () {
        initialPosition = eth.getPosition();
      });

      eth.on("dragmove", function () {
        stage.container().style.cursor = "grabbing";

        eth.position({
          x: initialPosition.x,
          y: initialPosition.y,
        });

        tempAnchor.setAttrs({
          x: stage.getRelativePointerPosition().x,
          y: stage.getRelativePointerPosition().y,
        });

        tempConnectionLine.setAttrs({
          points: topology.getConnectorPoints(
            eth.position(),
            tempAnchor.position(),
            20,
            0
          ),
          visible: true,
        });
      });

      eth.on("dragend", function () {
        let pointerPos = stage.getPointerPosition();
        let intersectedObjs = stage.getAllIntersections(pointerPos);
        let intersectedObj = intersectedObjs[0];

        intersectedObjs.forEach((obj) => {
          if (obj.attrs.name === "network") {
            intersectedObj = obj;
          }
        });
        console.log(intersectedObj);

        tempAnchor.visible(false);
        tempConnectionLine.visible(false);

        if (intersectedObj && intersectedObj.attrs.name === "network") {
          let networkConnected = topology.networks.find(function (network) {
            return network.shapeNetwork._id === intersectedObj._id;
          });

          let connectionLine = new Konva.Line({
            points: topology.getConnectorPoints(
              eth.position(),
              networkConnected.shapeNetwork.position()
            ),
            stroke: "white",
            strokeWidth: 5,
            lineCap: "round",
            lineJoin: "round",
          });

          if (
            topology.connectionExists({
              from: eth,
              to: networkConnected.shapeNetwork,
            })
          ) {
            return;
          }

          ethL.network = networkConnected.instanceNetwork;
          networkConnected.instanceNetwork.addNodeInterface(ethL);
          layer.add(connectionLine);
          topology.addConnection(
            eth,
            ethL,
            intersectedObj,
            networkConnected.instanceNetwork,
            connectionLine
          );
        }
      });
    }


    let hostL = new NetworkNode(ntype.toLowerCase());
    let host = new Konva.Rect({
      id: hostL.stringId,
      name: "rect",
      x: x - NODE_SIZE / 2,
      y: y - NODE_SIZE / 2,
      width: NODE_SIZE,
      height: NODE_SIZE,
      fill: color,
      draggable: true,
    });

    host.deleteNode = function () {
      eth0.deleteConnection();
      eth0.remove();
      eth0L = null;

      eth1.deleteConnection();
      eth1.remove();
      eth1L = null;

      eth2.deleteConnection();
      eth2.remove();
      eth2L = null;

      eth3.deleteConnection();
      eth3.remove();
      eth3L = null;

      idText.remove();

      host.remove();
      hostL = null;
    };

    topology.addNode(host, hostL);
    layer.add(host);
    console.log(topology.nodes);

    let idText = new Konva.Text({
      text: host.id(),
      name: "idText",
      fontSize: 30,
      fontFamily: "Calibri",
      fill: "black",
      draggable: true,
    });
    layer.add(idText);

    idText.setAttrs({
      x: host.x() + host.width() / 2 - idText.width() / 2,
      y: host.y() + host.height() / 2 - idText.height() / 2,
    });

    idText.on("dragmove", function () {
      host.setAttrs({
        x: idText.x() + idText.width() / 2 - host.width() / 2,
        y: idText.y() + idText.height() / 2 - host.height() / 2,
      });
      stage.container().style.cursor = "grabbing";
      topology.updateConnections();
      recalculateAnchorPosition();
      layer.batchDraw();
    });

    idText.deleteNode = function () {
      idText.remove();
    };

    let eth0 = new Konva.Circle({
      name: "anchor",
      x: host.x() + host.width() + ANCHOR_OFFSET,
      y: host.y() + host.height() / 2,
      width: ANCHOR_SIZE,
      height: ANCHOR_SIZE,
      fill: anchorColor,
      draggable: true,
    });

    let eth0L = new Interface(null, hostL, "RIGHT");
    hostL.addInterface(eth0L);
    setEvents(eth0, eth0L);
    layer.add(eth0);

    let eth1 = new Konva.Circle({
      name: "anchor",
      x: host.x() + host.width() / 2,
      y: host.y() + host.height() + ANCHOR_OFFSET,
      width: ANCHOR_SIZE,
      height: ANCHOR_SIZE,
      fill: anchorColor,
      draggable: true,
    });

    let eth1L = new Interface(null, hostL, "DOWN");
    setEvents(eth1, eth1L);
    hostL.addInterface(eth1L);
    layer.add(eth1);

    let eth2 = new Konva.Circle({
      name: "anchor",
      x: host.x() - ANCHOR_OFFSET,
      y: host.y() + host.height() / 2,
      width: ANCHOR_SIZE,
      height: ANCHOR_SIZE,
      fill: anchorColor,
      draggable: true,
    });

    let eth2L = new Interface(null, hostL, "LEFT");
    hostL.addInterface(eth2L);
    setEvents(eth2, eth2L);
    layer.add(eth2);

    let eth3 = new Konva.Circle({
      name: "anchor",
      x: host.x() + host.width() / 2,
      y: host.y() - ANCHOR_OFFSET,
      width: ANCHOR_SIZE,
      height: ANCHOR_SIZE,
      fill: anchorColor,
      draggable: true,
    });

    let eth3L = new Interface(null, hostL, "UP");
    hostL.addInterface(eth3L);
    setEvents(eth3, eth3L);
    layer.add(eth3);

    function recalculateAnchorPosition() {
      let squarePos = host.getPosition();

      eth0.position({
        x:
          squarePos.x +
          host.width() * host.scaleX() +
          ANCHOR_OFFSET * host.scaleX(),
        y: squarePos.y + (host.height() * host.scaleY()) / 2,
      });

      eth1.position({
        x: squarePos.x + (host.width() * host.scaleX()) / 2,
        y:
          squarePos.y +
          host.height() * host.scaleY() +
          ANCHOR_OFFSET * host.scaleY(),
      });

      eth2.position({
        x: squarePos.x - ANCHOR_OFFSET * host.scaleX(),
        y: squarePos.y + (host.height() * host.scaleY()) / 2,
      });

      eth3.position({
        x: squarePos.x + (host.width() * host.scaleX()) / 2,
        y: squarePos.y - ANCHOR_OFFSET * host.scaleY(),
      });
    }

    host.on("transform", function () {
      let scaleX = host.scaleX();

      eth0.radius(Math.abs(5 * scaleX));
      eth1.radius(Math.abs(5 * scaleX));
      eth2.radius(Math.abs(5 * scaleX));
      eth3.radius(Math.abs(5 * scaleX));

      recalculateAnchorPosition();

      layer.batchDraw();
    });

    host.on("dragmove", function () {
      stage.container().style.cursor = "grabbing";
      idText.position({
        x: host.x() + host.width() / 2 - idText.width() / 2,
        y: host.y() + host.height() / 2 - idText.height() / 2,
      });
      topology.updateConnections();
      recalculateAnchorPosition();
      layer.batchDraw();
    });

    host.on("dragend", function () {
      host.fire("mouseover");

      layer.batchDraw();
    });

    host.on("mouseover", function () {
      stage.container().style.cursor = "grab";
    });

    host.on("mouseout", function () {
      stage.container().style.cursor = "default";
    });
  }

  function createNetwork(stage, layer, x, y, color = "yellow") {
    let network = new Konva.Circle({
      id: "N" + new IdGenerator().generateNetworkId(),
      name: "network",
      x: x,
      y: y,
      width: 110,
      height: 110,
      fill: color,
      draggable: true,
    });
    let networkL = new Network();
    topology.addNetwork(network, networkL);
    layer.add(network);

    let idText = new Konva.Text({
      text: network.id(),
      name: "idText",
      fontSize: 30,
      fontFamily: "Calibri",
      fill: "black",
      draggable: true,
    });
    layer.add(idText);

    idText.setAttrs({
      x: network.x() - idText.width() / 2,
      y: network.y() - idText.height() / 2,
    });

    idText.on("dragmove", function () {
      network.setAttrs({
        x: idText.x() + idText.width() / 2,
        y: idText.y() + idText.height() / 2,
      });
      stage.container().style.cursor = "grabbing";
      topology.updateConnections();
      layer.batchDraw();
    });

    idText.deleteNode = function () {
      idText.remove();
    };

    network.deleteNode = function () {
      topology.getAllNetworkConnections(network._id).forEach((anchor) => {
        anchor.deleteConnection();
      });

      networkL = null;
      network.remove();

      idText.remove();
    };

    network.on("dragmove", function () {
      stage.container().style.cursor = "grabbing";
      idText.setAttrs({
        x: network.x() - idText.width() / 2,
        y: network.y() - idText.height() / 2,
      });
      topology.updateConnections();
      layer.batchDraw();
    });

    network.on("mouseover", function () {
      stage.container().style.cursor = "grab";
    });

    network.on("mouseout", function () {
      stage.container().style.cursor = "default";
    });
  }

  return { createHost, createNetwork };
}
