import Rete from 'rete';
import { h } from 'vue';
import NumberInput from './components/NumberInput.vue'
export class NumControl extends Rete.Control {
    constructor(emitter, key, readonly) {
      super(key);
      this.emitter = emitter;
      this.key = key;
      this.component = h(NumberInput, { value: 5});
      this.scope = {
        value: 45,
        readonly,
        change: this.change.bind(this),
      };
      this.component = h(NumberInput, this.scope)

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