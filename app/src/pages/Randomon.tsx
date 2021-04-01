import React, { useEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router"
import { spin, Wheel } from "src/components/Wheel"
import { connectSocket, disconnectSocket, emitSocket, joinSocket, offSocket, onSocket } from "src/Socket"

interface Props { }

interface Winner {
  name: string,
  date: string,
}

export const Randomon: React.FC<Props> = () => {

  // Variables
  const [names, setNames] = useState<string[]>([])
  const [winners, setWinners] = useState<Winner[]>([])

  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const spinButtonRef = useRef<HTMLButtonElement>(null)
  const namesTextRef = useRef<HTMLTextAreaElement>(null)

  // const [rotation, setRotation] = useState(0)
  // const [winner, setWinner] = useState("")
  // const [socket, setSocket] = useState<Socket | null>(null)

  // Runs only once when component is mounted
  // because dependency array (2nd param) is empty []
  useEffect(() => {
    // Connect to socket and join the given room
    connectSocket()
    joinSocket(id)

    // console.log("useEffect connect")

    // TODO: Add base rotation to init or spin from current rotation (instead of given, in case of first spin after join)
    // Initialize names and winners from the room
    // Server sends a join event back for received join event (sent in connectSocket())
    onSocket("join", (names: string[], winners: Winner[]) => {
      // console.log(" initial names and winners", { names, winners })
      setNames(names)
      setWinners(winners)
    })

    // Catch error from join event (eg. invalid room)
    onSocket("error", (event: string, msg: string) => {
      console.log("error", { event, msg })
      history.replace("/randomon")
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
    onSocket("names", (names: string[]) => {
      // console.log("incoming names update", { newNames })
      setNames(names)
    })

    // returns, when component is dismounted (removed from dom): disconnect from socket
    // also all listeners are removed upon disconnect
    return () => {
      // console.log("disconnected")
      disconnectSocket()
    }
  }, [id, history])

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


  return (
    <div className="randomon">
      
      <p>
        <b>Share Randomon</b> <input readOnly
          id="shareRoom"
          style={{ width: 350, fontSize: "1rem", textAlign: "center" }}
          value={window.location.href}
          onFocus={e => e.target.select()} />

        {/* <button onClick={async () => {

          const result = await navigator.permissions.query({ name: "clipboard-write" })

          if (result.state === "granted" || result.state === "prompt") {
            navigator.clipboard.writeText(window.location.href)
          }
          // document.querySelector("#shareButton").select()
          // document.execCommand("copy")
        }}>Copy</button> */}
      </p>

      <div>
        <Wheel diameter={600} names={names} />

        <textarea
          ref={namesTextRef}
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