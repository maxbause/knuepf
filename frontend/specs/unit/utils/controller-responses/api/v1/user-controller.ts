import Controller from '../../controller'

class UserController extends Controller {
  public show(user?: any) {
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

  public createJwt(jwt?: string) {
    return this.buildSuccessResObj('jwt', '1', {
      // eslint-disable-next-line max-len
      jwt: jwt || 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlzc3VlZF9hdCI6MTY2MjU3OTY4OH0.l-13X1iE9D7SnNxGP9JcvCFT58xZP_qNQXca1lvpi4Q',
    })
  }

  public deleteJwt() {
    return this.buildStatusRes(200)
  }

  public deleteJwtError() {
    return this.buildStatusRes(500)
  }

  public createJwtError() {
    return this.buildErrorResObj(['error.api.unauthorized'], { status: 403 })
  }

  public bannedError(banMessage = 'Custom ban message.') {
    return this.buildErrorResObj(['error.api.unauthorized'], { errorsData: { 'error.api.unauthorized': { message: banMessage } }, status: 403 })
  }
}

export default UserController
