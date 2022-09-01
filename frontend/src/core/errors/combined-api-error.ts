import ApiError from './api-error'

class CombinedApiError extends Error {
  constructor(private _errors: ApiError[]) {
    super(_errors[0].errorCode)
  }

  get errors(): ApiError[] {
    return this._errors
  }

  get firstError(): ApiError {
    return this.errors[0]
  }
}

export default CombinedApiError
