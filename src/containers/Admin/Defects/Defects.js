import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from '../../../axios';
import styles from './Defects.module.css';

class Defects extends Component{
    state = {
        defects: []
    }

    async componentDidMount() {
        await axios.get('/defects')
            .then(response => {
                this.setState({defects: response.data})
            })
    }

    render() {
        const defectsList = this.state.defects.map(defect => {
            const statusColor = this.props.getStatusColor(defect.info);
            return (
            <Link key={defect.id} to={this.props.match.url+ '/' +defect.id}>
                <div className={styles.defectElement}>
                    <p>{defect.title}</p>
                    <p>{defect.description}</p>
                    <p>{defect.room}</p>
                    <p className={styles.status} style={statusColor}>{defect.info}</p>
                </div>
            </Link>
        )})
        
        return(
            <div className={styles.defectsList}>
                <h2>Дефекти</h2>
                <div className={styles.titles}>
                    <div>Назва</div>
                    <div>Опис</div>
                    <div>Кімната</div>
                    <div>Статус</div>
                </div>
                {defectsList}
            </div>
        );
        
    }
}

export default Defects;