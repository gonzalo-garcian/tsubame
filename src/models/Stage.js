import Konva from "konva";
import { useNode } from "@/composables/useNode";
import { useTopologyStore } from "@/stores/useTopology";
import { useUserStore } from "@/stores/useUser";

let topology = useTopologyStore();

export class Stage {
  constructor(container) {
    const canvasContainer = document.querySelector(".canvas-container");
    this.ref = new Konva.Stage({
      container: container,
      width: canvasContainer.offsetWidth,
      height: canvasContainer.offsetHeight,
    });

    this.layer = new Konva.Layer();
    this.ref.add(this.layer);

    if (useUserStore().currentProject !== null) {
      if (useUserStore().currentProject[0].data) {
        console.log("EFECTIVAMENTE HAY COSAS");
        useTopologyStore().loadProject(this.ref, this.layer);
        console.log(useUserStore().currentProject[0]);
      }
    }

    /*useNode().createHost(this.ref, this.layer, 120, 30, "red");
    useNode().createHost(this.ref, this.layer, 500, 500, "green");
    useNode().createNetwork(this.ref, this.layer, 500, 100, "red");
    useNode().createNetwork(this.ref, this.layer, 700, 100, "yellow");
    useNode().createHost(this.ref, this.layer, 500, 500, "green");*/

    this.tr = new Konva.Transformer({
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270],
      enabledAnchors: [],
      rotateEnabled: false,
      //keepRatio: false,
    });
    this.layer.add(this.tr);

    this.selectionRectangle = new Konva.Rect({
      fill: "rgba(90,90,90,0.5)",
      visible: false,
    });
    this.layer.add(this.selectionRectangle);

    this.position = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    };

    let con = this.ref.container();

    con.addEventListener("click", () => {
      con.tabIndex = 0;
      con.focus();
    });

    con.addEventListener("keydown", (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        let selectedNodes = this.tr.nodes();
        console.log(selectedNodes);
        selectedNodes.forEach((node) => {
          node.deleteNode();
        });

        this.layer.batchDraw();
      } else if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        useTopologyStore().saveProject(this.ref);
      }
    });

    con.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    con.addEventListener("drop", (e) => {
      e.preventDefault();
      console.log(this.ref);
      this.ref.setPointersPositions(e);
      let pointer = this.ref.getRelativePointerPosition();
      let option = topology.dropedNodeType;
      console.log(option);
      switch (option) {
        case "Host":
          useNode().createHost(this.ref, this.layer, pointer.x, pointer.y);
          break;
        case "Router":
          useNode().createHost(
            this.ref,
            this.layer,
            pointer.x,
            pointer.y,
            "orange",
            "white",
            "green",
            "router"
          );
          break;
        case "Network":
          useNode().createNetwork(this.ref, this.layer, pointer.x, pointer.y);
          break;
        default:
          break;
      }
    });

    this.ref.on("mousedown touchstart", (e) => this.onMouseDown(e));
    this.ref.on("mousemove touchmove", (e) => this.onMouseMove(e));
    this.ref.on("mouseup touchend", (e) => this.onMouseUp(e));
    this.ref.on("click tap", (e) => this.onClick(e));
    this.ref.on("wheel", (e) => this.onWheel(e));
    this.ref.on("contextmenu", (e) => e.evt.preventDefault());
    this.ref.on("dragend", (e) => this.onDragEnd(e));
  }

  onMouseDown(e) {
    // do nothing if we mousedown on any shape
    if (e.target !== this.ref) {
      return;
    }
    e.evt.preventDefault();

    if (e.evt.button === 2) {
      this.ref.startDrag();
      this.ref.container().style.cursor = "move";
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
    shapes = shapes.concat(this.ref.find(".network"));
    shapes = shapes.concat(this.ref.find(".idText"));
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
    if (
      !e.target.hasName("rect") &&
      !e.target.hasName("network") &&
      !e.target.hasName("idText")
    ) {
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

  onWheel(e) {
    // stop default scrolling
    e.evt.preventDefault();
    let scaleBy = 1.1;
    let oldScale = this.ref.scaleX();
    let pointer = this.ref.getPointerPosition();

    let mousePointTo = {
      x: (pointer.x - this.ref.x()) / oldScale,
      y: (pointer.y - this.ref.y()) / oldScale,
    };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? -1 : 1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    this.ref.scale({ x: newScale, y: newScale });

    let newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    this.ref.position(newPos);
  }

  onDragEnd() {
    this.ref.container().style.cursor = "default";
  }
}
