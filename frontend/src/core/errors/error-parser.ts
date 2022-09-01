import { mapKeys, camelCase } from 'lodash'
import ApiError from './api-error'
import CombinedApiError from './combined-api-error'

class ErrorParser {
  static async parseNetworkErrors(response: Response): Promise<CombinedApiError> {
    try {
      const body = await response.json()
      const attributes = mapKeys(body?.data?.attributes, (_, key) => camelCase(key))
      const errorCodes = attributes.errors as string[]
      const errorsData = attributes.errorsData as any
      const parsedErrors: ApiError[] = []

      errorCodes.forEach((errorCode) => {
        parsedErrors.push(new ApiError(errorCode, response.status, errorsData[errorCode]))
      })

      return new CombinedApiError(parsedErrors)
    } catch (error) {
      return new CombinedApiError([new ApiError('error.api.unexpected', 500)])
    }
  }
}

export default ErrorParser
