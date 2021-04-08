import React, { useEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router"
import {
  Badge,
  Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton,
  InputAdornment, List, ListItem, ListItemSecondaryAction, ListItemText, Paper, Tab, Tabs, TextField, Typography
} from "@material-ui/core"
import { RotateLeftRounded, DeleteRounded, HourglassEmptyRounded, SendRounded, CollectionsRounded } from "@material-ui/icons"
import { TabPanel } from "src/components/TabPanel"
import { spin, Wheel } from "src/components/Wheel"
import { connectSocket, disconnectSocket, emitSocket, joinSocket, offSocket, onSocket } from "src/Socket"
import { cls, useStyles } from "src/Theme"

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
  const [spinning, setSpinning] = useState(false)

  // Routing
  const { id } = useParams<{ id: string }>()
  const history = useHistory()

  // Elements, Styling
  const cl = useStyles()
  // const spinButtonRef = useRef<HTMLButtonElement>(null)
  // const namesTextRef = useRef<HTMLTextAreaElement>(null)

  const addNameRef = useRef<HTMLInputElement>(null)

  const [tab, setTab] = useState(0)
  const [winnerDialogOpen, setWinnerDialogOpen] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)

  const [lastWinner, setLastWinner] = useState<{ name: string, index: number } | null>(null)
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
      // if (spinButtonRef.current) { spinButtonRef.current.disabled = false }
      // if (namesTextRef.current) { namesTextRef.current.disabled = false }
      setSpinning(false)
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
      // if (spinButtonRef.current) { spinButtonRef.current.disabled = true }
      // if (namesTextRef.current) { namesTextRef.current.disabled = true }
      setSpinning(true)

      spin({
        names,
        duration,
        rotateAmount,
        onFinish: () => {
          // if (spinButtonRef.current) { spinButtonRef.current.disabled = false }
          // if (namesTextRef.current) { namesTextRef.current.disabled = false }
          setSpinning(false)
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
    if (spinning) return // dont do anything while spinning
    if (name.trim() === "") {
      if (addNameRef.current) addNameRef.current.value = ""
      return
    }

    const newNames = [...names, name]
    setNames(newNames)
    emitSocket("names", newNames)

    if (addNameRef.current) addNameRef.current.value = ""
  }

  const handleSpin = () => {
    // console.log({ names })
    // if (spinButtonRef.current) spinButtonRef.current.disabled = true
    // if (namesTextRef.current) namesTextRef.current.disabled = true
    setSpinning(true)

    spin({
      names,
      onStart: (duration, rotateAmount) => {
        // console.log({ spinTime, rotateAmount })
        emitSocket("spin", duration, rotateAmount)
      },
      onFinish: (winnerName, winnerIndex) => {
        // if (spinButtonRef.current) spinButtonRef.current.disabled = false
        // if (namesTextRef.current) namesTextRef.current.disabled = false
        setSpinning(false)

        const winner: Winner = {
          name: winnerName,
          date: new Date(Date.now()).toLocaleTimeString()
        }

        // Remove winner when "remove" is clicked in dialog
        setLastWinner({ name: winnerName, index: winnerIndex })
        handleWinnerDialogOpen()

        // setWinner(w)
        setWinners([...winners, winner])

        emitSocket("winner", winner)
      }
    })
  }

  const handleWinnerDialogOpen = () => setWinnerDialogOpen(true)
  const handleWinnerDialogClose = () => {
    setLastWinner(null)
    setWinnerDialogOpen(false)
  }
  const handleWinnerDialogRemove = () => {
    console.log({ lastWinner })
    if (lastWinner !== null) deleteName(lastWinner.index)
    handleWinnerDialogClose()
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
    <Container className={cl.root}>
      {/* Row */}
      <Grid container spacing={2}>

        {/* First Column */}
        <Grid item container xs={8} spacing={2}>

          {/* Wheel */}
          <Grid item xs={12}>
            <Paper className={cls(cl.pad, cl.stretch)}>
              <Container style={{ textAlign: "center" }} className={cl.stretch}>
                <Wheel diameter={600} names={names} />
              </Container>
            </Paper>
          </Grid>

          {/* Control Buttons */}
          <Grid item xs>
            <Paper className={cl.pad}>
              <Grid container spacing={1} direction="row-reverse">

                {/* Spin Button */}
                <Grid item style={{ paddingLeft: 8 }}>
                  <Badge badgeContent={names.length} color="error">
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={spinning || names.length === 0}
                      startIcon={<RotateLeftRounded />}
                      onClick={handleSpin}>
                      Spin
                    </Button>
                  </Badge>

                  {/* Winner Dialog */}
                  <Dialog
                    maxWidth="xs" fullWidth
                    open={winnerDialogOpen}
                    onClose={handleWinnerDialogClose}
                    aria-labelledby="winner-dialog-title"
                    aria-describedby="winner-dialog-description">
                    <Typography component={DialogTitle} color="textSecondary" id="winner-dialog-title">
                      Congratulations!
                      </Typography>
                    <DialogContent>
                      <DialogContentText id="winner-dialog-description">
                        <Typography color="textPrimary" variant="h4">{lastWinner?.name ?? ""}</Typography>
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleWinnerDialogClose} color="primary" variant="outlined">
                        Close
                      </Button>
                      <Button onClick={handleWinnerDialogRemove} color="primary" variant="contained" >
                        Remove
                      </Button>
                    </DialogActions>
                  </Dialog>

                </Grid>

                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={spinning}
                    startIcon={<CollectionsRounded />}
                    href={window.location.href + "/popout"}
                    target="_blank">
                    Popout
                  </Button>
                </Grid>

                {/* Clear Button */}
                <Grid item>
                  <Button
                    variant="outlined"
                    className={cl.errorOutlined}
                    disabled={spinning}
                    startIcon={<DeleteRounded />}
                    onClick={() => setClearDialogOpen(true)}>
                    Clear
                  </Button>

                  {/* TODO: Add undo function for deleted names */}
                  <Dialog
                    maxWidth="xs" fullWidth
                    open={clearDialogOpen}
                    onClose={() => setClearDialogOpen(false)}
                    aria-labelledby="name-dialog-title"
                    aria-describedby="name-dialog-description">
                    <DialogTitle id="name-dialog-title">Clear names?</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="name-dialog-description">
                        Do you really want to delete all names?<br />
                        This cannot be undone.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button color="primary" variant="outlined" onClick={() => setClearDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button className={cl.errorOutlined} variant="outlined" onClick={() => {
                        setNames([])
                        emitSocket("names", [])
                        setClearDialogOpen(false)
                      }}>
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>



                {/* And the winner is */}
                <Grid item xs>
                  {/* <Container>
                    <Typography color="textSecondary">
                      And the winner is ...
                    </Typography>
                    <Typography variant="h4" color={winners.length > 0 ? "textPrimary" : "textSecondary"}>
                      {winners[winners.length - 1]?.name ?? "¯\\_(ツ)_/¯"}
                    </Typography>
                  </Container> */}
                </Grid>
              </Grid>
            </Paper>
          </Grid>

        </Grid>

        {/* Second column */}
        <Grid item container xs={4} spacing={2} direction="column" zeroMinWidth >

          {/* Share Link */}
          <Grid item>
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
          <Grid item xs>
            <Paper className={cl.stretch}>

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
                <List className={cl.list} style={{ maxHeight: 490 }}>
                  {names.map((name, i) => (
                    <ListItem key={i} role={undefined} dense button className={cl.hoverBase}>
                      <ListItemText id={`name-list-${i}`} primary={name} />
                      <ListItemSecondaryAction className={cl.hoverItem}>
                        <IconButton onClick={() => deleteName(i)}>
                          <DeleteRounded fontSize="small" color="error" />
                        </IconButton>
                        {/* <Checkbox edge="end" onChange={handleListToggle(name)} checked={checkedNames.includes(name)} 
                        inputProps={{ 'aria-labelledby': `name-list-${name}` }} /> */}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>

                <TextField className={cl.mart}
                  variant="filled"
                  color="primary"
                  size="small"
                  label="Add name"
                  fullWidth
                  // disabled={spinning}
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
                        <IconButton aria-label="Add name" edge="end" disabled={spinning}
                          onClick={() => addName(addNameRef.current?.value ?? "")}>
                          <SendRounded />
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
                    <Container className={cl.latestWinner}>
                      <Typography variant="overline" color="textSecondary">
                        Latest winner &nbsp;&bull; {winners[winners.length - 1]?.date}
                      </Typography>
                      <Typography variant="h5" noWrap >
                        {winners[winners.length - 1]?.name}
                        {/* <Typography component="span" className={cl.padh} color="textSecondary">
                          {winners[winners.length - 1]?.date}
                        </Typography> */}
                      </Typography>
                    </Container>

                    <List className={cl.list} style={{ maxHeight: 474 }}>
                      {winners.slice(0, winners.length - 1).reverse().map(({ name, date }, i) => (
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

    </Container >
  )
}