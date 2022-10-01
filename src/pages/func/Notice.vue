<template>
  <div class="container">
    <h1>公告板</h1>
    <template v-for="n in 2" :key="n">
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
