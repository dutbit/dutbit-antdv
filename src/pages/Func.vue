<template>
  <a-layout style="margin: 24px 24px 0; background: #fff; box-shadow: 2px 2px 8px 2px #ccc">
    <a-layout-sider width="150" style="background: #fff">
      <a-menu mode="inline" style="height: 100%" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys">
        <a-sub-menu key="school-app">
          <template #title>
            <span><SmileOutlined /> 校园应用</span>
          </template>
          <a-menu-item key="board"><router-link to="/func">公告板</router-link></a-menu-item>
          <a-menu-item key="enroll"><router-link to="/func/enroll">报名</router-link></a-menu-item>
          <a-menu-item key="vote"><router-link to="/func/vote">投票</router-link></a-menu-item>
          <a-menu-item key="group">社团</a-menu-item>
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
        <a-sub-menu key="console">
          <template #title>
            <span><CodeOutlined /> 控制台 </span>
          </template>
          <a-menu-item key="enroll-query"><router-link to="/func/enroll-query">报名查询</router-link></a-menu-item>
          <a-menu-item key="enroll-man"><router-link to="/func/enroll-man">报名管理</router-link></a-menu-item>
          <a-menu-item key="dayimg-man"><router-link to="/func/dayImage-man">日历图管理</router-link></a-menu-item>
          <a-menu-item-group key="point">
            <template #title>积分查询</template>
            <a-menu-item key="point-query"><router-link to="/func/point-show">浏览</router-link></a-menu-item>
            <a-menu-item key="point-update"><router-link to="/func/point-update">更新</router-link></a-menu-item>
          </a-menu-item-group>
          <a-menu-item-group key="vol">
            <template #title>志愿时长</template>
            <a-menu-item key="vol-query"><router-link to="/func/voltime-update">更新</router-link></a-menu-item>
            <a-menu-item key="vol-update"><router-link to="/func/voltime-edit">编辑</router-link></a-menu-item>
          </a-menu-item-group>
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
    return { selectedKeys: ['1'], openKeys: ['sub1'] }
  },
  inject: [],
  computed: {},
  methods: {},
  provide() {
    return {
      facultyList: ['新媒体平台', '新媒体视频号', '光in影像工作室', '平面设计工作室', '比特网络工作室'],
    }
  },
  mounted() {
    this.$router.beforeEach((to, _from) => {
      if (to.path === '/func') {
        this.selectedKeys = ['1']
        this.openKeys = ['sub1']
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
