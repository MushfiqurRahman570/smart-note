import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Search from '../views/Search.vue';
import Upload from '../views/Upload.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/search', component: Search },
    { path: '/upload', component: Upload },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
