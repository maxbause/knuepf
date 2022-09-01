import { merge, camelCase, mapKeys } from 'lodash'
import Cookie from 'js-cookie'
import User from '@/core/models/user'
import Jwt from '@/core/models/jwt'
import ErrorParser from '@/core/errors/error-parser'

interface ParsedResponse<ProcessedEntityType> extends Response {
  parsedBody?: any
  processedBody?: ProcessedEntityType[]
}

const flattenAndCamelCaseJsonEntity = (data: any): object => ({
  id: data.id,
  ...mapKeys(data.attributes, (_, key) => camelCase(key)),
})

const mapJsonToEntity = (rawJsonEntity: any): any => {
  switch (rawJsonEntity.type) {
    case 'users':
      return User.parse(flattenAndCamelCaseJsonEntity(rawJsonEntity))
    case 'jwt':
      return Jwt.parse(flattenAndCamelCaseJsonEntity(rawJsonEntity))
    default:
      throw new Error(`Unsupported model '${rawJsonEntity.type}'`)
  }
}

const request = async <ProcessedEntityType>(path: string, props: RequestInit | undefined) => {
  const propsWithAuthenticationHeader: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const jwt = Cookie.get('knuepf-user-jwt')

  if (jwt) {
    (propsWithAuthenticationHeader.headers as any).token = jwt
  }
  merge(propsWithAuthenticationHeader, props)

  const res: ParsedResponse<ProcessedEntityType> = await fetch(`${process.env.VUE_APP_API_BASE_URL}${path}`, propsWithAuthenticationHeader)
  if (res.status < 200 || res.status >= 400) {
    throw await ErrorParser.parseNetworkErrors(res)
  }

  const rawBody = await res.text()
  if (!rawBody.trim()) return res

  res.parsedBody = JSON.parse(rawBody)
  const processedBody: any[] = []
  if (res.parsedBody.jsonapi) {
    const { data } = res.parsedBody
    if (data instanceof Array) {
      data.forEach((x) => processedBody.push(mapJsonToEntity(x)))
    } else {
      processedBody.push(mapJsonToEntity(data))
    }
  }

  res.processedBody = processedBody

  return res
}

const httpRequest = {
  request,
  get: <ProcessedEntityType>(path: string, props?: RequestInit | undefined) => request<ProcessedEntityType>(path, { ...props, method: 'GET' }),
  // eslint-disable-next-line max-len
  post: <ProcessedEntityType>(path: string, body: any, props?: RequestInit | undefined) => request<ProcessedEntityType>(path, { ...props, method: 'POST', body: JSON.stringify(body) }),
  // eslint-disable-next-line max-len
  patch: <ProcessedEntityType>(path: string, body: any, props?: RequestInit | undefined) => request<ProcessedEntityType>(path, { ...props, method: 'PATCH', body: JSON.stringify(body) }),
  // eslint-disable-next-line max-len
  delete: <ProcessedEntityType>(path: string, props?: RequestInit | undefined) => request<ProcessedEntityType>(path, { ...props, method: 'DELETE' }),
}

export default httpRequest
