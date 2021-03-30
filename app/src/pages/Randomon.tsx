import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router"
import { Wheel } from "src/components/Wheel"
import { connectSocket, disconnectSocket, emitSocket, offSocket, onSocket } from "src/Socket"
// import { io } from "socket.io-client"

interface Props { }

interface SpinOptions {
  names: string[],
  duration?: number,
  onStart?: (spinTime: number, rotateAmount: number) => void,
  onFinish?: (winner: string) => void,
  startRotation?: number,
  rotateAmount?: number,
}

interface Winner {
  name: string,
  date: string,
}

const randInt = (min = 0, max: number) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min))

const spin = (options: SpinOptions) => {

  const {
    names,
    duration = 6000,
    onStart,
    onFinish,
    startRotation = 0,
    rotateAmount = 0,
  } = options

  const wheel = document.getElementById("wheel-g")
  const sectorDeg = 360 / names.length

  // TODO: Replace with better random generator
  const randoms = [
    randInt(0, names.length - 1), // winner index
    randInt(5, 6), // total rotations per spin
    randInt(10, 90) // how much to rotate into the winner sector
  ]

  // 5-7 full rotations, then rotate to winner index and rotate randomly into the winner index
  // rotate given amount from socket if another one is spinning
  const rotateTo = rotateAmount || (randoms[1] * 360) + 360 - (randoms[0] * sectorDeg) - (sectorDeg * randoms[2] / 100) + 90

  if (onStart) onStart(duration, rotateTo)

  wheel?.animate([
    { transform: `rotate(${startRotation}deg)` }, // 'from' keyframe
    { transform: `rotate(${rotateTo}deg)` }, // 'to' keyframe
  ], {
    duration: duration,
    easing: "cubic-bezier(0.12, 0, 0.25, 1)", // 0.1, 0, 0.4, 1 -- 0.33, 1, 0.68, 1 
    fill: "forwards" // keep style of last keyframe
  })?.addEventListener("finish", _ => {
    if (onFinish) onFinish(names[randoms[0]])
    // setRotation(rotateToDeg % 360)
  })
}

export const Randomon: React.FC<Props> = () => {
  const [names, setNames] = useState<string[]>([])
  const [winners, setWinners] = useState<Winner[]>([])

  const { id } = useParams<{ id: string }>()
  const spinButtonRef = useRef<HTMLButtonElement>(null)
  const namesTextRef = useRef<HTMLTextAreaElement>(null)

  // const [rotation, setRotation] = useState(0)
  // const [winner, setWinner] = useState("")
  // const [socket, setSocket] = useState<Socket | null>(null)

  // Runs only once when component is mounted
  // because dependency array (2nd param) is empty []
  useEffect(() => {
    // Connect to socket and join the given room
    connectSocket("tesetroom2")

    // console.log("useEffect connect")

    // TODO: Add base rotation to init or spin from current rotation (instead of given, in case of first spin after join)
    // Initialize names and winners from the room
    // Server sends a join event back for received join event (sent in connectSocket())
    onSocket("join", (names: string[], winners: Winner[]) => {
      // console.log(" initial names and winners", { names, winners })
      setNames(names)
      setWinners(winners)
    })

    // joinSocket("testroom2")

    // Listen to winner updates from other (should only occur after spins)
    onSocket("winner", (newWinners: Winner[]) => {
      // console.log("new winner list", { newWinners, spinButtonRef })
      if (spinButtonRef.current) { spinButtonRef.current.disabled = false }
      if (namesTextRef.current) { namesTextRef.current.disabled = false }
      setWinners(newWinners)
    })

    // Listen to name updates from others
    onSocket("names", (newNames: string[]) => {
      // console.log("incoming names update", { newNames })
      setNames(newNames)
    })

    // returns, when component is dismounted (removed from dom): disconnect from socket
    return () => {
      // console.log("disconnected")
      disconnectSocket()
    }
  }, [])

  // Runs when component is mounted and when names are updated
  useEffect(() => {
    // onSocket("connect", () => {
    //   console.log("connected")
    //   // emitSocket("join", "testroom")
    // })
    // console.log("useEffect names")

    // Listen to other spins, and show the same spin, when others are spinning
    onSocket("spin", (duration: number, rotateAmount: number) => {
      // console.log("incoming spin", { duration, rotateAmount, spinButtonRef })
      if (spinButtonRef.current) { spinButtonRef.current.disabled = true }
      if (namesTextRef.current) { namesTextRef.current.disabled = true }

      spin({
        names,
        duration,
        rotateAmount,
        onFinish: () => {
          if (spinButtonRef.current) { spinButtonRef.current.disabled = false }
          if (namesTextRef.current) { namesTextRef.current.disabled = false }

        }
      })
    })

    // Cleanup (remove) all listeners before useEffect is called again (or component dismounted)
    return () => offSocket("spin")

  }, [names])

  //#region Old useEffect
  /*
    useEffect(() => {
      const socket = io("http://localhost:4000")

      if (!socket) { console.log({ socket }); return }

      socket.on("connect", () => {
        console.log("connected")
        socket.emit("join", "testroom")
      })

      // Do "same" spin, when someone else in the room is spinning
      socket.on("spin", (spinTime, rotateAmount) => {
        console.log("incoming spin")
        spin({
          spinTime,
          rotateAmount,
          onFinish: () => {
            if (spinButtonRef.current) spinButtonRef.current.disabled = false
          }
        })
      })

      // Update winners from other (usually after spin)
      socket.on("winner", (newWinners) => {
        console.log("new winner list")
        if (spinButtonRef.current) spinButtonRef.current.disabled = false
        setWinners(newWinners)
      })

      // returns, when component is dismounted: disconnect from socket
      return () => {
        console.log("disconnected")
        socket.disconnect()
      }
    })
  */
  //#endregion

  return (
    <div className="randomon">

      <div>Your ID is "{id}"</div>

      <p>Create new Randomon Wheel</p>
      <button onClick={() => { }} >Create</button>

      <div>
        <Wheel diameter={600} names={names} />

        <textarea
          ref={namesTextRef}
          style={{ height: 400, width: 200, marginLeft: 20 }}
          value={names.join("\n")}
          onChange={e => {
            const nameList = e.target.value.split("\n")
            setNames(nameList)
          }}
          onBlur={(e) => emitSocket("names", e.target.value.split("\n"))}
        />

        <button ref={spinButtonRef} onClick={() => {
          // console.log({ names })
          if (spinButtonRef.current) spinButtonRef.current.disabled = true
          if (namesTextRef.current) namesTextRef.current.disabled = true

          spin({
            names,
            onStart: (duration, rotateAmount) => {
              // console.log({ spinTime, rotateAmount })
              emitSocket("spin", duration, rotateAmount)
            },
            onFinish: winnerName => {
              if (spinButtonRef.current) spinButtonRef.current.disabled = false
              if (namesTextRef.current) namesTextRef.current.disabled = false


              const winner: Winner = {
                name: winnerName,
                date: new Date(Date.now()).toLocaleTimeString()
              }

              // setWinner(w)
              setWinners([...winners, winner])

              emitSocket("winner", winner)
            }
          })

        }}>Spin</button>

        <h4>And the winner is ...</h4>
        <h2>{winners[winners.length - 1]?.name ?? ""}</h2>

        <h4>Previous winners:</h4>
        <ul>
          {winners.map((w, i) => (<li key={"li-winner-" + i}><b>{w.name}</b>, {w.date}</li>))}
        </ul>
      </div>

    </div>
  )
}