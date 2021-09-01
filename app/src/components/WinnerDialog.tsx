import React, { useState } from "react"
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button, DialogContentText } from "@material-ui/core"

interface Props {
  // open: boolean
  // onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
  description: string,
  id: string
}

export const WinnerDialog: React.FC<Props> = ({ id, description }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        Winner
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}>
        <DialogTitle id={`${id}-title`}>Winner</DialogTitle>
        <DialogContent>
          <DialogContentText id={`${id}-description`}>
            <Typography variant="h4">{description}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
          <Button onClick={handleClose} variant="outlined" color="primary">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}