import type {RouteRecordRaw} from 'vue-router'
import {createRouter, createWebHistory} from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'index',
        meta: {layout: 'main', requiresAuth: true},
        component: () => import('@/views/index.vue')
    },
    {
        path: '/add-game/',
        name: 'AddGame',
        meta: {layout: 'main', requiresAuth: true},
        component: () => import('@/views/addGame.vue')
    },
    // {
    //     path: '/sign-in/',
    //     name: 'SignIn',
    //     meta: {layout: 'login'},
    //     component: () => import('@/views/auth/SignIn.vue')
    // },
    {
        path: '/sign-up/',
        name: 'SignUp',
        meta: {layout: 'login'},
        component: () => import('@/views/auth/SignUp.vue')
    },
    {
        path: '/games/:id/',
        name: 'Game',
        meta: {layout: 'main', requiresAuth: true},
        component: () => import('@/views/game.vue')
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

// отключил для навигации по сайту

// router.beforeEach((to, _, next) => {
//     const accessToken = localStorage.getItem('access_token');
//     const refreshToken = localStorage.getItem('refresh_token');


// if (!accessToken && !refreshToken && to.meta.requiresAuth) {
//     next('/sign-in');
// } else {
//     next();
// }
// });

export default router
