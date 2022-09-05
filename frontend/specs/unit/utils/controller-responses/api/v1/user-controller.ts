import Controller from '../../controller'

class UserController extends Controller {
  public create(user?: any) {
    return this.buildSuccessResObj('users', '1', {
      username: 'max4',
      role: 'user',
      banned: false,
      ban_message: null,
      last_logged_in_at: null,
      created_at: '2022-09-04T21:09:24.586Z',
      updated_at: '2022-09-04T21:09:24.586Z',
      ...user,
    })
  }

  public bannedError(banMessage = 'Custom ban message.') {
    return this.buildErrorResObj(['error.api.unauthorized'], { errorsData: { 'error.api.unauthorized': { message: banMessage } }, status: 403 })
  }
}

export default UserController
