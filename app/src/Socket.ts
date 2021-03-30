import { io, Socket } from "socket.io-client"

let socket: Socket

export const connectSocket = (room: string) => {
  socket = io("http://localhost:4000")
  console.log("connect socket")

  socket.emit("join", room)
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

  // console.log("event", { listeners: socket.listeners(event) })
}

export const offSocket = (event: string) => {
  socket.off(event)
}