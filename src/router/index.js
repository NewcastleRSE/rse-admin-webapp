import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import jwt_decode from 'jwt-decode'
import * as Store from '../stores'

// Layouts

import Admin from '../layouts/Admin.vue'
import Auth from '../layouts/Auth.vue'

// Views
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Projects from '../views/Projects.vue'
import Assignments from '../views/Assignments.vue'
import Team from '../views/Team.vue'
import RSE from '../views/RSE.vue'

import Budget from '../views/finances/Budget.vue'
import FinanceDashboard from '../views/finances/Dashboard.vue'
import Invoices from '../views/finances/Invoices.vue'
import Transactions from '../views/finances/Transactions.vue'

// Headers
import AvailabilityHeader from '../components/Headers/Availability.vue'
import FinanceHeader from '../components/Headers/Finance.vue'
import ProfileHeader from '../components/Headers/Profile.vue'
import ProjectsHeader from '../components/Headers/Projects.vue'

/**
 * isTokenValid:
 *  This checks if a token is expired on not
 * @returns false : if the token is expired
 * @return true : if the token is not expired
 */
function isTokenValid() {
  const userStore = Store.useUserStore()
  // move to auth getter so can be used on components (navbar)
  var token = userStore.jwt
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
              header: AvailabilityHeader
            },
            meta: { title: 'RSE Admin - Dashboard' }
          },
          {
            path: '/projects',
            name: 'Projects',
            components: {
              default: Projects,
              header: ProjectsHeader
            },
            meta: { title: 'RSE Admin - Projects' }
          },
          {
            path: '/projects/:status',
            name: 'Status',
            components: {
              default: Projects,
              header: ProjectsHeader
            },
            meta: { title: 'RSE Admin - Projects' }
          },
          {
            path: '/assignments',
            name: 'Assignments',
            components: {
              default: Assignments,
              header: AvailabilityHeader
            },
            meta: { title: 'RSE Admin - Assignments' }
          },
          {
            path: '/team',
            name: 'Team',
            components: {
              default: Team,
              header: AvailabilityHeader
            },
            meta: { title: 'RSE Admin - RSE' }
          },
          {
            path: '/team/:name',
            name: 'RSE',
            components: {
              default: RSE,
              header: ProfileHeader
            },
            meta: { title: 'RSE Admin - RSE' }
          },
          {
            path: '/finance',
            name: 'Finance',
            components: {
              default: FinanceDashboard,
              header: FinanceHeader
            },
            meta: { title: 'RSE Admin - Finances' }
          },
          {
            path: '/finance/invoices',
            name: 'Invoices',
            components: {
              default: Invoices,
              header: FinanceHeader
            },
            meta: { title: 'RSE Admin - Invoices' }
          },
          {
            path: '/finance/budget',
            name: 'Budget',
            components: {
              default: Budget,
              header: FinanceHeader
            },
            meta: { title: 'RSE Admin - Budget' }
          },
          {
            path: '/finance/transactions/:year',
            name: 'Transactions',
            components: {
              default: Transactions,
              header: FinanceHeader
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

          const userStore = Store.useUserStore()
          userStore.reset()

          const facilitiesStore = Store.useFacilitiesStore()
          facilitiesStore.reset()

          const projectsStore = Store.useProjectsStore()
          projectsStore.reset()

          const rsesStore = Store.useRSEsStore()
          rsesStore.reset()

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
