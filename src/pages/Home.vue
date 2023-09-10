<template>
  <div class="container">
    <template v-for="n in 1" :key="n">
      <a-card title="Default size card" style="width: 300px">
        <template #extra><a href="#">more</a></template>
        <p>欢迎访问凌越网络工作室后台</p>
      </a-card>
      <br />
    </template>
  </div>
</template>

<script></script>

<style scoped></style>
