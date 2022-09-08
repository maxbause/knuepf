import UserController from './controller-responses/api/v1/user-controller'

const mockRes = () => ({
  'Api::V1::UsersController': new UserController(),
})

const jsonApiUtil = {
  mockRes,
}

export default jsonApiUtil
