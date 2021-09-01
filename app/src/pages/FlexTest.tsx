import React from "react"
import { Grid, Paper } from "@material-ui/core"
import { cls, useStyles } from "src/Theme"

interface Props { }

export const FlexTest: React.FC<Props> = () => {
  const c = useStyles()
  return (
    <>
      {/* Row */}
      <Grid container spacing={2} className={c.root} >

        {/* First Column */}
        <Grid item container xs={8} spacing={2} className={c.root}>

          {/* <Paper className={cl.pad}></Paper> */}

          <Grid item xs={12}>
            <Paper className={cls(c.pad)}>
              0<br />
              <br />
              <br />
              <br />
            </Paper>
          </Grid>

          {/* <Grid item container xs > */}
          <Grid item xs>
            <Paper className={cls(c.pad, c.stretch)}>
              1
            </Paper>
          </Grid>

          <Grid item xs>
            <Paper className={c.pad}>2<br />Hello<br />World</Paper>
          </Grid>

          <Grid item xs>
            <Paper className={cls(c.pad)}>
              1
            </Paper>
          </Grid>

          {/* </Grid> */}

        </Grid>

        {/* Second column */}
        <Grid item container xs spacing={2}>

          {/* <Paper className={cl.pad}></Paper> */}

          <Grid item xs={12}>
            <Paper className={c.pad}></Paper>
          </Grid>

          <Grid item xs >
            <Paper className={c.pad}></Paper>
          </Grid>

        </Grid>
      </Grid>

    </>
  )
}