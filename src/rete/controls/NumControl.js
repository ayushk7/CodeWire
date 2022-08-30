import Rete from 'rete';
import { h } from 'vue';
import InputTemplate from './components/InputTemplate.vue'
export class NumControl extends Rete.Control {
    constructor(emitter, key, readonly) {
      super(key);
      this.emitter = emitter;
      this.key = key;
      this.scope = {
        type: 'number',
        value: 0,
        change: this.change.bind(this),
      };
      this.component = h(InputTemplate, this.scope)

    }
  
    change(e) {
      this.scope.value = +e.target.value;
      this.update();
    }
  
    update() {
      if (this.key) this.putData(this.key, this.scope.value);
      this.emitter.trigger('process');
      console.log('processed from the update');
    }
  
    mounted() {
      this.scope.value = this.getData(this.key) || 0;
      this.update();
    }
  
    setValue(val) {
      this.scope.value = val;
    }
  }