import '../eventsList/Events.css';
import React, { useEffect, useMemo, useState } from 'react';
import { Pagination, } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { faCircleInfo, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VscUngroupByRefType } from "react-icons/vsc";

const Types = () => {

    const [eventsRequisition, setEvents] = useState([]);
    const [paginate, setPaginate] = useState({ totalPages: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [elementOptionsFilter, setElementOptionsFilter] = useState('id');

    const navigate = useNavigate();

    useMemo(() => {
        calltheapi(currentPage, null, null);
    }, [currentPage]);

    function calltheapi(page = 1, filter, filterBy) {
        setPaginate({ totalPages: paginate.totalPages });
        const url = new URL(`https://192.168.13.116:3002/api/types`);
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
                setPaginate(data.meta);
                setEvents(data.items);
            })
            .catch(error => {



            });
    }

    function organizationevents(events) {
        var listEvents = events.map(event => {
            return {
                code: event.code,
                name: event.name,
                geometria: event.geometria,
            };
        });

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
    for (var i = 1; i < 4; i++) {
        cardIds.push(i)
    }

    return (<>

        <div className="main">
            <div className="main__container">
                <div className="main__title">
                    <VscUngroupByRefType style={{ color: '#3ea175', fontSize: '80px', marginLeft: '-15px' }} />
                    <div className="main__greeting">
                        <h1>Tipos</h1>
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
                            <option value="code">Código</option>
                            <option value="description">Descrição</option>
                            <option value="geometria">Geometria</option>

                        </select>
                    </div>



                </div>



                <div className="main__cards__types">
                    {cardIds.map((id, index) => (
                        <div key={id} className="card">
                            <i className="fa fa-file-text fa-2x text-lightblue"></i>
                            <div className="card_inner" >
                                <p className="text-primary-p" style={{ marginLeft: '5px' }} >
                                    <FontAwesomeIcon icon={faCircleInfo} style={{ opacity: '1', marginRight: '5px' }} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={() => handleMouseLeave(index)} />
                                    {id === 1 ? 'Id' : id === 2 ? 'Acesso' : id === 3 ? 'Geometria' : id === 4}
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
                                            {id === 1 ? 'Id' : id === 2 ? 'Acesso' : id === 3 ? 'Geometria' : id === 4}                                        </p>
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




export default Types;