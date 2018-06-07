import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Quote from '@/components/Quote'
import Weather from '@/components/Weather'
import Pomodoro from '@/components/Pomodoro'
import Github from '@/components/Github'
import Contacts from '@/components/Contacts'

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
    },
    {
      path: '/github',
      name: 'Github',
      component: Github
    },
    {
      path: '/contacts',
      name: 'Contacts',
      component: Contacts
    }

  ]
})

myRouter.replace('/');

myRouter.beforeEach(function (to, from, next) {
  window.scrollTo(0, 0);
  next();
});

export default myRouter;
