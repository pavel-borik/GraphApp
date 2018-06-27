import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 380,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class CustomSelect extends React.Component {
  state = {
    timeinterval: '',
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="time-interval">Time interval</InputLabel>
          <Select
            value={this.state.timeinterval}
            onChange={this.handleChange}
            inputProps={{
              name: 'timeinterval',
              id: 'time-interval',
            }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value={10}>2015-04-29T00:00 - undefined</MenuItem>
            <MenuItem value={20}>2015-04-29T00:00 - undefined</MenuItem>
            <MenuItem value={30}>2015-04-29T00:00 - undefined</MenuItem>
          </Select>
        </FormControl>
      </form>
    );
  }
}

CustomSelect.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(CustomSelect);