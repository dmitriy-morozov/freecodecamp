import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Quote from '@/components/Quote'
import Weather from '@/components/Weather'
import Pomodoro from '@/components/Pomodoro'

Vue.use(Router)

export const myRouter = new Router({
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
    },
    {
      path: '/weather',
      name: 'Weather',
      component: Weather
    },
    {
      path: '/pomodoro',
      name: 'Pomodoro',
      component: Pomodoro
    }
  ]
})

myRouter.replace('/');

myRouter.beforeEach(function (to, from, next) {
  window.scrollTo(0, 0);
  next();
});

export default myRouter;
