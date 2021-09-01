import React from "react"
import { Container, List, ListItem, ListItemText, Typography } from "@material-ui/core"
import { Winner } from "src/pages/Randomon"
import { HourglassEmptyRounded } from "@material-ui/icons"
import { useStyles } from "src/Theme"

interface Props {
  winners: Winner[]
}

export const WinnerList: React.FC<Props> = ({ winners }) => {
  const cl = useStyles()
  
  return (
    winners.length > 0 ?
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
  )
}