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
    },
    error: {
      main: "#d63656",
    },
    // comment out for lightmode
    background: {
      // more grayish #282e34 / #343c43
      // more blueish #282c34 / #343943
      default: "#282e34",
      paper: "#343c43",
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "Ubuntu",
      "sans-serif",
    ].join(","),
  },
});

// Helper function for add multiple classes
// Combine styles with cls(a, b, ...)
export const cls = (...classes: string[]) => classes.join(" ")

export const useStyles = makeStyles(({ spacing, transitions, palette }) => createStyles({
  root: {
    flexGrow: 1,
    alignItems: "stretch",
    "& $stretch": {
      height: "100%",
    }
  },
  stretch: {},
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
    paddingTop: spacing(2)
  },
  padb: {
    paddingBottom: spacing(2)
  },
  padr: {
    paddingRight: spacing(2)
  },
  mar: {
    margin: spacing(2),
  },
  mart: {
    marginTop: spacing(2)
  },
  //#endregion
  // flexGrow makes the Buttons after ths element (eg. appbar title) align right
  grow: {
    flexGrow: 1,
  },
  list: {
    overflow: "auto",
    maxWidth: "100%",
  },
  latestWinner: {
    padding: spacing(0, 2, 2)
  },
  errorOutlined: {
    color: palette.error.main,
    borderColor: `${palette.error.main}80`,
    "&:hover": {
      borderColor: palette.error.main,
      background: "transparent",
    }
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
  footer: {
    opacity: 0.5,
  },
  //#region Wheel
  wheelEmpty: {
    stroke: "#191d21",
    strokeWidth: 5,
    fill: "#8195a833",
  },
  wheelSector: {
    stroke: "#191d21",
    strokeWidth: 1,
    fillOpacity: 0.8,
  },
  wheelText: {
    fill: "#191d21",
    fontSizeAdjust: 0.47, // 0.45,
  },
  wheelIndicator: {
    fill: palette.primary.main,
    stroke: "#191d21",
    strokeWidth: 3,
  },
  wheelMiddle: {
    fill: "#4b5661",
    stroke: "#191d21",
    strokeWidth: 3,
  },
  // Hides the wheel and only fades in on spins (default for popout)
  // fades the popout wheel out after a delay when faded in
  fade: {
    "&:not($fadeIn)": {
      opacity: 0,
      visibility: "hidden",
      transition: "opacity 375ms ease-out 5s, visibility 375ms ease-out 5s"
    }
  },
  // Fades the wheel in (class added on spin)
  fadeIn: {
    opacity: 1,
    visibility: "visible",
    transition: transitions.create(["opacity", "visibility"], {
      duration: transitions.duration.complex, // 375ms, 500ms
      easing: transitions.easing.easeOut
    }) // "opacity 0.5s ease-out, visibility 0.5s ease-out",
  },
  //#endregion
}))