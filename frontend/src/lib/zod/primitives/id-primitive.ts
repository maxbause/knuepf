import { z } from 'zod'

const idPrimitive = z.preprocess((val: any) => {
  if (typeof val === 'string') {
    return parseInt(val, 10)
  }
}, z.number())

export default idPrimitive
