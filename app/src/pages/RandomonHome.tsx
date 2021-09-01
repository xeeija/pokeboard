import React, { useEffect } from "react"
import { Button, Paper, Typography } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { connectSocket, createSocket, disconnectSocket } from "src/Socket"
import { useStyles } from "src/Theme"

interface Props { }

// const createRandomon = () => { }

export const RandomonHome: React.FC<Props> = () => {
  const cl = useStyles()
  const history = useHistory()

  useEffect(() => {
    return disconnectSocket()
  })

  return (
    <Paper elevation={2} className={cl.pad} >
      <Typography paragraph>You don't have any open Random Wheels.</Typography>

      <Button variant="contained" color="secondary" onClick={() => {
        connectSocket()
        createSocket(id => {
          history.push(`/randomon/${id}`)
        })

      }}>
        Create
        </Button>
    </Paper>
  )
}