<template lang="html">
    <div>
        <h2>modal Title</h2>
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
