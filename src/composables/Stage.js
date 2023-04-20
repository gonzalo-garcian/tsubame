import Konva from "konva";
import topology from "@/stores/topology.json";

export class Stage {
  constructor(
    container,
    width = window.innerWidth,
    height = window.innerHeight
  ) {
    this.ref = new Konva.Stage({
      container: container,
      width: width,
      height: height,
    });

    this.layer = new Konva.Layer();
    this.ref.add(this.layer);

    var rect1 = new Konva.Rect({
      x: 60,
      y: 60,
      width: 100,
      height: 90,
      fill: 'red',
      name: 'rect',
      draggable: true,
    });
    this.layer.add(rect1);

    var rect2 = new Konva.Rect({
      x: 250,
      y: 100,
      width: 150,
      height: 90,
      fill: 'green',
      name: 'rect',
      draggable: true,
    });
    this.layer.add(rect2);

    this.tr = new Konva.Transformer();
    this.layer.add(this.tr);
    this.tr.nodes(this.topology);
    // add a new feature, lets add ability to draw selection rectangle
    this.selectionRectangle = new Konva.Rect({
      fill: "rgba(0,0,255,0.5)",
      visible: false,
    });
    this.layer.add(this.selectionRectangle);

    this.position = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    };

    this.ref.on("mousedown touchstart", (e) => this.onMouseDown(e));
    this.ref.on("mousemove touchmove", (e) => this.onMouseMove(e));
    this.ref.on("mouseup touchend", (e) => this.onMouseUp(e));
    this.ref.on("click tap", (e) => this.onClick(e));
  }

  onMouseDown(e) {
    // do nothing if we mousedown on any shape
    if (e.target !== this.ref) {
      return;
    }
    e.evt.preventDefault();

    if (e.evt.button === 2) {
      this.ref.startDrag();
    }

    this.position.x1 = this.ref.getRelativePointerPosition().x;
    this.position.y1 = this.ref.getRelativePointerPosition().y;
    this.position.x2 = this.ref.getRelativePointerPosition().x;
    this.position.y2 = this.ref.getRelativePointerPosition().y;

    this.selectionRectangle.visible(true);
    this.selectionRectangle.width(0);
    this.selectionRectangle.height(0);
  }

  onMouseMove(e) {
    // do nothing if we didn't start selection
    if (!this.selectionRectangle.visible()) {
      return;
    }
    e.evt.preventDefault();

    if (e.evt.button === 2) {
      this.ref.stopDrag();
    }

    this.position.x2 = this.ref.getRelativePointerPosition().x;
    this.position.y2 = this.ref.getRelativePointerPosition().y;

    this.selectionRectangle.setAttrs({
      x: Math.min(this.position.x1, this.position.x2),
      y: Math.min(this.position.y1, this.position.y2),
      width: Math.abs(this.position.x2 - this.position.x1),
      height: Math.abs(this.position.y2 - this.position.y1),
    });
  }

  onMouseUp(e) {
    // do nothing if we didn't start selection
    if (!this.selectionRectangle.visible()) {
      return;
    }
    e.evt.preventDefault();
    // update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      this.selectionRectangle.visible(false);
    });

    let shapes = this.ref.find(".rect");
    let box = this.selectionRectangle.getClientRect();
    let selected = shapes.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    );
    this.tr.nodes(selected);
  }

  onClick(e) {
    // if we are selecting with rect, do nothing
    if (this.selectionRectangle.visible()) {
      return;
    }

    // if click on empty area - remove all selections
    if (e.target === this.ref) {
      this.tr.nodes([]);
      return;
    }

    // do nothing if clicked NOT on our rectangles
    if (!e.target.hasName("rect")) {
      return;
    }

    // do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = this.tr.nodes().indexOf(e.target) >= 0;

    if (!metaPressed && !isSelected) {
      // if no key pressed and the node is not selected
      // select just one
      this.tr.nodes([e.target]);
    } else if (metaPressed && isSelected) {
      // if we pressed keys and node was selected
      // we need to remove it from selection:
      const nodes = this.tr.nodes().slice(); // use slice to have new copy of array
      // remove node from array
      nodes.splice(nodes.indexOf(e.target), 1);
      this.tr.nodes(nodes);
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      const nodes = this.tr.nodes().concat([e.target]);
      this.tr.nodes(nodes);
    }
  }
}
