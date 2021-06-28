import { createRouter, createWebHistory } from "vue-router";
import jwt_decode from "jwt-decode";

import Login from "../views/Login";
import Dashboard from "../views/Dashboard";

/**
 * isTokenValid:
 *  This checks if a token is expired on not
 * @returns false : if the token is expired
 * @return true : if the token is not expired
 */
function isTokenValid() {
    var token = localStorage.getItem("jwt");
    if (token) {
        var decoded = jwt_decode(token);
        var exp = decoded.exp;
        console.log("here " + decoded.exp);
        if (Date.now() < exp * 1000) {
            return true; // when token is expired
        }
    }
    return false; // when token is not expired
}



const routes = [{
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
            if (!isTokenValid()) { // if token is expired or jwt is null
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