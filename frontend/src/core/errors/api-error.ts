import KnuepfError from './knuepf-error'

class ApiError extends KnuepfError {
  constructor(_errorCode: string, private _status: number, private _data?: any) {
    super(_errorCode)
  }

  get status(): number {
    return this._status
  }

  get data(): any {
    return this._data
  }
}

export default ApiError
