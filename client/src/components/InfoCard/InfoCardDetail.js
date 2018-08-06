import React, { Component } from 'react'
import CustomProgress from '../GuiElements/CustomProgress'

class InfoCardDetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            detail:"",
            isLoading: false
        }
    }

    componentDidMount() {
        this.setState({isLoading:true});
        const url = 'api/getdetail?' + 'id=' + this.props.internalId + '&type=' + this.props.type;
        fetch(url)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then(nodeDetailData => this.setState({ detail: nodeDetailData.queriedEntity.detail, isLoading:false }));
    }

    componentDidUpdate(prevProps){
        if (prevProps.internalId !== this.props.internalId) {
            this.setState({isLoading:true});
            const url = 'api/getdetail?' + 'id=' + this.props.internalId + '&type=' + this.props.type;
             fetch(url)
                 .then((res) => {
                     if (res.ok) {
                         return res.json();
                     } else {
                         throw new Error('Something went wrong');
                     }
                 })
                 .then(nodeDetailData => this.setState({ detail: nodeDetailData.queriedEntity.detail, isLoading:false }));
         }
    }

    render() {
        const progressComponent = <CustomProgress className={"progress"} />
        return (
            <div>
                {this.state.isLoading === true ? progressComponent : <div className="detail" dangerouslySetInnerHTML={{__html: this.state.detail}}></div>}
            </div>
        )
    }
}

export default InfoCardDetail;
