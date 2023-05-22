import Konva from "konva";
import { useTopologyStore } from "@/stores/useTopology";
import { Interface } from "@/models/Interface";
import { NetworkNode } from "@/models/NetworkNode";
import { Network } from "@/models/Network";

let topology = useTopologyStore();

export function useNode() {
  function createHost(
    stage,
    layer,
    x,
    y,
    color,
    anchorColor = "white",
    selectedAnchorColor = "green"
  ) {
    /* CONSTANTS */
    const ANCHOR_OFFSET = 15;
    const ANCHOR_SIZE = 15;

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
    function setEvents(eth, ethL) {
      eth.on("mouseover", function () {
        stage.container().style.cursor = "grab";
      });

      eth.on("mouseout", function () {
        stage.container().style.cursor = "default";
      });

      eth.on("click", function (e) {
        if (e.evt.button === 2 && topology.connectionExists({ from: eth })) {
          console.log("remove");
          console.log(topology.connections);
          let connectionToRemove = null;

          topology.connections.forEach((connection) => {
            if (connection.from._id === eth._id) {
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
          console.log("userNode elem to rm: " + connectionToRemove.from._id);
          topology.removeConnection(connectionToRemove.from._id);

          console.log(topology.connections);
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
          x: stage.getPointerPosition().x,
          y: stage.getPointerPosition().y,
        });

        console.log(
          topology.getConnectorPoints(tempAnchor.position(), eth.position())
        );

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
        let intersectedObj = stage.getIntersection(pointerPos);

        tempAnchor.visible(false);
        tempConnectionLine.visible(false);

        if (intersectedObj && intersectedObj.attrs.name === "network") {
          console.log("Objeto intersectado:", intersectedObj);
          console.log(intersectedObj._id);
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
            console.log("No llega!");
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
          console.log("Conexiones: ");
          console.log(topology.connections);
        }
      });
    }

    let host = new Konva.Rect({
      id: "host3",
      name: "rect",
      x: x,
      y: y,
      width: 75,
      height: 75,
      fill: color,
      draggable: true,
    });
    let hostL = new NetworkNode("host");
    topology.addNode(host, hostL);
    console.log(topology.nodes);
    layer.add(host);

    let eth0 = new Konva.Circle({
      name: "anchor",
      x: host.x() + host.width() + ANCHOR_OFFSET,
      y: host.y() + host.height() / 2,
      width: ANCHOR_SIZE,
      height: ANCHOR_SIZE,
      fill: anchorColor,
      draggable: true,
    });

    let eth0L = new Interface(null, hostL);
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

    let eth1L = new Interface(null, hostL);
    setEvents(eth1, eth1L);
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

    let eth2L = new Interface(null, hostL);
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

    let eth3L = new Interface(null, hostL);
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
      topology.updateConnections();
      recalculateAnchorPosition();
      layer.batchDraw();
    });

    host.on("dragend", function () {
      host.fire("mouseover");
      console.log(stage.container().style.cursor);
      layer.batchDraw();
    });

    host.on("mouseover", function () {
      stage.container().style.cursor = "grab";
    });

    host.on("mouseout", function () {
      stage.container().style.cursor = "default";
    });
  }

  function createNetwork(stage, layer, x, y, color) {
    let network = new Konva.Circle({
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
    console.log(topology.networks);

    network.on("dragmove", function () {
      stage.container().style.cursor = "grabbing";
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
