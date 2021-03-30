import { io, Socket } from "socket.io-client"

let socket: Socket

export const connectSocket = () => {
  if (socket?.connected) {
    console.log("Already connected", socket.id.substr(0, 4))
    return
  }

  socket = io("http://localhost:4000")
  // console.log("connect socket")

  // socket.emit("join", room)
}

export const createSocket = (callback: (id: string) => void) => {
  socket.emit("create")
  socket.once("create", callback)
}

export const joinSocket = (room: string) => {
  socket.emit("join", room)
}

export const disconnectSocket = () => {
  // console.log("disconnect socket")
  if (socket) socket.disconnect()
}

export const emitSocket = (event: string, ...args: any[]) => {
  // console.log("emit socket", { socket, event, args })
  if (socket) socket.emit(event, ...args)
}

export const onSocket = (event: string, callback: (...args: any[]) => void) => {
  // if (event !== "spin") { console.log("setup on socket", { socket, event, callback }) }

  socket.on(event, callback)
  // socket.on(event, (...args) => {
  //   console.log("got event", { event, args })
  //   callback(...args)
  // })

  // console.log("event", { listeners: socket.listeners(event) })
}

export const offSocket = (event: string) => {
  socket.off(event)
}