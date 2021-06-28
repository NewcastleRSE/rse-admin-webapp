import { createRouter, createWebHistory } from "vue-router";
import jwt_decode from "jwt-decode";
import store from "../store";

import Login from "../views/Login";
import Dashboard from "../views/Dashboard";

/**
 * isTokenValid:
 *  This checks if a token is expired on not
 * @returns false : if the token is expired
 * @return true : if the token is not expired
 */
function isTokenValid() {
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
      if (!isTokenValid()) {
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
