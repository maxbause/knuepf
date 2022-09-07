import useUser from '@/api/composables/use-user'
import useJwt from '@/core/composables/authentication/use-jwt'
import CombinedApiError from '@/core/errors/combined-api-error'
import jsonApiUtil from '../../utils/json-api-util'

describe('useUser', () => {
  const testJwt = 'eyJhbGciOiJIUzI1NiJ9.XXX'

  it('to export expected methods', () => {
    const exportedFunctions = useUser()
    expect(Object.keys(exportedFunctions)).toEqual(['login', 'logout', 'getMe', 'me'])
  })

  beforeEach(() => {
    useJwt().removeJwt()
  })

  describe('.login', () => {
    it('to call login http requests', async () => {
      const callTrigger = jest.fn()
      fetchMock.mockResponseOnce(async (req) => {
        expect(req.url).toMatch(/\/api\/v1\/users\/jwt$/i)
        expect(req.method).toEqual('POST')
        callTrigger()
        return jsonApiUtil.mockRes()['Api::V1::UsersController'].createJwt()
      })

      await useUser().login('test-user', '123456')
      expect(callTrigger).toHaveBeenCalledTimes(1)
    })

    it('to set jwt cookie on successful response', async () => {
      fetchMock.mockResponseOnce(async () => jsonApiUtil.mockRes()['Api::V1::UsersController'].createJwt(testJwt))

      await useUser().login('test-user', '123456')
      expect(useJwt().getJwt()).toEqual(testJwt)
    })

    it('to not set jwt cookie on error response', async () => {
      fetchMock.mockResponseOnce(async () => jsonApiUtil.mockRes()['Api::V1::UsersController'].createJwtError())

      const callTrigger = jest.fn()
      try {
        await useUser().login('test-user', 'inv')
        callTrigger()
      } catch (error) {
        expect(error).toBeInstanceOf(CombinedApiError)
        expect((error as CombinedApiError).firstError.status).toEqual(403)
      } finally {
        expect(useJwt().getJwt()).toEqual(undefined)
        expect(callTrigger).not.toHaveBeenCalled()
      }
    })
  })

  describe('.logout', () => {
    it('to call logout http requests', async () => {
      const callTrigger = jest.fn()
      fetchMock.mockResponseOnce(async (req) => {
        expect(req.url).toMatch(/\/api\/v1\/users\/jwt$/i)
        expect(req.method).toEqual('DELETE')
        callTrigger()
        return jsonApiUtil.mockRes()['Api::V1::UsersController'].deleteJwt()
      })

      await useUser().logout()
      expect(callTrigger).toHaveBeenCalledTimes(1)
    })

    describe('on successful response', () => {
      it('to remove jwt', async () => {
        fetchMock.mockResponseOnce(async () => jsonApiUtil.mockRes()['Api::V1::UsersController'].deleteJwt())

        useJwt().setJwt(testJwt)
        expect(useJwt().getJwt()).toEqual(testJwt)
        await useUser().logout()
        expect(useJwt().getJwt()).toEqual(undefined)
      })
    })

    describe('on error response', () => {
      it('to remove jwt', async () => {
        fetchMock.mockResponseOnce(async () => jsonApiUtil.mockRes()['Api::V1::UsersController'].deleteJwtError())

        useJwt().setJwt(testJwt)
        expect(useJwt().getJwt()).toEqual(testJwt)
        await useUser().logout()
        expect(useJwt().getJwt()).toEqual(undefined)
      })
    })
  })

  describe('.getMe', () => {
    it('to make get user requests', async () => {
      const callTrigger = jest.fn()
      fetchMock.mockResponseOnce(async (req) => {
        expect(req.url).toMatch(/\/api\/v1\/users\/me$/i)
        expect(req.method).toEqual('GET')
        callTrigger()
        return jsonApiUtil.mockRes()['Api::V1::UsersController'].show()
      })

      await useUser().getMe()
      expect(callTrigger).toHaveBeenCalledTimes(1)
    })
  })
})
