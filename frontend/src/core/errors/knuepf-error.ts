class KnuepfError extends Error {
  constructor(protected _errorCode: string) {
    super(_errorCode)
  }

  get errorCode(): string {
    return this._errorCode
  }
}

export default KnuepfError
