import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Quote from '@/components/Quote'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/quote',
      name: 'Quote',
      component: Quote
    }
  ]
})
