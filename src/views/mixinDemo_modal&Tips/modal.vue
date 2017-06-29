<template lang="html">
    <div>
        <h2>mixins 混合就是把组件里面的方法、数据混入到另一个组件里面</h2>
        <p><code>toggle</code>里面的<code>toggleShow</code>方法和<code>isShowing</code>数据混入<code>modal</code>组件</p>
        <p @click="toggleShow">点我点我{{isShowing}}</p>
    </div>
</template>

<script>
import {toggle} from '../../components/mixins/toggle.js'

export default {
  data:()=>({}),
  mixins: [toggle],
  methods: {}
}
</script>
