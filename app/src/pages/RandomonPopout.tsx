import React, { useEffect, useRef, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { spin, Wheel } from "src/components/Wheel"
import { connectSocket, disconnectSocket, joinSocket, offSocket, onSocket } from "src/Socket"
import { useStyles } from "src/Theme"

interface Props { }

const useDiameter = () => {
  const query = new URLSearchParams(useLocation().search)
  const d = +(query.get("d") || 0)

  const [windowSize, setWindowSize] = useState(window.innerHeight)

  useEffect(() => {
    // Setup resize for diameter 
    const handleResize = () => setWindowSize(Math.min(window.innerHeight, window.innerWidth))
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return d || windowSize
}

export const RandomonPopout: React.FC<Props> = () => {
  const [names, setNames] = useState<string[]>([])
  const [namesBuffer, setNamesBuffer] = useState([""])
  const [spinning, setSpinning] = useState(false)

  const diameter = useDiameter()

  const cl = useStyles()
  const { id } = useParams<{ id: string }>()
  const wheelRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Remove background and styles, so only 
    const body = document.getElementsByTagName("body")[0]
    if (body) {
      body.style.backgroundColor = "transparent"
      body.style.margin = "0px auto"
      body.style.overflow = "hidden"
    }

    // Setup socket for names
    connectSocket()
    joinSocket(id)

    const namesHandler = (names: string[]) => {
      // Update names directly, if not spinning
      // write changes into a buffer while spinning (updates after the spin)
      if (!spinning) setNames(names)
      else setNamesBuffer(names)
    }

    onSocket("join", namesHandler)
    onSocket("names", namesHandler)

    return () => disconnectSocket()
  }, [id, spinning])

  // Runs when component is mounted and when names are updated
  useEffect(() => {

    // Listen to other spins, and show the same spin, when others are spinning
    onSocket("spin", (duration: number, rotateAmount: number) => {
      setNamesBuffer(names)
      setSpinning(true)
      spin({
        names,
        duration,
        rotateAmount,
        fade: {
          ref: wheelRef,
          class: cl.fadeIn
        },
        onFinish: () => setTimeout(() => {
          // Update names with the new buffer
          setNames(namesBuffer)
          setSpinning(false)
        }, 5500)
      })
    })

    // Cleanup (remove) all listeners before useEffect is called again (or component dismounted)
    return () => offSocket("spin")

  }, [names, cl.fadeIn, namesBuffer])

  return (
    <>
      <Wheel diameter={diameter} names={names} fade={true} wheelRef={wheelRef} />
    </>
  )
}