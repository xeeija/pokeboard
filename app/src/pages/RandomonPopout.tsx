import React, { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { spin, Wheel } from "src/components/Wheel"
import { connectSocket, disconnectSocket, joinSocket, offSocket, onSocket } from "src/Socket"

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
  const { id } = useParams<{ id: string }>()

  const diameter = useDiameter()

  useEffect(() => {
    // Remove background and styles, so only 
    const html = document.getElementsByTagName("html")[0]
    if (html) {
      html.style.backgroundColor = "transparent"
      html.style.margin = "0px auto"
      html.style.overflow = "hidden"
    }

    // Setup socket for names
    connectSocket()
    joinSocket(id)

    const namesHandler = (names: string[]) => setNames(names)

    onSocket("join", namesHandler)
    onSocket("names", namesHandler)

    return () => disconnectSocket()
  }, [id])

  // Runs when component is mounted and when names are updated
  useEffect(() => {

    // Listen to other spins, and show the same spin, when others are spinning
    onSocket("spin", (duration: number, rotateAmount: number) => {
      spin({ names, duration, rotateAmount, fade: true })
    })

    // Cleanup (remove) all listeners before useEffect is called again (or component dismounted)
    return () => offSocket("spin")

  }, [names])

  return (
    <>
      <Wheel diameter={diameter} names={names} fade={true} />
    </>
  )
}