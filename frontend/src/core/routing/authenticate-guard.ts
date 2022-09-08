import { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import useUser from '@/api/composables/use-user'
import useJwt from '../composables/authentication/use-jwt'

export interface AuthenticateGuardResponse {
  action: 'pass' | 'redirect'
  redirectTo?: RouteLocationRaw
}

const authenticateGuard = (
  toRoute: RouteLocationNormalized,
  fromRoute: RouteLocationNormalized,
) => new Promise<AuthenticateGuardResponse>((resolve) => {
  const pass: AuthenticateGuardResponse = { action: 'pass' }
  const redirectToLogin: AuthenticateGuardResponse = { action: 'redirect', redirectTo: { name: 'login' } }

  if (toRoute.name === 'login') {
    resolve(pass)
    return
  }

  const jwt = useJwt().getJwt()
  if (!jwt) {
    resolve(redirectToLogin)
    return
  }

  useUser().getMe().then((user) => {
    useUser().me.value = user
    resolve(pass)
  }).catch((err) => {
    resolve(redirectToLogin)
  })
})

export default authenticateGuard
