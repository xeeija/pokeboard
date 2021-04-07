import React, { useEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router"
import { Button, Container, Grid, IconButton, InputAdornment, List, ListItem, ListItemSecondaryAction, ListItemText, Paper, Tab, Tabs, TextField, Typography } from "@material-ui/core"
import { Delete, HourglassEmptyRounded, Send } from "@material-ui/icons"
import { TabPanel } from "src/components/TabPanel"
import { spin, Wheel } from "src/components/Wheel"
import { connectSocket, disconnectSocket, emitSocket, joinSocket, offSocket, onSocket } from "src/Socket"
import { useStyles } from "src/Theme"

interface Props { }

interface Winner {
  name: string,
  date: string,
}

export const Randomon: React.FC<Props> = () => {

  // Variables
  const [names, setNames] = useState<string[]>([])
  const [winners, setWinners] = useState<Winner[]>([])
  // const [checkedNames, setCheckedNames] = useState<string[]>([])

  // Routing
  const { id } = useParams<{ id: string }>()
  const history = useHistory()

  // Elements, Styling
  const cl = useStyles()
  const spinButtonRef = useRef<HTMLButtonElement>(null)
  const namesTextRef = useRef<HTMLTextAreaElement>(null)

  const addNameRef = useRef<HTMLInputElement>(null)

  const [tab, setTab] = useState(0)
  // const [nameText, setNameText] = useState("")

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

  // TODO: Confirmation, and Snackbar "Deleted name"
  const deleteName = (index: number) => {
    // newNames = names would set newNames to the same reference as names
    // newNames = [...names] creates a new list with the destructured names
    const newNames = [...names]
    newNames.splice(index, 1)
    setNames(newNames)
    emitSocket("names", newNames)
  }

  const addName = (name: string) => {
    if (name.trim() === "") {
      if (addNameRef.current) addNameRef.current.value = ""
      return
    }

    const newNames = [...names, name]
    setNames(newNames)
    emitSocket("names", newNames)

    if (addNameRef.current) addNameRef.current.value = ""
  }

  // const handleListToggle = (value: string) => () => {
  //   const newChecked = [...checkedNames]
  //   const index = checkedNames.indexOf(value)

  //   // Adds value of clicked item or removes it (based on checked state)
  //   if (index === -1) { newChecked.push(value) }
  //   else { newChecked.splice(index) }

  //   setCheckedNames(newChecked)
  // }

  // TODO: Replace paper with card, so all have the same layout
  return (
    <>
      {/* Row */}
      <Grid container spacing={2} alignItems="flex-start">

        {/* First Column */}
        <Grid item container xs={8} spacing={2}>

          {/* Wheel */}
          <Grid item xs={12}>
            <Paper className={cl.pad}>
              <Wheel diameter={600} names={names} />
            </Paper>
          </Grid>

          {/* Winner */}
          <Grid item xs >
            <Paper className={cl.pad}>
              <Grid item xs>

                <Container>
                  <Typography>And the winner is ...</Typography>
                  <Typography variant="h4">
                    {winners[0]?.name ?? ""}
                  </Typography>
                </Container>

              </Grid>

              <Grid item xs style={{ textAlign: "right" }} >
                <Button ref={spinButtonRef}
                  variant="contained"
                  color="secondary"
                  onClick={() => {
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
                        setWinners([winner, ...winners])

                        emitSocket("winner", winner)
                      }
                    })
                  }}>
                  Spin
                </Button>
              </Grid>

            </Paper>
          </Grid>

        </Grid>

        {/* Second column */}
        <Grid item container xs spacing={2} alignItems="stretch" >

          {/* Share Link */}
          <Grid item xs={12}>
            <Paper className={cl.pad}>
              <TextField
                fullWidth
                variant="outlined"
                color="primary"
                label="Share"
                size="small"
                defaultValue={`${window.location.host}${window.location.pathname}`}
                InputProps={{ readOnly: true }}
                onFocus={e => e.target.select()} />
            </Paper>
          </Grid>

          {/* Name/Winner List */}
          <Grid item xs >
            <Paper>

              <Tabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary">
                <Tab label="Current Names" />
                <Tab label="Previous Winners" />
              </Tabs>

              {/* Names Tab */}
              <TabPanel index={0} activeTab={tab}>
                <List className={cl.list}>
                  {names.map((name, i) => (
                    <ListItem key={i} role={undefined} dense button className={cl.hoverBase}>
                      <ListItemText id={`name-list-${i}`} primary={name} />
                      <ListItemSecondaryAction className={cl.hoverItem}>
                        <IconButton onClick={() => deleteName(i)}>
                          <Delete fontSize="small" color="error" />
                        </IconButton>
                        {/* <Checkbox edge="end" onChange={handleListToggle(name)} checked={checkedNames.includes(name)} 
                        inputProps={{ 'aria-labelledby': `name-list-${name}` }} /> */}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>

                <TextField className={cl.textfield}
                  variant="filled"
                  color="primary"
                  size="small"
                  label="Add name"
                  fullWidth
                  onKeyPress={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      addName(addNameRef.current?.value ?? "")
                    }
                  }}
                  InputProps={{
                    inputRef: addNameRef,
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment className={cl.endAdornment} position="end">
                        <IconButton aria-label="Add name" edge="end"
                          onClick={() => addName(addNameRef.current?.value ?? "")}>
                          <Send />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }} />

              </TabPanel>

              {/* Winners Tab */}
              <TabPanel index={1} activeTab={tab}>
                {winners.length > 0 ?
                  // Winners present
                  <>
                    <Container className={cl.padh}>
                      <Typography variant="overline" color="textSecondary">Latest winner</Typography>
                      <Typography variant="h4">
                        {winners[0]?.name}
                        <Typography component="span" className={cl.padh} color="textSecondary"> {winners[0]?.date}</Typography>
                      </Typography>
                    </Container>

                    <List className={cl.list}>
                      {winners.filter((_, i) => i !== 0).map(({ name, date }, i) => (
                        <ListItem key={`winner-list-${i}`} role={undefined} dense button>
                          <ListItemText primary={name} secondary={date} />
                        </ListItem>
                      ))}
                    </List>
                  </> :
                  // No winners yet
                  <Container className={cl.pad} style={{ textAlign: "center" }}>
                    <HourglassEmptyRounded className={cl.mar} fontSize="large" />
                    <Typography variant="h6" className={cl.padb}>No one has won yet ...</Typography>
                  </Container>
                }
              </TabPanel>

            </Paper>
          </Grid>

        </Grid>
      </Grid>

      {/* <Grid item xs>
            <Paper className={cl.pad}>
              <Typography variant="body1">Previous Winners</Typography>
              <ul>
                {winners.map((w, i) => (<li key={"li-winner-" + i}><b>{w.name}</b>, {w.date}</li>))}
              </ul>
            </Paper>
          </Grid> */}

      {/* <textarea
        ref={namesTextRef}
        value={names.join("\n")}
        onChange={e => {
          const nameList = e.target.value.split("\n")
          setNames(nameList)
        }}
        onBlur={(e) => emitSocket("names", e.target.value.split("\n"))}
      /> */}

      {/* <p>
        <b>Share Randomon</b> <input readOnly
          id="shareRoom"
          style={{ width: 350, fontSize: "1rem", textAlign: "center" }}
          value={window.location.href}
          onFocus={e => e.target.select()} /> 

         <button onClick={async () => {

          const result = await navigator.permissions.query({ name: "clipboard-write" })

          if (result.state === "granted" || result.state === "prompt") {
            navigator.clipboard.writeText(window.location.href)
          }
          // document.querySelector("#shareButton").select()
          // document.execCommand("copy")
        }}>Copy</button> 
      </p> */}

      {/* <div>
        <h4>And the winner is ...</h4>
        <h2>{winners[winners.length - 1]?.name ?? ""}</h2>

        <h4>Previous winners:</h4>
        <ul>
          {winners.map((w, i) => (<li key={"li-winner-" + i}><b>{w.name}</b>, {w.date}</li>))}
        </ul>
      </div> */}

    </>
  )
}