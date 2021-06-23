import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login";
import Dashboard from "../views/Dashboard";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
