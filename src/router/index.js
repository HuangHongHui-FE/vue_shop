import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'

import Music from '../views/funguy/Music.vue'
import Video from '../views/funguy/Video.vue'

import Report from '../views/report/Report.vue'

import Play from '../views/resource/Play.vue'
import ResourceShare from '../views/resource/ResourceShare.vue'
import StudyDelete from '../views/resource/StudyDelete.vue'
import StudyWhite from '../views/resource/StudyWhite.vue'

import Blogs from '../views/share/Blogs.vue'
import Classify from '../views/share/Classify.vue'
import ShareImage from '../views/share/ShareImage.vue'

import Users from '../views/user/Users.vue'


// webpackChunkName    指定的路由懒加载分定的组
// const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../views/Login.vue')
// const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../views/Home.vue')
// const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../views/Welcome.vue')

// const Users = () => import(/* webpackChunkName: "user_rights_roles" */ '../views/user/Users.vue')
// const Rights = () => import(/* webpackChunkName: "user_rights_roles" */ '../views/power/Rights.vue')
// const Roles = () => import(/* webpackChunkName: "user_rights_roles" */ '../views/power/Roles.vue')

// const Cate = () => import(/* webpackChunkName: "cate_params" */ '../views/goods/Cate.vue')
// const Params = () => import(/* webpackChunkName: "cate_params" */ '../views/goods/Params.vue')

// const GoodsList = () => import(/* webpackChunkName: "goodsList_add" */ '../views/goods/List.vue')
// const Add = () => import(/* webpackChunkName: "goodsList_add" */ '../views/goods/Add.vue')

// const Order = () => import(/* webpackChunkName: "order_report" */ '../views/user/Order.vue')
// const Report = () => import(/* webpackChunkName: "order_report" */ '../views/report/Report.vue')

Vue.use(VueRouter)
// vbadb
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', 
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },

      { path: '/users', component: Users },

      { path: '/music', component: Music },
      { path: '/video', component: Video },

      { path: '/play', component: Play },
      { path: '/resourceShare', component: ResourceShare },
      { path: '/studyDelete', component: StudyDelete },
      { path: '/studyWhite', component: StudyWhite },

      { path: '/reports', component: Report },

      { path: '/blogs', component: Blogs },
      { path: '/classify', component: Classify },
      { path: '/shareImage', component: ShareImage }
    ]
  }
]

const router = new VueRouter({
  routes
})


// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next(): 放行， next('./login'): 强制跳转

  if (to.path === "/login") return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})


export default router
