import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
	button: {
		marginRight: theme.spacing.unit,
	},
	input: {
		display: 'none',
	},
});

function CustomButton(props) {
	const { classes, onClick, name, tooltipTitle } = props;
	return (
		<div>
			<Tooltip title={tooltipTitle}>
				<Button variant="contained" color="primary" className={classes.button} onClick={onClick}>
					{name}
				</Button>
			</Tooltip>
		</div>
	);
}

CustomButton.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	tooltipTitle: PropTypes.string.isRequired,
	onClick: PropTypes.func
};

export default withStyles(styles)(CustomButton);