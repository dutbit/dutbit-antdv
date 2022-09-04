<template>
   <a-layout style="margin: 24px 24px 0; background: #fff; box-shadow: 2px 2px 8px 2px #ccc">
    <a-layout-sider width="150" style="background: #fff">
      <a-menu mode="inline" style="height: 100%" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys">
        <a-sub-menu key="profileSub">
          <template #title>
            <span><SmileOutlined /> 个人资料</span>
          </template>
          <a-menu-item key="info"><router-link to="/my/profile">我的信息</router-link></a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script>
export default {
  components: {},
  data() {
    return { selectedKeys: ['info'], openKeys: ['profileSub'] }
  },
  computed: {},
  inject: [],
  provide() {
    return {}
  },
  methods: {},
  mounted() {
    this.$router.push('/my/profile')
    this.$router.beforeEach((to, from) => {
      if (to.path == '/my') {
        this.selectedKeys = ['info']
        this.openKeys = ['profileSub']
      }
    })
  },
}
</script>

<style scoped>
:deep(.ant-menu-item-group .ant-menu-item) {
  height: 30px;
}
</style>