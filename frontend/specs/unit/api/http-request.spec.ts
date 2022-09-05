import httpRequest from '@/api/http-request'
import CombinedApiError from '@/core/errors/combined-api-error'
import User, { Roles } from '@/core/models/user'
import Cookies from 'js-cookie'
import jsonApiUtil from '../utils/json-api-util'

describe('httpRequest', () => {
  describe('http methods', () => {
    it('to add jwt as token header to every request if present', async () => {
      Cookies.set('knuepf-user-jwt', 'super-secret-jwt')
      fetchMock.mockResponseOnce(async (req) => {
        expect(req.headers.get('token')).toEqual('super-secret-jwt')
        return ''
      })

      await httpRequest.get('/')
    })

    describe('.get', () => {
      it('to send a GET request', async () => {
        fetchMock.mockResponseOnce(async (req) => {
          expect(req.method).toEqual('GET')
          return ''
        })

        await httpRequest.get('/')
      })
    })

    describe('.post', () => {
      it('to send a POST request', async () => {
        fetchMock.mockResponseOnce(async (req) => {
          expect(req.method).toEqual('POST')
          return ''
        })

        await httpRequest.post('/', {})
      })
    })

    describe('.patch', () => {
      it('to send a PATCH request', async () => {
        fetchMock.mockResponseOnce(async (req) => {
          expect(req.method).toEqual('PATCH')
          return ''
        })

        await httpRequest.patch('/', {})
      })
    })

    describe('.delete', () => {
      it('to send a DELETE request', async () => {
        fetchMock.mockResponseOnce(async (req) => {
          expect(req.method).toEqual('DELETE')
          return ''
        })

        await httpRequest.delete('/')
      })
    })

    describe('.processedBody', () => {
      it('to parse a successful json api response into a valid object', async () => {
        fetchMock.mockResponseOnce(async (req) => {
          const { user } = await req.json()
          expect(user.username).toBeTruthy()
          return jsonApiUtil.mockRes()['Api::V1::UsersController'].create(user)
        })

        const parsedRes = await httpRequest.post<User>('/', { user: { username: 'test-user', created_at: '2022-09-04T21:09:24.586Z' } })
        const createdUser = parsedRes.processedBody?.[0]
        expect(createdUser?.id).toEqual(1)
        expect(createdUser?.username).toEqual('test-user')
        expect(createdUser?.banned).toEqual(false)
        expect(createdUser?.role).toEqual(Roles.User)
        expect(createdUser?.createdAt).toEqual(new Date('2022-09-04T21:09:24.586Z'))
      })

      it('to parse an error response to a valid error object', async () => {
        fetchMock.mockResponseOnce(async () => jsonApiUtil.mockRes()['Api::V1::UsersController'].bannedError('Custom ban message.'))

        try {
          // this should throw an error!
          await httpRequest.post<User>('/', { user: { username: 'test-user' } })
          expect(true).toEqual(false)
        } catch (error) {
          expect(error).toBeInstanceOf(CombinedApiError)
          const combinedError = error as CombinedApiError
          expect(combinedError.firstError.status).toEqual(403)
          expect(combinedError.firstError.errorCode).toEqual('error.api.unauthorized')
          expect(combinedError.firstError.data.message).toEqual('Custom ban message.')
        }
      })
    })
  })
})
