import './Sidebar.css';
import User from '../../assets/user.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMinusSquare, faPowerOff, faIdBadge, faLocationDot, faCameraRetro, faCameraAlt, faScrewdriverWrench, faMitten, faScrewdriver, faHouse } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';


import Keycloak from 'keycloak-js';



var initOptions = {
    url: 'https://192.168.13.116:9998/',
    realm: 'ipms-dev',
    clientId: 'portal-web',
    // onLoad: 'check-sso',
    // KeycloakResponseType: 'code',
}

const kc = new Keycloak(initOptions);
kc.init({
    //  onLoad: initOptions.onLoad,
    KeycloakResponseType: 'code',
    //  silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
    checkLoginIframe: false,
    pkceMethod: 'S256'
}).then((auth) => {

    if (!auth) {
        kc.login();

    } else {
        localStorage.setItem('keycloak_token', kc.token);
        kc.onTokenExpired = () => {
            kc.updateToken(5).then((refreshed) => {
                if (refreshed) {
                    localStorage.setItem('keycloak_token', kc.token);
                }
            }).catch(() => {
                kc.logout({ redirectUri: 'https://192.168.13.116:3000/' })

            });
        };
    }
}, () => {
    kc.logout({ redirectUri: 'https://192.168.13.116:3000/' })
});




const handleLogout = () => {
    kc.logout({ redirectUri: 'https://192.168.13.116:3000/' })
};

const Sidebar = ({ sidebarOpen, closeSidebar }) => {


    const [activeMenuLinkEvents, setActiveMenuLinkEvents] = useState('sidebar__link');
    const [activeMenuLinkTipos, setActiveMenuLinkTipos] = useState('sidebar__link');
    const [activeMenuLinkHome, setActiveMenuLinkHome] = useState('sidebar__link');


    useEffect(() => {
        const path = window.location.pathname;
        if (path.includes('/eventos') || path.includes('/incluirevento')) {
            setActiveMenuLinkEvents('sidebar__link active_menu_link');
        }
        if (path.includes('/tipos')) {
            setActiveMenuLinkTipos('sidebar__link active_menu_link');
        }

        if (!path.includes('/tipos') && !path.includes('/eventos') && !path.includes('/incluirevento')) {
            setActiveMenuLinkHome('sidebar__link active_menu_link');
        }

    }, []);


    return (

        <div className={sidebarOpen ? "sidebar-responsive" : ""} id="sidebar">
            <div className="sidebar__title">
                <div className="sidebar__img">
                    <img src={User} alt="User" />
                    <h1>Gustavo</h1>
                </div>
                <FontAwesomeIcon icon={faTimes} onClick={closeSidebar} id="sidebarIcon" aria-hidden="true" />
            </div>
            <div className="sidebar__menu">
                <div className={activeMenuLinkHome}>
                    <FontAwesomeIcon icon={faHouse} />
                    <a href="/">Home</a>
                </div>

                <h2>Admin</h2>

                <div className={activeMenuLinkEvents}>
                    <FontAwesomeIcon icon={faMinusSquare} />
                    <a href="/eventos">Eventos</a>
                </div>


                <div className={activeMenuLinkTipos}>
                    <FontAwesomeIcon icon={faScrewdriver} />
                    <a href="/tipos">Tipos</a>
                </div>
                {/*
                <div className="sidebar__link">
                    <FontAwesomeIcon icon={faScrewdriverWrench} />
                    <a href="/equipamentos">Equipamentos</a>
                </div>
                <div className="sidebar__link">
                    <FontAwesomeIcon icon={faMitten} />
                    <a href="/motivos">Motivos</a>
                </div>
                <div className="sidebar__link">
                    <FontAwesomeIcon icon={faScrewdriver} />
                    <a href="/tipos">Tipos</a>
                </div>
*/}
                <div className="sidebar__logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faPowerOff} />
                    <span>SAIR</span>
                </div>

            </div>
        </div>
    );

}

export default Sidebar;
