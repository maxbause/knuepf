import dateStringPrimitive from '@/lib/zod/primitives/date-string-primitive'
import idPrimitive from '@/lib/zod/primitives/id-primitive'
import { z } from 'zod'

export enum Roles {
  User = 'user',
  Admin = 'admin',
}

const User = z.object({
  id: idPrimitive,
  username: z.string(),
  role: z.nativeEnum(Roles),
  banned: z.boolean(),
  banMessage: z.nullable(z.string()),
  lastLoggedInAt: z.nullable(dateStringPrimitive),
  createdAt: dateStringPrimitive,
  updatedAt: dateStringPrimitive,
})

type User = z.infer<typeof User>;

export default User
