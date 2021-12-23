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
            if (!isTokenValid()) {
                next("/auth/login");
            } else {
                next();
            }
        },
        children: [
          {
            path: "/dashboard",
            name: "Dashboard",
            component: Dashboard,
          },
          {
            path: "/projects",
            name: "Projects",
            component: Projects,
          },
          {
            path: "/assignments",
            name: "Assignments",
            component: Assignments,
          },
          {
            path: "/user",
            name: "User",
            component: User,
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
          }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    linkActiveClass: "is-active",
});

export default router;