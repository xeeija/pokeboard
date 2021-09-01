import React from "react"
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, InputAdornment } from "@material-ui/core"
import { DeleteRounded, SendRounded } from "@material-ui/icons"
import { useStyles } from "src/Theme"

interface Props {
  names: string[],
  spinning: boolean,
  addName: (name: string) => void,
  deleteName: (index: number) => void,
  addNameRef: React.RefObject<HTMLInputElement>,
}

export const NamesList: React.FC<Props> = ({ names, spinning, addName, deleteName, addNameRef }) => {

  const cl = useStyles()
  
  // const addNameRef = useRef<HTMLInputElement>(null)

  return (
    <>
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
            // e.preventDefault()
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
    </>
  )
}