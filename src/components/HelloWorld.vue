<template>
  <div class="container">
    <img alt="Vue logo" src="/logo.png" />
    <h1>Hello Vue 3 + Vite</h1>
    <template v-for="n in 7" :key="n">
      <a-card title="Default size card" style="width: 300px">
        <template #extra><a href="#">more</a></template>
        <p>card content {{ n }}</p>
        <p>card content</p>
        <p>card content</p>
      </a-card>
      <br />
    </template>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  setup(_props, { _attrs, _slots, _emit, _expose }) {
    return {}
  },
  data() {
    return {}
  },
  computed: {},
  inject: [],
  provide() {
    return {}
  },
  methods: {},
  mounted() {},
}
</script>

<style scoped></style>
