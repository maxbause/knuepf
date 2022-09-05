import { MockResponseInit } from 'jest-fetch-mock'

type BuildErrorResObjRest = {
  errorsData?: any
  status?: number
}

class Controller {
  // eslint-disable-next-line class-methods-use-this
  protected buildRes(body: any = '', status: number = 200, headers: any = undefined): MockResponseInit {
    const mergedHeaders = {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': 0,
      'X-Content-Type-Options': 'nosniff',
      'X-Permitted-Cross-Domain-Policies': 'none',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Type': 'application/vnd.api+json',
      'Cache-Control': 'no-cache',
      ...headers,
    }

    return {
      body: JSON.stringify(body), status, headers: mergedHeaders,
    }
  }

  protected buildSuccessResObj(type: string, id: string, attributes: any): MockResponseInit {
    const body = {
      data: {
        id,
        type,
        attributes,
      },
      jsonapi: {
        version: '1.0',
      },
    }
    return this.buildRes(body, 200)
  }

  protected buildErrorResObj(errorCodes: string[], rest?: BuildErrorResObjRest): MockResponseInit {
    const body = {
      data: {
        id: '1',
        type: 'errors',
        attributes: {
          errors: errorCodes,
          errors_data: rest?.errorsData || {},
        },
      },
      jsonapi: {
        version: '1.0',
      },
    }
    return this.buildRes(body, rest?.status || 500)
  }
}

export default Controller
