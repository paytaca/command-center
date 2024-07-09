import { boot } from 'quasar/wrappers'
import { useStore } from 'vuex'

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    const store = useStore()
    const isAuthenticated = store.getters['auth/isAuthenticated'] // Adjust based on your store structure

    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
      // Redirect to the login page if not authenticated
      next({ name: 'Login' })
    } else {
      // Proceed as normal if the route doesn't require authentication or if the user is authenticated
      next()
    }
  })
})
