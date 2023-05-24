import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import SlidingPuzzle from '@/components/slidingPuzzle'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/slidingPuzzle',
      name: 'slidingPuzzle',
      component: SlidingPuzzle
    }
  ]
})
