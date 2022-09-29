<template>
  <a-layout style="margin: 24px 280px 0; background: #fff; box-shadow: 2px 2px 8px 2px #ccc">
    <a-layout-sider width="150" style="background: #fff">
      <a-menu mode="inline" style="height: 100%" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys">
        <a-sub-menu key="sub1">
          <template #title>
            <span><SmileOutlined /> 校园应用</span>
          </template>
          <a-menu-item key="1"><router-link to="/func">公告板</router-link></a-menu-item>
          <a-menu-item key="2"><router-link to="/func/enroll">报名</router-link></a-menu-item>
          <a-menu-item key="3"><router-link to="/func/vote">投票</router-link></a-menu-item>
          <a-menu-item key="4">社团</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span><LaptopOutlined /> subnav 2</span>
          </template>
          <a-menu-item key="5">option5</a-menu-item>
          <a-menu-item key="6">option6</a-menu-item>
          <a-menu-item key="7">option7</a-menu-item>
          <a-menu-item key="8">option8</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3">
          <template #title>
            <span><CodeOutlined /> 控制台 </span>
          </template>
          <a-menu-item key="9"><router-link to="/func/enroll-man">报名系统</router-link></a-menu-item>
          <a-menu-item key="10"><router-link to="/func/voltime-man">志愿时长管理</router-link></a-menu-item>
          <a-menu-item key="11"><router-link to="/func/dayImage-man">日历图管理</router-link></a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout-content :style="{ minHeight: '280px' }">
      <BitChatRoom />
    </a-layout-content>
  </a-layout>
</template>

<script>
import BitChatRoom from '../components/BitChatRoom.vue'
export default {
  components: { BitChatRoom },
  data() {
    return { selectedKeys: ['1'], openKeys: ['sub1'] }
  },
  inject: [],
  computed: {},
  methods: {},
  provide() {
    return {}
  },
  mounted() {
    this.$router.beforeEach((to, from) => {
      if (to.path == '/func') {
        this.selectedKeys = ['1']
        this.openKeys = ['sub1']
      }
    })
  },
}
</script>

<style scoped>
</style>