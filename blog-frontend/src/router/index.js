import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/article/:id',
        name: 'ArticleDetail',
        component: () => import('@/views/ArticleDetail.vue'), // 文章详情页
    },
    // 你可以根据需要添加其他页面路由
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;