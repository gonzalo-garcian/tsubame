import { ref } from "vue";

export class Transformer {
  constructor(topology) {
    this.reference = null;
    this.transformer = null;
    this.topology = ref(topology).value;
    this.selectedShapeName = "";
  }

  handleStageMouseDown(e) {
    console.log(this.topology);
    // clicked on stage - clear selection
    if (e.target === e.target.getStage()) {
      this.selectedShapeName = "";
      this.updateTransformer();
      return;
    }

    // clicked on transformer - do nothing
    const clickedOnTransformer =
      e.target.getParent().className === "Transformer";
    if (clickedOnTransformer) {
      return;
    }

    // find clicked rect by its name
    const name = e.target.name();
    console.log(name);
    const rect = this.topology.find((r) => r.name === name);
    if (rect) {
      this.selectedShapeName = name;
    } else {
      this.selectedShapeName = "";
    }
    this.updateTransformer();
  }

  updateTransformer() {
    // here we need to manually attach or detach Transformer node
    console.log(this.reference);
    const { selectedShapeName } = this;

    const selectedNode = this.transformer.findOne("." + selectedShapeName);
    // do nothing if selected node is already attached
    if (selectedNode === this.transformer.node()) {
      return;
    }

    if (selectedNode) {
      // attach to another node
      this.transformer.nodes([selectedNode]);
    } else {
      // remove transformer
      this.transformer.nodes([]);
    }
  }
}
