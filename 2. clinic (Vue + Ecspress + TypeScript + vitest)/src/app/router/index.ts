import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouterHistory
} from "vue-router";
import AppShell from "../layout/AppShell.vue";
import AdminAppointmentsPage from "../../pages/admin/AdminAppointmentsPage.vue";
import DoctorsPage from "../../pages/admin/DoctorsPage.vue";
import ServicesPage from "../../pages/admin/ServicesPage.vue";
import AppointmentsPage from "../../pages/appointments/AppointmentsPage.vue";
import ReportsPage from "../../pages/reports/ReportsPage.vue";

function createHistory(): RouterHistory {
  return window.location.protocol === "file:"
    ? createWebHashHistory()
    : createWebHistory();
}

const router = createRouter({
  history: createHistory(),
  routes: [
    {
      path: "/",
      component: AppShell,
      children: [
        {
          path: "",
          redirect: { name: "admin-doctors" }
        },
        {
          path: "admin",
          redirect: { name: "admin-doctors" }
        },
        {
          path: "admin/doctors",
          name: "admin-doctors",
          component: DoctorsPage
        },
        {
          path: "admin/services",
          name: "admin-services",
          component: ServicesPage
        },
        {
          path: "admin/appointments",
          name: "admin-appointments",
          component: AdminAppointmentsPage
        },
        {
          path: "appointments",
          name: "appointments",
          component: AppointmentsPage
        },
        {
          path: "reports",
          name: "reports",
          component: ReportsPage
        }
      ]
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: { name: "admin-doctors" }
    }
  ]
});

export default router;
