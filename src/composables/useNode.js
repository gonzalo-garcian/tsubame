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
    const ANCHOR_OFFSET = 25;
    const ANCHOR_SIZE = 10;

    function setEvents(eth, ethL) {
      eth.on("mouseover", function () {
        eth.fill(selectedAnchorColor);
      });

      eth.on("mouseleave", function () {
        eth.fill(anchorColor);
      });

      let initialPosition;
      eth.on("dragstart", function () {
        initialPosition = eth.getPosition();
      });

      eth.on("dragmove", function () {
        eth.position({
          x: initialPosition.x,
          y: initialPosition.y,
        });
      });

      eth.on("dragend", function () {
        let pointerPos = stage.getPointerPosition();
        let intersectedObj = stage.getIntersection(pointerPos);

        if (intersectedObj && intersectedObj.attrs.name === "network") {
          console.log("Objeto intersectado:", intersectedObj);
          console.log(intersectedObj._id);
          let networkConnected = topology.networks.find(function (network) {
            return network.shapeNetwork._id === intersectedObj._id;
          });

          let connectionLine = new Konva.Line({
            points: getConnectorPoints(
              eth.position(),
              networkConnected.shapeNetwork.position()
            ),
            stroke: "white",
            strokeWidth: 5,
            lineCap: "round",
            lineJoin: "round",
          });

          if (
            topology.connections.includes({
              eth,
              ethL,
              intersectedObj,
              connectionLine,
            })
          ) {
            return;
          }

          ethL.network = networkConnected.instanceNetwork;
          networkConnected.instanceNetwork.addNodeInterface(ethL);
          layer.add(connectionLine);
          topology.addConnection(eth, ethL, intersectedObj, connectionLine);
          console.log(topology.connections);
        }
      });
    }

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

  function createNetwork(stage, layer) {
    let network = new Konva.Circle({
      name: "network",
      x: 100,
      y: 100,
      width: 120,
      height: 120,
      fill: "blue",
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
  }

  return { createHost, createNetwork };
}
