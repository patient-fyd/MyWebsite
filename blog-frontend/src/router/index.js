import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', component: () => import('../views/Home.vue') },
    { path: '/post/:id', component: () => import('../views/PostDetail.vue') },
    { path: '/create', component: () => import('../views/CreatePost.vue') },
    { path: '/login', component: () => import('../views/Login.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router