import styles from './Layout.module.css';
import { NavLink } from 'react-router-dom'

const layout = (props) => (
    <>
    <header className={styles.header}>
        <h2>Defects managment</h2>
        <h2>Вихід</h2>
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