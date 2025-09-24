import { createRouter, createWebHistory } from 'vue-router'
import {Routes} from "@/utils/consts.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: Routes.main,
      name: 'index',
      component: () => import('@/views/Index.vue'),
      meta: { layout: 'main'}
    },
    {
      path: Routes.register,
      name: 'sign-up',
      component: () => import('@/views/auth/SignUp.vue'),
      meta: { layout: 'auth'}
    },
    {
      path: Routes.login,
      name: 'sign-in',
      component: () => import('@/views/auth/SignIn.vue'),
      meta: { layout: 'auth'}
    },
    {
      path: Routes.user,
      name: 'user',
      component: () => import('@/views/User.vue'),
      meta: { layout: 'main'}
    },
    {
      path: Routes.my_courses,
      name: 'my_courses',
      component: () => import('@/views/MyCourses.vue'),
      meta: { layout: 'main'}
    },
    {
      path: Routes.my_lessons,
      name: 'my_lessons',
      component: () => import('@/views/MyLessons.vue'),
      meta: { layout: 'main'}
    },
    {
      path: Routes.my_enrollments,
      name: 'my_enrollments',
      component: () => import('@/views/MyEnrollments.vue'),
      meta: { layout: 'main'}
    },

  ],
})

router.beforeEach(async (to, from, next) => {

  const token = localStorage.getItem('token')

  if (!token && to.path !== Routes.register && to.path !== Routes.login) {
    next(Routes.login)
  } else {
    next()
  }
})

export default router
