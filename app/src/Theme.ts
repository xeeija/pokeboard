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

// Combine styles with clsx(a, b, ...)
export const useStyles = makeStyles(({ spacing, transitions }) => createStyles({
  root: {
    display: "flex",
    flexGrow: 1
  },
  //#region Padding / Margin
  pad: {
    padding: spacing(2)
  },
  padh: {
    padding: spacing(0, 2)
  },
  padv: {
    padding: spacing(2, 0)
  },
  padt: {
    padding: spacing(2, 0, 0)
  },
  padb: {
    padding: spacing(0, 0, 2)
  },
  mar: {
    margin: spacing(2),
  },
  //#endregion
  list: {
    maxHeight: 548,
    overflow: "auto",
    maxWidth: "100%",
  },
  textfield: {
    marginTop: spacing(3)
  },
  hoverBase: {
    // + "adjacent sibling operator": targets the next/following element,
    // needed because SecondaryAction is not a child of ListItem in the html (only in tsx)
    "&:hover + $hoverItem, &:hover $hoverItem": {
      opacity: 1
    }
  },
  hoverItem: {
    // add same transition as default for list item: shortest, easeInOut
    transition: transitions.create("opacity", {
      duration: transitions.duration.shortest,
    }),
    opacity: 0,
    "&:hover": {
      opacity: 1
    }
  },
  endAdornment: {
    alignItems: 'center'
  },
}))