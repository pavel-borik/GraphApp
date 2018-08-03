import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class FormDialog extends React.Component {

  render() {
    return (
      <div>
        <Dialog
          open={true}
          onClose={this.props.handleDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Settings</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Choose the view type and validity range.
            </DialogContentText>

          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.props.handleDialogClose} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}