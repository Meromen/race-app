import Game from "./Game.vue";
import ViewProfile from  "./ViewProfile.vue";
import Leaderboard from  "./Leaderboard.vue";
import Login from  "./Login.vue";
import Registration from  "./Registration.vue";

export const routes = [
  { path: '',
    name: 'game',
    component : Game},
  { path: '/leaderboard',
    name: 'leaderboard',
    props: true,
    component: Leaderboard},
  { path: '/registration',
    name: 'registration',
    props: true,
    component: Registration},
  { path: '/login',
    name: 'login',
    props: true,
    component: Login},
  { path: '/user/profile',
    name: 'viewProfile',
    props: true,
    component: ViewProfile
  },
  { path: '*', component : { template: '<h1>Page Not Found</h1>' } }
];
