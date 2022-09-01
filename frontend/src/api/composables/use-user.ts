import ParsingError from '@/core/errors/parsing-error'
import Jwt from '@/core/models/jwt'
import Cookies from 'js-cookie'
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
  const login = async (username: string, password: string) => {
    const res = await httpRequest.post<Jwt>('/users/jwt', { user: { username, password } })
    const jwt = res.processedBody?.[0]?.jwt
    if (!jwt) {
      throw new ParsingError()
    }

    Cookies.set('knuepf-user-jwt', jwt)
    return jwt
  }

  const logout = async () => {
    await httpRequest.delete<Jwt>('/users/jwt')
    Cookies.remove('knuepf-user-jwt')
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
