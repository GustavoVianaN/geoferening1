import '../navbar/Navbar.css';
import User from '../../assets/user.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faClock } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ sidebarOpen, openSidebar }) => {


    return (
        <nav className="navbar">
            <div className="nav_icon" onClick={() => openSidebar()}>
                <FontAwesomeIcon icon={faBars} aria-hidden="true" />
            </div>

            <div className="navbar__left">
                <a href="/" className="active_link">Home</a>
                <a href="/eventos" className="active_link">Eventos</a>
                <a href="/tipos" className="active_link">Tipos</a>
                <a href="/incluirevento" className="active_link">Incluir Evento</a>

            </div>


            <div className="navbar__right">
                <a href="#">
                    <FontAwesomeIcon icon={faSearch} />
                </a>

                <a href="#">
                    <FontAwesomeIcon icon={faClock} />
                </a>

                <a href="#">
                    <img width="30" src={User} alt="avatar" />
                </a>
            </div>

        </nav>

    );

}

export default Navbar;
