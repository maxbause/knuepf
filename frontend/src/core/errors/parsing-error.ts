import KnuepfError from './knuepf-error'

class ParsingError extends KnuepfError {
  constructor() {
    super('error.parsingError.unexpected')
  }
}

export default ParsingError
