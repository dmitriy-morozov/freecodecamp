import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Quote from '@/components/Quote'
import Weather from '@/components/Weather'

Vue.use(Router)

export const myRouter = new Router({
  mode: 'abstract',
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
    }
  ]
})

myRouter.replace('/');

myRouter.beforeEach(function (to, from, next) {
  window.scrollTo(0, 0);
  next();
});

export default myRouter;
