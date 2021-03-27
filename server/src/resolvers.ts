import { PrismaClient } from ".prisma/client"
import argon2 from "argon2"

export const resolvers = {
  Query: {
    hello: () => "Hello world"
  },
  Mutation: {
    register: async (_: any, { username, password }: any) => {
      const prisma = new PrismaClient()
      const passwordHash = await argon2.hash(password, { salt: Buffer.from("K9(ahLd/6dvv%5dfvkÜ+#'D2;Dkah$5") })

      await prisma.user.create({
        data: {
          username,
          password: passwordHash
        }
      })

      return true
    }
  }
}