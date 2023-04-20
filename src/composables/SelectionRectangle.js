import { ref } from "vue";

export class SelectionRectangle {
  constructor(stage) {
    this.config = {
      fill: "rgba(0,0,255,0.5)",
      visible: false,
    };
    this.stage = stage;
    this.reference = ref(null);
    this.selectionRectangle = null;
    this.position = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    };
  }

  mouseDown(e) {
    console.log(this.selectionRectangle);
    // do nothing if we mousedown on any shape
    if (e.target !== this.stage.stage) {
      return;
    }
    e.evt.preventDefault();
    this.position.x1 = this.stage.stage.getRelativePointerPosition().x;
    this.position.y1 = this.stage.stage.getRelativePointerPosition().y;
    this.position.x2 = this.stage.stage.getRelativePointerPosition().x;
    this.position.y2 = this.stage.stage.getRelativePointerPosition().y;

    this.selectionRectangle.visible(true);
    this.selectionRectangle.width(0);
    this.selectionRectangle.height(0);
  }

  mouseMove(e) {
    // do nothing if we didn't start selection
    if (!this.selectionRectangle.visible()) {
      return;
    }
    e.evt.preventDefault();
    document.getElementById("components").style.pointerEvents = "none";
    this.position.x2 = this.stage.stage.getRelativePointerPosition().x;
    this.position.y2 = this.stage.stage.getRelativePointerPosition().y;

    this.selectionRectangle.setAttrs({
      x: Math.min(this.position.x1, this.position.x2),
      y: Math.min(this.position.y1, this.position.y2),
      width: Math.abs(this.position.x2 - this.position.x1),
      height: Math.abs(this.position.y2 - this.position.y1),
    });
  }

  mouseUp(e) {
    // do nothing if we didn't start selection
    if (!this.selectionRectangle.visible()) {
      return;
    }
    e.evt.preventDefault();
    // update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      this.selectionRectangle.visible(false);
      document.getElementById("components").style.pointerEvents = "auto";
    });
  }
}
