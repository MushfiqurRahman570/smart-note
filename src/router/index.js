import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Search from '../views/Search.vue';
import Upload from '../views/Upload.vue';
import Content from '../views/Content.vue';
import DocumentView from '../views/DocumentView.vue';
import Register from '../views/RegisterPage.vue';
import Login from '../views/LoginPage.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/search', component: Search },
    { path: '/upload', component: Upload },
    { path: '/content', component: Content },
    { path: '/register', component: Register },
    { path: '/login', component: Login },
    { path: '/document/:id', name: 'DocumentView', component: DocumentView, props: true },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
