import Cookies from 'js-cookie'

const useJwt = () => {
  const cookieName = 'knuepf-user-jwt'

  const setJwt = (jwt: string) => {
    Cookies.set(cookieName, jwt)
    return jwt
  }

  const getJwt = (): string | undefined => Cookies.get(cookieName)

  const removeJwt = (): true => {
    Cookies.remove(cookieName)
    return true
  }

  return {
    setJwt,
    getJwt,
    removeJwt,
  }
}

export default useJwt
