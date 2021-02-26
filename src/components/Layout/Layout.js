import styles from './Layout.module.css';
import { Link, NavLink } from 'react-router-dom'

const layout = (props) => (
    <>
    <header className={styles.header}>
        <h2>Defects managment</h2>
        <a onClick={props.handleLogout}><h2>Вихід</h2></a>
    </header>
    <div className={styles.sidenav}>
        <NavLink activeClassName={styles.active} to='/admin/main'>Головна</NavLink>
        <NavLink activeClassName={styles.active} to='/admin/users'>Користувачі</NavLink>
        <NavLink activeClassName={styles.active} to='/admin/defects'>Дефекти</NavLink>
    </div>
    <main className={styles.main}>
        {props.children}
    </main>
    </>
    
)

export default layout;