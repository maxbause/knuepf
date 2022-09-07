import useJwt from '@/core/composables/authentication/use-jwt'
import ParsingError from '@/core/errors/parsing-error'
import Jwt from '@/core/models/jwt'
import { ref } from 'vue'
import httpRequest from '../http-request'

type UserRole = 'user' | 'admin'
export interface User {
  id: number
  username: string
  password: string
  jwt: string
  role: UserRole
  banned: boolean
  banMessage: string | undefined
  lastLoggedInAt: Date | undefined
  createdAt: Date
  updatedAt: Date
}

const me = ref<User|undefined>()

const useUser = () => {
  const jwtComp = useJwt()
  const login = async (username: string, password: string) => {
    const res = await httpRequest.post<Jwt>('/users/jwt', { user: { username, password } })
    const jwt = res.processedBody?.[0]?.jwt
    if (!jwt) {
      throw new ParsingError()
    }

    jwtComp.setJwt(jwt)
    return jwt
  }

  const logout = async () => {
    try {
      await httpRequest.delete<Jwt>('/users/jwt')
      jwtComp.removeJwt()
    } catch {
      jwtComp.removeJwt()
    }

    return true
  }

  const getMe = async () => {
    const res = await httpRequest.get<User>('/users/me')
    const user = res.processedBody?.[0]
    if (!user) {
      throw new ParsingError()
    }

    return user
  }

  return {
    login,
    logout,
    getMe,
    me,
  }
}

export default useUser
