import Konva from "konva";

export function useNode() {
  function createHost(stage, layer, x, y, color, anchorColor = "white") {
    const ANCHOR_OFFSET = 25;

    function setEvents(eth) {
      eth.on("mouseover", function () {
        eth.fill("yellow");
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
        console.log(stage.getPointerPosition().x);
        console.log(stage.getPointerPosition().y);
      });
    }

    let host = new Konva.Rect({
      name: "rect",
      x: x,
      y: y,
      width: 100,
      height: 100,
      fill: color,
      draggable: true,
    });
    layer.add(host);

    let eth0 = new Konva.Circle({
      x: host.x() + host.width() + ANCHOR_OFFSET,
      y: host.y() + host.height() / 2,
      width: 10,
      height: 10,
      fill: anchorColor,
      draggable: true,
    });

    setEvents(eth0);
    layer.add(eth0);

    let eth1 = new Konva.Circle({
      x: host.x() + host.width() / 2,
      y: host.y() + host.height() + ANCHOR_OFFSET,
      width: 10,
      height: 10,
      fill: anchorColor,
      draggable: true,
    });

    setEvents(eth1);
    layer.add(eth1);

    let eth2 = new Konva.Circle({
      x: host.x() - ANCHOR_OFFSET,
      y: host.y() + host.height() / 2,
      width: 10,
      height: 10,
      fill: anchorColor,
      draggable: true,
    });

    setEvents(eth2);
    layer.add(eth2);

    let eth3 = new Konva.Circle({
      x: host.x() + host.width() / 2,
      y: host.y() - ANCHOR_OFFSET,
      width: 10,
      height: 10,
      fill: anchorColor,
      draggable: true,
    });

    setEvents(eth3);
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
      recalculateAnchorPosition();
      layer.batchDraw();
    });

    host.on("dragmove", function () {

    });
  }

  return { createHost };
}
