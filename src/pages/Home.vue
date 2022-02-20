<template>
  <div class="container">
    <template v-for="n in 10" :key="n">
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
</script>

<style scoped>
</style>
