import React, { Component } from 'react';
import axios from '../../../../axios';

import styles from './Defect.module.css';

class Defect extends Component{
    state = {
        defect: [],
        photoName: '',
        image: null
    }

    componentDidMount = async () =>{
        await axios.get('/defects/' + this.props.match.params.defectId)
            .then(response => {
                this.setState({defect: response.data})
                this.setState({photoName: response.data.attachment})
        })
        await axios.get('/defects/image/' + this.state.photoName)
            .then(response => {
                this.decodePhoto(response.data.image_encode);
            })
    }

    decodePhoto = (encodedImage) => {
        let decodedImage = encodedImage.substring(2, encodedImage.length-1);
        this.setState({image: <img alt='defect' src={`data:image/jpeg;base64,${decodedImage}`} />})
    } 

    render() {
        const statusColor = this.props.getStatusColor(this.state.defect.info)
        const defect = <div className={styles.defectBlock}>
            <div className={styles.defectHeader}>
                <h3>{this.state.defect.title}</h3> 
                <div className={styles.status} style={statusColor}>{this.state.defect.info}</div>
            </div>
            <p>Опис: {this.state.defect.description}</p>
            <p>Кімната: {this.state.defect.room}</p>
            <p>Фото:</p>
            {this.state.image}
        </div>
        
        return(
            <div>
                <h2>Дефект</h2>
                {defect}
            </div>
        );
    }
}

export default Defect;