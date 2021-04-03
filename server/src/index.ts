import "reflect-metadata"
import express from "express"
import session from "express-session"
import { PrismaClient } from "@prisma/client"
import { ApolloServer } from "apollo-server-express"
// import { typeDefs } from "./typeDefs"
// import { resolvers } from "./resolvers"
import { HelloResolver } from "./resolvers/hello"
import { buildSchema } from "type-graphql"
import { createServer } from "http"
import { Server } from "socket.io"
import cryptoRandomString from 'crypto-random-string'

interface Winner {
  name: string,
  date: string,
}

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

  // Socket io
  const httpServer = createServer(app)

  const io = new Server(httpServer, {
    path: process.env.SOCKET_PATH,
    cors: {
      origin: process.env.ORIGIN_URL?.split(" ")
    }
  })

  const namesMap = new Map<string, string[]>()
  const winnersMap = new Map<string, Winner[]>()

  // on "connection" -> serverside, on "connect" -> clientside
  io.on("connection", (socket) => {
    // Connect / disconnect
    // console.log(`${socket.id.substr(0, 4)} connected`)
    // socket.on("disconnect", () => { console.log(`${socket.id.substr(0, 4)} disconnected`) })

    let room = ""

    // Hello
    // socket.emit("hello", "You are now totali connected")

    socket.on("create", () => {
      // Create new room with random string

      const newRoom = cryptoRandomString(10)

      console.log(`${socket.id.substr(0, 4)} created room ${newRoom}`) // ${newRoom.substr(0, 4)}`)

      namesMap.set(newRoom, ["Alice", "Bob", "Charlie"])

      // TODO: Implement mechanism to remove unused rooms from map after a period

      socket.emit("create", newRoom)
    })

    // Join client to room and send current names and winners
    socket.on("join", (roomId: string) => {
      // console.log({ namesMap, room: namesMap.has(room), roomId: namesMap.has(roomId) })

      // Send an error, if the room does not exist in the names map
      if (!namesMap.has(roomId)) {
        console.log(`${socket.id.substr(0, 4)} attempted to join non-existent room ${roomId}`)
        socket.emit("error", "join", "Room not found")
        return
      }

      // console.log(`${socket.id.substr(0, 4)} joined room ${roomId.substr(0, 4)}`)

      // Join client to room and set his room
      socket.join(roomId)
      room = roomId

      // Emit current names and winners to client
      const names = namesMap.get(roomId) // || ["Alice", "Bob"]
      const winners = winnersMap.get(roomId) ?? []
      // console.log({ names, winners })

      socket.emit("join", names, winners)
    })

    socket.on("names", (newNames: string[]) => {
      // console.log(`${socket.id.substr(0, 4)} updated names`)
      namesMap.set(room, newNames)

      socket.broadcast.to(room).emit("names", newNames)
    })

    socket.on("spin", (spinTime: number, rotateAmount: number) => {
      // console.log(`${socket.id.substr(0, 4)} does a barrel roll`)
      socket.broadcast.to(room).emit("spin", spinTime, rotateAmount)
    })

    socket.on("winner", (winner: Winner) => {
      // Update winner list
      // console.log(`${socket.id.substr(0, 4)} picks a winner: ${winner.name}`)
      const winners = winnersMap.get(room) ?? [] // ? [winnersMap.get(room), winner] : [winner]
      const newWinners = [...winners, winner]

      winnersMap.set(room, newWinners)

      socket.broadcast.to(room).emit("winner", newWinners)
    })

  })

  //#region DEBUG Rooms
  /*
  // TODO: DEBUG to reset winner/name
  app.use("/room", (req, res) => {
    const room = req.url.substr(1)

    res.status(200).send({
      names: namesMap.get(room) ?? "",
      winners: winnersMap.get(room) ?? ""
    })
  })

  app.use("/resetroom", (req, res) => {
    // console.log({ params: req.params, query: req.query, url: req.url })

    const room = req.url.substr(1)

    if (namesMap.has(room)) {
      const del = namesMap.delete(room)
      res.status(200).send(del)
      console.log(`Delete room ${room}: ${del}`)
    } else {
      res.status(418).send("I'm a teapot")
    }

  })
  */
  //#endregion

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

  httpServer.listen(process.env.SERVER_PORT, () => {
    console.log(` Server started at http://localhost:${process.env.SERVER_PORT}`)
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