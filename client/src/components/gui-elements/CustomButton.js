import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

function CustomButton(props) {
  const { classes, onClick, name } = props;
  return (
    <div>
      <Button variant="contained" color="primary" className={classes.button} onClick= {onClick}>
        {name}
      </Button>    
    </div>
  );
}

CustomButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomButton);