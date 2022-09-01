import idPrimitive from '@/lib/zod/primitives/id-primitive'
import { z } from 'zod'

const Jwt = z.object({
  id: idPrimitive,
  jwt: z.string(),
})

type Jwt = z.infer<typeof Jwt>;

export default Jwt
