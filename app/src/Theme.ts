import { createMuiTheme, createStyles, makeStyles } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#00a2b1",
      dark: "#00838f",
    },
    secondary: {
      main: "#00b160",
    }
    // background: {
    //   default: "#282c34",
    //   paper: "#343943",
    // },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "Ubuntu",
      "sans-serif",
    ].join(","),
  },
  // overrides: {
  //   MuiTypography: {

  //   }
  // },
  // props: {
  //   MuiTypography: {
  //     // gutterBottom: true
  //   }
  // }
});

// #282c34, #343943

export const useStyles = makeStyles(({ spacing }) => createStyles({
  root: {
    flexGrow: 1
  },
  container: {
    padding: spacing(2)
  },
  paper: {
    padding: spacing(2),
    // borderRadius: spacing(0.75)
  },
}))