<template>
  <a-layout style="min-height: 100%">
    <a-layout-header style="position: fixed; z-index: 1; width: 100%; background: #fff; box-shadow: 0 2px 8px #ddd">
      <div class="logo" />
      <a-menu v-model:selectedKeys="current" mode="horizontal" style="border: none">
        <a-menu-item key="home">
          <template #icon><HomeOutlined /></template>
          <router-link to="/">首页</router-link>
        </a-menu-item>
        <a-menu-item key="func">
          <template #icon><AppstoreOutlined /></template>
          <router-link to="/func">功能</router-link>
        </a-menu-item>
        <a-menu-item key="message">
          <template #icon><MailOutlined /></template>
          <router-link to="/message">消息</router-link>
        </a-menu-item>
        <a-menu-item key="my">
          <template #icon><UserOutlined /></template>
          <router-link to="/my">个人中心</router-link>
        </a-menu-item>
        <a-sub-menu>
          <template #icon><SettingOutlined /></template>
          <template #title>其它</template>
          <a-menu-item-group title="操作">
            <a-menu-item key="login"><router-link to="/login">登录</router-link></a-menu-item>
            <a-menu-item key="logout" @click="logout">登出</a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
        <a-menu-item key="dlut">
          <template #icon><LinkOutlined /></template>
          <a href="https://www.dlut.edu.cn/" target="_blank" rel="noopener noreferrer">大工主页</a>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="margin-top: 64px; display: flex">
      <router-view />
    </a-layout-content>
    <a-layout-footer style="text-align: center">凌越网络工作室</a-layout-footer>
  </a-layout>
</template>

<script>
import { notification } from 'ant-design-vue'
export default {
  components: {},
  data() {
    return { current: ['mail'] }
  },
  inject: ['axiosBaseURL'],
  computed: {},
  methods: {
    logout() {
      window.localStorage.removeItem('Authorization')
      notification.info({ message: '提示', description: '已经登出...' })
      this.$router.replace('/login')
    },
  },
  provide() {
    return {}
  },
  mounted() {
    this.$http.defaults.baseURL = this.axiosBaseURL
    this.$http.interceptors.request.use((config) => {
      config.headers.Authorization = window.localStorage.getItem('Authorization')
      return config
    })
    this.$http.interceptors.response.use(
      (res) => {
        if (res.data.success === false) {
          this.$router.replace('/login')
          console.log('fail')
        }
        return res
      },
      (err) => {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // prettier-ignore
          if (err.response.status === 462) 
            notification.error({ message: '出错啦！', description: '用户名或密码错误' })
          if (err.response.status === 463)
            notification.error({ message: '出错啦！', description: '登录过期！请重新登录' })
          console.log(`成功请求，但响应状态码为${err.response.status}，响应内容如下`)
          console.log(err.response.data)
          // console.log(err.response.headers)
        } else if (err.request)
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          notification.error({ message: '网络错误: 无响应' })
      }
    )
    this.$router.beforeEach((to, _from) => {
      // console.log(to)
      document.title = to.meta?.pageTitle
      if (to.meta?.isNeedLogin ?? true) if (!window.localStorage.getItem('Authorization')) return '/login'
    })
  },
}
</script>

<style scoped>
.logo {
  width: 120px;
  height: 31px;
  background: rgba(116, 192, 255, 0.733);
  margin: 16px 24px 16px 0;
  float: left;
}
.ant-layout-footer {
  padding: 12px 50px;
  background: transparent;
}
</style>

<style>
/* 公共样式 */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0px;
  background: #eee;
}

hr {
  height: 2px;
  width: 100%;
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  margin: 1em 0;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
</style>
