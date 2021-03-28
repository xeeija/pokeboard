import React, { useState } from "react"
import { Wheel } from "src/components/Wheel"

interface Props { }

const randInt = (min = 0, max: number) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min))

export const Randomon: React.FC<Props> = () => {
  const [names, setNames] = useState<string[]>([])
  const [winner, setWinner] = useState("")
  const [rotation, setRotation] = useState(0)

  const spin = (onFinish: (winner: string) => void, spinTime = 6000) => {
  
    const wheel = document.getElementById("wheel-g")
    const sectorDeg = 360 / names.length
  
    // TODO: Replace with better random generator
    const randoms = [
      randInt(0, names.length - 1), // winner index
      randInt(5, 7), // total rotations per spin
      randInt(10, 90) // how much to rotate into the winner sector
    ]
    
    // 5-7 full rotations, then rotate to winner index and rotate randomly into the winner index
    const rotateToDeg = (randoms[1] * 360) + 360 - (randoms[0] * sectorDeg) - (sectorDeg * randoms[2] / 100) + 90

    wheel?.animate([
      { transform: `rotate(${rotation}deg)` },
      { transform: `rotate(${rotateToDeg}deg)` },
    ], {
      duration: spinTime,
      easing: "cubic-bezier(0.33, 1, 0.68, 1)",
      fill: "forwards"
    })?.addEventListener("finish", _ => {
      onFinish(names[randoms[0]])
      setRotation(rotateToDeg % 360)
    })
  
  }

  return (
    <div className="randomon">
      <Wheel diameter={600} names={names} />

      <textarea
        style={{ height: 400, width: 200, marginLeft: 20 }}
        value={names.join("\n")}
        onChange={e => setNames(e.target.value.split("\n"))}>
      </textarea>

      <button onClick={() => 
        // console.log({ names })
        spin(setWinner)
      }>Spin</button>

      <h4>And the winner is ...</h4>
      <h2>{winner}</h2>

    </div>
  )
}