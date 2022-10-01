import { createRouter, createWebHashHistory } from 'vue-router'

import Home from './pages/Home.vue'
import Func from './pages/Func.vue'
import Message from './pages/Message.vue'
import My from './pages/My.vue'
import Profile from './pages/my/Profile.vue'
import About from './pages/About.vue'
import Login from './pages/Login.vue'
import DayImageMan from './pages/func/DayImageMan.vue'
import Enroll from './pages/func/Enroll.vue'
import EnrollMan from './pages/func/EnrollMan.vue'
import EnrollQuery from './pages/func/EnrollQuery.vue'
import Notice from './pages/func/Notice.vue'
import PointShow from './pages/func/PointShow.vue'
import PointUpdate from './pages/func/PointUpdate.vue'
import VoltimeEdit from './pages/func/VoltimeEdit.vue'
import VoltimeUpdate from './pages/func/VoltimeUpdate.vue'
import Vote from './pages/func/Vote.vue'

const routes = [
  { path: '/', component: Home, meta: { pageTitle: '首页' } },
  { path: '/home', component: Home, meta: { pageTitle: '首页' } },
  {
    path: '/func',
    component: Func,
    meta: { pageTitle: '功能' },
    children: [
      { path: '', component: Notice },
      { path: 'dayImage-man', component: DayImageMan },
      { path: 'enroll', component: Enroll },
      { path: 'enroll-man', component: EnrollMan },
      { path: 'enroll-query', component: EnrollQuery },
      { path: 'notice', component: Notice },
      { path: 'point-show', component: PointShow },
      { path: 'point-update', component: PointUpdate },
      { path: 'voltime-update', component: VoltimeUpdate },
      { path: 'voltime-edit', component: VoltimeEdit },
      { path: 'vote', component: Vote },
    ],
  },
  { path: '/message', component: Message, meta: { pageTitle: '消息' } },
  { path: '/my', component: My, meta: { pageTitle: '我的' }, children: [{ path: 'profile', component: Profile }] },
  { path: '/about', component: About, meta: { pageTitle: '关于' } },
  {
    path: '/login',
    component: Login,
    meta: { pageTitle: '登录', isNeedLogin: false },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

export default router
