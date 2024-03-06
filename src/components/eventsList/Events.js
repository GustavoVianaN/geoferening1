import './Events.css';
import React, { useEffect, useMemo, useState } from 'react';
import { PiMapPinLineLight } from "react-icons/pi";
import { Pagination, } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { faCircleInfo, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Events = () => {

    const [eventsRequisition, setEvents] = useState([]);
    const [paginate, setPaginate] = useState({ totalPages: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    var [elementOptionsFilter, setElementOptionsFilter] = useState('id');

    const navigate = useNavigate();

    useMemo(() => {
        calltheapi(currentPage, null, null);
    }, [currentPage]);

    function calltheapi(page = 1, filter, filterBy) {
        setPaginate({ totalPages: paginate.totalPages });
        const url = new URL(`https://192.168.13.116:3002/api/events`);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('filter', filter);
        url.searchParams.append('filterBy', filterBy);

        fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('keycloak_token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                setPaginate(data.meta);
                setEvents(data.items);
            })
            .catch(error => {



            });
    }

    function organizationevents(events) {
        var listEvents = events.map(event => {
            return {
                id: event.idDevice,
                access: event.access,
                sector: event.sector,
                functionLocal: event.functionLocal,
                type: `${event.type.name}/(${event.type.geometria})`,
                situation: event.situation.toString(),
                protocol: event.protocol,
                latitude: event.latitude,
                longitude: event.longitude,
                azimuth: event.azimuth,
            };
        });


        var listeventos= []
        for (var i = 0; i < listEvents.length; i++) {
            for (var j = 0; j < listEvents[i].latitude.length; j++) {
                listeventos.push(listEvents[i].latitude[j], ',') 
            }
            listEvents[i].latitude = listeventos
        }

        listeventos= []
        for (var i = 0; i < listEvents.length; i++) {
            for (var j = 0; j < listEvents[i].longitude.length; j++) {
                listeventos.push(listEvents[i].longitude[j], ',') 
            }
            listEvents[i].longitude = listeventos
        }


        return listEvents;
    }


    var handleChange = (event) => {
        setElementOptionsFilter(event.target.value)
    }

    var handleInputChange = (event) => {

        calltheapi(1, event.target.value, elementOptionsFilter)
    }

    function redirectEvent() {
        navigate('/incluirevento');
    }


    const [mostrarInfo, setMostrarInfo] = useState(Array(4).fill(false)); // Criando um array de estados para cada card

    const handleMouseEnter = (index) => {
        const updatedMostrarInfo = [...mostrarInfo];
        updatedMostrarInfo[index] = true;
        setMostrarInfo(updatedMostrarInfo);
    };

    const handleMouseLeave = (index) => {
        const updatedMostrarInfo = [...mostrarInfo];
        updatedMostrarInfo[index] = false;
        setMostrarInfo(updatedMostrarInfo);
    };


    var cardIds = [];
    for (var i = 1; i < 11; i++) {
        cardIds.push(i)
    }

    return (<>

        <div className="main">
            <div className="main__container">
                <div className="main__title">
                    <PiMapPinLineLight style={{ color: '#3ea175', fontSize: '80px', marginLeft: '-15px' }} />
                    <div className="main__greeting">
                        <h1>Eventos de Georreferenciamento - Porto Itapoá</h1>
                        <p></p>
                    </div>
                </div>

                <div className="group">
                    <div className='inputFilter'>
                        <input
                            className='inputlayer'
                            type="text"
                            required
                            onChange={handleInputChange}
                        />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label>Filtrar</label>
                    </div>
                    <div>
                        <select
                            className="select"
                            onChange={handleChange}
                        >
                            <option value="idDevice">Id</option>
                            <option value="access">Acesso</option>
                            <option value="sector">Setor</option>
                            <option value="functionLocal">Função</option>
                            <option value="type">Tipo</option>
                            <option value="situation">Situação</option>
                            <option value="protocol">Latitude</option>
                            <option value="latitude">Latitude</option>
                            <option value="longitude">Longitude</option>
                            <option value="azimuth">Azimute</option>

                        </select>
                    </div>
                    <input className='button-3' type='button' value="Incluir Evento" onClick={redirectEvent}
                    />


                </div>



                <div className="main__cards">
                    {cardIds.map((id, index) => (
                        <div key={id} className="card">
                            <i className="fa fa-file-text fa-2x text-lightblue"></i>
                            <div className="card_inner" >
                                <p className="text-primary-p" style={{ marginLeft: '5px' }} >
                                    <FontAwesomeIcon icon={faCircleInfo} style={{ opacity: '1', marginRight: '5px' }} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={() => handleMouseLeave(index)} />
                                    {id === 1 ? 'Id' : id === 2 ? 'Acesso' : id === 3 ? 'Setor' : id === 4 ? 'Função' : id === 5 ? 'Tipo' : id === 6 ? 'Situação' : id === 7 ? 'Protocolo' : id === 8 ? 'Latitude' : id === 9 ? 'Longitude' : id === 10 ? 'Azimute' : id === 11}
                                </p>

                                {mostrarInfo[index] && (
                                    <div style={{
                                        position: 'absolute',
                                        height: '100px',
                                        width: '150px',
                                        background: 'linear-gradient(#808080, #A9A9A9)',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: 'white',
                                        fontSize: '15px',
                                        fontWeight: 'normal',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                        cursor: 'help',
                                        zIndex: 1000,

                                    }}>
                                        <p>
                                            {id === 1 ? 'ID da área ou do equipamento' : id === 2 ? 'Acesso' : id === 3 ? 'Setor' : id === 4 ? 'Função' : id === 5 ? 'Tipo' : id === 6 ? 'Ativo / Inativo c/motivo' : id === 7 ? 'Protocolo' : id === 8 ? 'Latitude Do Poligono ou área se for único (em decimal)' : id === 9 ? 'Longitude' : id === 10 ? 'Azimute' : id === 11}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {organizationevents(eventsRequisition).map((event) => (
                        <React.Fragment key={event.id}>
                            {Object.entries(event).map(([key, value]) => (
                                <div className="card" key={`${event.id}-${key}`}>
                                    <i className="fa fa-file-text fa-2x text-lightblue"></i>
                                    <div className="card_inner">
                                        <p className="font-bold text-title" style={{ fontSize: '12px' }}>{value}</p>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    ))}


                </div>

                <Pagination
                    count={paginate.totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    style={{ marginTop: "20px" }}
                />
            </div>
        </div>
    </>);

}




export default Events;