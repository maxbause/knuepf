import { z } from 'zod'

const dateStringPrimitive = z.preprocess((val: any) => {
  if (typeof val === 'string' || val instanceof Date) {
    return new Date(val)
  }
}, z.date())

export default dateStringPrimitive
