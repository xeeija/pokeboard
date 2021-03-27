import "reflect-metadata"
import express from "express"
import session from "express-session"
import { PrismaClient } from "@prisma/client"
import { ApolloServer } from "apollo-server-express"
// import { typeDefs } from "./typeDefs"
// import { resolvers } from "./resolvers"
import { HelloResolver } from "./resolvers/hello"
import { buildSchema } from "type-graphql"

const prisma = new PrismaClient()

async function main() {
  // Express 
  const app = express()

  app.use(session({
    name: "gid",
    secret: ["4ty2isTHE4answer2Every!thinG."],
    resave: false,
    saveUninitialized: false, // save nothing until session is saved (eg. logged in)
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 // 1h
    }
  }))

  // const typeDefs = gql`
  // type Query {
  //   hello: String
  // }`

  // const server = new ApolloServer({ typeDefs, resolvers })

  const server = new ApolloServer({ 
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false
    })
  })

  server.applyMiddleware({ app })

  // Express GraphQL
  // app.use("/graphql",
  //   graphqlHTTP({
  //     schema: schema,
  //     rootValue: resolvers
  //   }))

  // // Graphql Playground
  // app.get("/playground", expressPlayground({ endpoint: "/graphql" }))

  app.get("/", (_, res) => {
    // console.log(req.session)
    res.status(200).send("Hello world")
  })

  const test = async () => {
    const users = await prisma.user.findMany()
    console.log(users)
  }
  test()

  app.listen(4000, () => {
    console.log(` Server started at http://localhost:4000`)
  })

}

main()
  .catch(e => {
    console.error(e)
    throw e
  })
  .finally(async () => await prisma.$disconnect())

// async function main() {
  // await prisma.user.create({
  //   data: {
  //     email: "jane@doe.com",
  //     name: "Jane Doe"
  //   }
  // })

// }

// main()
//   .catch(e => { throw e })
//   .finally(async () => await prisma.$disconnect())


  // app.listen(4000)
  // console.log("GraphQL server running at http://localhost:4000/graphql")