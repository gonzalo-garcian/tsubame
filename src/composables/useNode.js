import Konva from "konva";

export function useNode() {
  function createHost(stage, layer, x, y) {
    const ANCHOR_OFFSET = 15;

    let host = new Konva.Rect({
      name: "rect",
      x: x,
      y: y,
      width: 100,
      height: 100,
      fill: "red",
      draggable: true,
    });
    layer.add(host);

    let eth0 = new Konva.Circle({
      x: host.x() + host.width() + ANCHOR_OFFSET,
      y: host.y() + host.height() / 2,
      width: 10,
      height: 10,
      fill: "white",
      draggable: true,
    });

    eth0.on("mouseover", function () {
      initialPosition = eth0.getPosition(); // Guardar la posición inicial del círculo
    });

    let initialPosition;
    eth0.on("dragstart", function () {
      initialPosition = eth0.getPosition();
    });

    eth0.on("dragmove", function () {
      eth0.position({
        x: initialPosition.x,
        y: initialPosition.y,
      });
    });

    eth0.on("dragend", function () {
      console.log(stage.getPointerPosition().x);
      console.log(stage.getPointerPosition().y);
    });

    layer.add(eth0);

    let eth1 = new Konva.Circle({
      x: host.x() + host.width() / 2,
      y: host.y() + host.height() + ANCHOR_OFFSET,
      width: 10,
      height: 10,
      fill: "white",
    });

    layer.add(eth1);

    let eth2 = new Konva.Circle({
      x: host.x() - ANCHOR_OFFSET,
      y: host.y() + host.height() / 2,
      width: 10,
      height: 10,
      fill: "white",
    });

    layer.add(eth2);

    let eth3 = new Konva.Circle({
      x: host.x() + host.width() / 2,
      y: host.y() - ANCHOR_OFFSET,
      width: 10,
      height: 10,
      fill: "white",
    });

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

      eth0.radius(Math.abs(3 * scaleX));
      eth1.radius(Math.abs(3 * scaleX));
      eth2.radius(Math.abs(3 * scaleX));
      eth3.radius(Math.abs(3 * scaleX));

      recalculateAnchorPosition();

      layer.batchDraw();
    });

    host.on("dragmove", function () {
      recalculateAnchorPosition();
      layer.batchDraw();
    });
  }

  return { createHost };
}
