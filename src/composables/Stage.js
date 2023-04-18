import { ref } from "vue";

export class Stage {
  constructor(width = window.innerWidth, height = window.innerHeight) {
    this.config = {
      width: width,
      height: height,
    };
    this.reference = ref(null);
    this.stage = null;
  }

  contextMenu(e) {
    e.evt.preventDefault();
  }

  mouseDown(e) {
    if (e.evt.button === 2 && e.target === this.stage) {
      this.stage.startDrag();
    }
  }
  mouseUp(e) {
    if (e.evt.button === 2 && e.target === this.stage) {
      this.stage.stopDrag();
    }
  }

  zoom(e) {
    // stop default scrolling
    e.evt.preventDefault();
    let scaleBy = 1.1;
    let oldScale = this.stage.scaleX();
    let pointer = this.stage.getPointerPosition();

    let mousePointTo = {
      x: (pointer.x - this.stage.x()) / oldScale,
      y: (pointer.y - this.stage.y()) / oldScale,
    };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? -1 : 1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    this.stage.scale({ x: newScale, y: newScale });

    let newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    this.stage.position(newPos);
  }
}
