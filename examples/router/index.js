import Vue from 'vue';
import VueRouter from 'vue-router';
import DemoDesign from '../views/demo-design.vue';
// import DemoViewer from '../views/demo-viewer.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    alias: '/demo-design',
    name: 'DemoDesign',
    component: DemoDesign,
  },
  {
    path: '/demo-viewer',
    name: 'DemoViewer',
    component: () => import(/* webpackChunkName: "viewer" */ '../views/demo-viewer.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
