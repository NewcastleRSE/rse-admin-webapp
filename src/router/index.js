import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import jwt_decode from 'jwt-decode'
import * as Store from '../stores'

// Layouts

import Admin from '../layouts/Admin.vue'
import Auth from '../layouts/Auth.vue'

// Views

import Login from '../views/Login.vue'
import Header from '../components/Headers/Availability.vue'
import Dashboard from '../views/Dashboard.vue'
import Projects from '../views/Projects.vue'
import Assignments from '../views/Assignments.vue'
import Team from '../views/Team.vue'
import RSE from '../views/RSE.vue'
import Transactions from '../views/Transactions.vue'

/**
 * isTokenValid:
 *  This checks if a token is expired on not
 * @returns false : if the token is expired
 * @return true : if the token is not expired
 */
function isTokenValid() {
  const authStore = Store.useAuthStore()
  // move to auth getter so can be used on components (navbar)
  var token = authStore.jwt
  if (token) {
    var decoded = jwt_decode(token)
    var exp = decoded.exp
    if (Date.now() < exp * 1000) {
      return true // when token is valid
    }
  }
  return false // when token is not valid
}

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
        component: Admin,
        beforeEnter: (to, from, next) => {
            if (!isTokenValid()) {
                next('/auth/login')
            } 
            else {
              next()
            }
        },
        children: [
          {
            path: '/dashboard',
            name: 'Dashboard',
            components: {
              default: Dashboard,
              header: Header
            },
            meta: { title: 'RSE Admin - Dashboard' }
          },
          {
            path: '/projects',
            name: 'Projects',
            components: {
              default: Projects,
              header: Header
            },
            meta: { title: 'RSE Admin - Projects' }
          },
          {
            path: '/assignments',
            name: 'Assignments',
            components: {
              default: Assignments,
              header: Header
            },
            meta: { title: 'RSE Admin - Assignments' }
          },
          {
            path: '/team',
            name: 'Team',
            components: {
              default: Team,
              header: Header
            },
            meta: { title: 'RSE Admin - RSE' }
          },
          {
            path: '/team/:name',
            name: 'RSE',
            components: {
              default: RSE,
              header: Header
            },
            meta: { title: 'RSE Admin - RSE' }
          },
          {
            path: '/transactions/:year',
            name: 'Transactions',
            components: {
              default: Transactions,
              header: Header
            },
            meta: { title: 'RSE Admin - Transactions' }
          }
        ]
    },
    {
        path: '/auth',
        redirect: '/auth/login',
        component: Auth,
        beforeEnter: (to, from, next) => {
            if (isTokenValid()) {
                next('/dashboard')
            } else {
                next()
            }
        },
        children: [
          {
            path: '/auth/login',
            name: 'Login',
            component: Login,
            meta: { title: 'RSE Admin - Login' }
          }
        ]
    },
    {
        path: '/auth/logout',
        name: 'Logout',
        beforeEnter: (to, from, next) => {

          const assignmentsStore = Store.useAssignmentsStore()
          assignmentsStore.reset()

          const authStore = Store.useAuthStore()
          authStore.reset()

          const capacitiesStore = Store.useCapacitiesStore()
          capacitiesStore.reset()

          const facilitiesStore = Store.useFacilitiesStore()
          facilitiesStore.reset()

          const projectsStore = Store.useProjectsStore()
          projectsStore.reset()

          const rsesStore = Store.useRSEsStore()
          rsesStore.reset()

          const timesheetsStore = Store.useTimesheetsStore()
          timesheetsStore.reset()

          const transactionsStore = Store.useTransactionsStore()
          transactionsStore.reset()

          localStorage.clear()

          next('/auth/login')
        },
        meta: { title: 'RSE Admin - Logout' }
    }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'is-active',
})

router.afterEach((to) => {
  nextTick(() => {
      document.title = to.meta.title || 'RSE Admin'
  })
})

export default router
