import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login";
import Dashboard from "../views/Dashboard";

const routes = [
  {
    path: "/",
    redirect: {
      name: "Login",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      //console.log(this.$store.state.auth);
      //if (this.$store.state.auth == false) {
      //  next("/login");
      //} else {
      //  next();
      //}
      if (localStorage.getItem("jwt") == null) {
        // might need ===
        next("/login");
      } else {
        next();
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
