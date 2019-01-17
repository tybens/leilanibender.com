import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

class AnonMessages extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: ""
    }
  }

  componentDidMount () {
    document.title = "Anonymous-ish Messages";
  }

  render() {
    return (
      <Dialog
        open
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Send Carol a Message!</DialogTitle>
        <DialogContent >
          <TextField
          style={{ fontSize: 40}}
            autoFocus
            variant="outlined"
            multiline
            margin="dense"
            helperText="Please consider being clear if there's anything you'd like me to do, or if I should reach out to you in anyway. <3 "
            label="Everything goes in here"
            type="email"
            fullWidth
            inputProps={{style: {fontSize: 13, lineHeight: 1.15, height: 400}}}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AnonMessages;
