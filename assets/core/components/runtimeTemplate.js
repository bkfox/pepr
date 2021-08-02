/**
 * This code originally comes from v-runtime-template by Alex Jovern. It includes
 * PR#33 and is adapted to Vue 3.
 * The following code is under MIT license (Copyright (c) 2018 Alex Jover).
 */
import { h } from 'vue'

const defineDescriptor = (src, dest, name) => {
  if (!dest.hasOwnProperty(name)) {
    const descriptor = Object.getOwnPropertyDescriptor(src, name);
    Object.defineProperty(dest, name, descriptor);
  }
};

const merge = objs => {
  const res = {};
  objs.forEach(obj => {
    obj &&
      Object.getOwnPropertyNames(obj).forEach(name =>
        defineDescriptor(obj, res, name)
      );
  });
  return res;
};

const buildFromProps = (obj, props) => {
  const res = {};
  props.forEach(prop => defineDescriptor(obj, res, prop));
  return res;
};

const buildPassthrough = (self, source, target, attr) => {
    [self, source] = [self[attr], source[attr] || {}];
    let dest = target[attr] || {};
    for(var key of Object.keys(source))
        if(self === undefined || self[key] === undefined)
            dest[key] = source[key];
    target[attr] = dest;
};

export default {
  props: {
    template: String
  },
  render() {
    if (this.template) {
      let passthrough = {};
      buildPassthrough(self, this.$parent, passthrough, '$data');
      buildPassthrough(self, this.$parent, passthrough, '$props');
      buildPassthrough(self, this.$parent.$options, passthrough, 'components');
      buildPassthrough(self, this.$parent.$options, passthrough, 'computed');
      buildPassthrough(self, this.$parent.$options, passthrough, 'methods');

      const methodKeys = Object.keys(passthrough.methods);
      const dataKeys = Object.keys(passthrough.$data);
      const propKeys = Object.keys(passthrough.$props);
      const allKeys = dataKeys.concat(propKeys).concat(methodKeys);
      const methodsFromProps = buildFromProps(this.$parent, methodKeys);
      const props = merge([passthrough.$data, passthrough.$props, methodsFromProps]);

      const dynamic = {
        template: this.template || "<div></div>",
        props: allKeys,
        computed: passthrough.computed,
        components: passthrough.components
      };

      return h(dynamic, {
        props
      });
    }
  }
};
