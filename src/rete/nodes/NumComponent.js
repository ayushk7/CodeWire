import Rete from 'rete'
import { NumSocket } from '../sockets';
import { NumControl } from '../controls';
export class NumComponent extends Rete.Component {
    constructor() {
      super("Number");
    }
  
    builder(node) {
      const out1 = new Rete.Output("num", "Number", NumSocket);
      const ctrl = new NumControl(this.editor, "num", node);
  
      return node.addControl(ctrl).addOutput(out1);
    }
  
    worker(node, inputs, outputs) {
      outputs["num"] = node.data.num;
    }
  }