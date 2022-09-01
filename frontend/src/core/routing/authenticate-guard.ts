import { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import Cookie from 'js-cookie'
import httpRequest from '@/api/http-request'
import useUser from '@/api/composables/use-user'

export interface AuthenticateGuardResponse {
  action: 'pass' | 'redirect'
  redirectTo?: RouteLocationRaw
}

const getJwt = (): string | undefined => Cookie.get('knuepf-user-jwt')

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

  const jwt = getJwt()

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
