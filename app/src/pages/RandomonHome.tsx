import React, { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { connectSocket, createSocket, disconnectSocket } from "src/Socket"

interface Props { }

// const createRandomon = () => { }

export const RandomonHome: React.FC<Props> = () => {
  const history = useHistory()

  useEffect(() => {
    return disconnectSocket()
  })

  return (
    <>
      <p>Create new Randomon Wheel</p>
      <button onClick={() => {
        connectSocket()
        createSocket(id => {
          history.push(`/randomon/${id}`)
        })
        
      }} >Create</button>
    </>
  )
}