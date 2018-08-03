import React, { Component } from 'react'
import IconButton from '@material-ui/core/IconButton';
import Settings from '@material-ui/icons/Settings';
import SettingsDialog from '../SettingsDialog/SettingsDialog'
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import './SettingsWrapper.css'

export default class SettingsWrapper extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dialogOpen: false,
            selectedView: "1"
        }
    }

    getSelectedView = (view) => {
        this.props.getSelectedView(view);
    }

    handleDialog = () => {
        this.setState({ dialogOpen: true })
    }

    handleDialogClose = () => {
        this.setState({ dialogOpen: false })
    }

    handleRadioChange = (event) => {
        this.props.getSelectedView(event);
        this.setState({ selectedView: event.target.value });
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="viewgroup">
                        <FormControl>
                            <FormLabel component="legend">Choose view</FormLabel>
                            <RadioGroup
                                row
                                aria-label="view"
                                name="view"
                                value={this.state.selectedView}
                                onChange={this.handleRadioChange}>

                                <FormControlLabel value="1" control={<Radio />} label="Duration" />
                                <FormControlLabel value="2" control={<Radio />} label="Moment" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="settings">
                        <IconButton onClick={this.handleDialog} color="inherit" aria-label="Menu">
                            <Settings />
                        </IconButton>
                    </div>

                </div>
                <div>
                    {this.state.dialogOpen === true ? <SettingsDialog handleDialog={this.handleDialog} handleDialogClose={this.handleDialogClose} /> : null}
                </div>
            </div>
        )
    }
}
