import React, { /* useEffect, */ useState } from "react"
// import { io } from "socket.io-client"
import { Counter } from "src/components/Counter"

interface Props { }

export const Home: React.FC<Props> = () => {

  const [response/* , setResponse */] = useState("")
  
  // useEffect(() => {
  //   const socket = io("http://localhost:4000")

  //   socket.on("connect", () => console.log("connected"))

  //   socket.on("hello", setResponse)

  //   // returns, when component is dismounted: disconnect from socket
  //   return () => {
  //     console.log("disconnected")
  //     socket.disconnect()
  //   }
  // }, [])

  return (
    <div>
      <p>Hello: {response ? response : "Totalli not working, power connectede"}</p>
      <Counter>
        {(count, setCount) => (
          <div>
            <div>{count}</div>
            <button onClick={() => setCount(count + 1)}>Click</button>
          </div>
        )}
      </Counter>
    </div>
  )
}