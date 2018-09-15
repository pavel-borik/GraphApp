import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import './InfoCard.css'
import InfoCardDetail from './InfoCardDetail';
import Button from '@material-ui/core/Button';

const styles = {
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    uldetail: {
        listStyleType: 'none',
        padding: 0,
        margin: 0
    },
    button: {
        marginRight: 5
    },
};

class InfoCard extends PureComponent {

    render() {
        const { classes } = this.props;

        let detailComponent = null;
        if (this.props.selectedNode.hasOwnProperty("detail") && this.props.selectedNode.hasOwnProperty("actions")) {
            detailComponent = (<div>
                <div className="detail" dangerouslySetInnerHTML={{ __html: this.props.selectedNode.detail }}></div>
                <div className="actions-container">
                    {this.props.selectedNode.actions.map(a => {
                        return <Button key={`id_${a.name}`} className={classes.button} variant="outlined" size="small" color="primary" href={a.url}>{a.name}</Button>
                    })}
                </div>
            </div>)
        } else {
            detailComponent = <InfoCardDetail internalId={this.props.selectedNode.internalId} type={this.props.selectedNode.type} />
        }

        return (
            <div>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary">
                            Entity information:
						</Typography>
                        <Typography variant="headline" component="h2">
                            {this.props.selectedNode.name}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            {this.props.selectedNode.typeFullName}
                        </Typography>
                        {detailComponent}
                    </CardContent>
                </Card>
            </div>
        );
    }
}

InfoCard.propTypes = {
    classes: PropTypes.object,
    data: PropTypes.object
};

export default withStyles(styles)(InfoCard);