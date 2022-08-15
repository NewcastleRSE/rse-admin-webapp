import { nextTick } from 'vue';
import { createRouter, createWebHistory } from "vue-router";
import jwt_decode from "jwt-decode";
import store from "../store";

// Layouts

import Admin from "../layouts/Admin.vue";
import Auth from "../layouts/Auth.vue";

// Views

import Login from "../views/Login";
import Dashboard from "../views/Dashboard";
import Projects from "../views/Projects";
import Assignments from "../views/Assignments";
import User from "../views/User";
import Transactions from "../views/Transactions";

/**
 * isTokenValid:
 *  This checks if a token is expired on not
 * @returns false : if the token is expired
 * @return true : if the token is not expired
 */
function isTokenValid() {
  // move to auth getter so can be used on components (navbar)
  var token = store.state.auth.jwt;
  if (token) {
    var decoded = jwt_decode(token);
    var exp = decoded.exp;
    if (Date.now() < exp * 1000) {
      return true; // when token is valid
    }
  }
  return false; // when token is not valid
}

const routes = [
    {
        path: "/",
        redirect: "/dashboard",
        component: Admin,
        beforeEnter: (to, from, next) => {
            console.log(from)
            if (!isTokenValid()) {
                next("/auth/login");
            } 
            else if (from === '/auth/login') {
              next()
            }
            else {
              if (
                store.getters["assignments/getAssignments"].length === 0 ||
                store.getters["capacity/getCapacity"].length === 0 ||
                store.getters["projects/getProjects"].length === 0 ||
                store.getters["rses/getRses"].length === 0 ||
                store.getters["timesheets/getReport"].length === 0 ||
                store.getters["transactions/getTransactions"].length === 0
              ) {
                Promise.all([
                  store.dispatch("projects/getProjects"),
                  store.dispatch("rses/getRses"),
                  store.dispatch("timesheets/getReport"),
                  store.dispatch("capacity/getCapacity"),
                  store.dispatch("transactions/getTransactions")
                ]).then(() => {
                  next();
                }).catch(error => {
                  console.error(error)
                })
              }
            }
        },
        children: [
          {
            path: "/dashboard",
            name: "Dashboard",
            component: Dashboard,
            meta: { title: 'RSE Admin - Dashboard' }
          },
          {
            path: "/projects",
            name: "Projects",
            component: Projects,
            meta: { title: 'RSE Admin - Projects' }
          },
          {
            path: "/assignments",
            name: "Assignments",
            component: Assignments,
            meta: { title: 'RSE Admin - Assignments' }
          },
          {
            path: "/user",
            name: "User",
            component: User,
            meta: { title: 'RSE Admin - User' }
          },
          {
            path: "/transactions",
            name: "Transactions",
            component: Transactions,
            meta: { title: 'RSE Admin - Transactions' }
          }
        ]
    },
    {
        path: "/auth",
        redirect: "/auth/login",
        component: Auth,
        beforeEnter: (to, from, next) => {
            if (isTokenValid()) {
                next("/dashboard");
            } else {
                next();
            }
        },
        children: [
          {
            path: "/auth/login",
            name: "Login",
            component: Login,
            meta: { title: 'RSE Admin - Login' }
          }
        ]
    }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "is-active",
});

router.afterEach((to) => {
  nextTick(() => {
      document.title = to.meta.title || 'RSE Admin';
  });
});

export default router;
