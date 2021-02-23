import React, { Component } from "react";
import axios from '../../../axios';

class DefectsList extends Component{
    state = {
        defectsList: []
    }

    async componentDidMount() {
        await axios.get('/defects')
            .then(response => {
                this.setState({defectsList: response.data})
            })
        
    }

    render() {
        return(
            <div>
            </div>
        );
        
    }
}

export default DefectsList;