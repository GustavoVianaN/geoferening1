import './../eventsList/Events.css';
import React, { useEffect, useMemo, useState } from 'react';
import { IoMdAddCircle } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { IoIosAdd } from "react-icons/io";



const EventsInclude = () => {

    var navigate = useNavigate();
    const [idDevice, setIdDevice] = useState('');
    const [type, setIdType] = useState('');
    const [situation, setSituation] = useState('');
    const [acesso, setAcesso] = useState('');
    const [funcao, setFuncao] = useState('');
    const [setor, setSetor] = useState('');


    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');


    const [azimute, setAzimute] = useState('');
    const [motivo, setMotivo] = useState('');


    function validateThatFields() {

    }


    const handleInputChange = (e) => {
        const value = e.target.value;
        const regex = /^[0-9]*$/;

        if (regex.test(value)) {
            setIdDevice(value);
        }
    };

    const [Type, setType] = useState([]);
    const [idTypes, setIdTypes] = useState([]);

    useEffect(() => {
        let mounted = true;

        fetch(`https://192.168.13.116:3002/api/types`, {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                var list = data.items.map(item => `${item.code} ${item.name} (${item.geometria})`);

                console.log(data)
                var idTypes = data.items.map(item => `${item.id}`);
                setIdTypes(idTypes)

                if (mounted) {
                    list.unshift('INCLUIR TIPO');

                    setType(list);
                }
            })
            .catch(error => {
                console.error('Houve um problema com sua requisição fetch:', error);
            });

        return () => {
            mounted = false;
        };
    }, []);
    var [values, setValues] = useState({});
    var [valueslongitude, setValuesLongitude] = useState({});

    function calltheapi(body) {

        for (var i = 0; i < Type.length; i++) {
            var typeid = body.type == Type[i] ? parseInt(idTypes[i - 1]) : 1;
        }

        var motivo = ''
        if (body.motivo) {
            motivo = body.motivo
        }

        const url = `https://192.168.13.116:3002/api/events`;
        var body = {
            "idDevice": parseInt(body.idDevice),
            "access": body.acesso,
            "sector": body.setor,
            "functionLocal": body.funcao,
            "typeId": typeid,
            "situation": false,
            "motivo": motivo,
            "protocol": Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000,
            "latitude": Object.values((body.coordenadas.latitude)),
            "longitude": Object.values((body.coordenadas.longitude)),
            "azimuth": body.azimute,
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                navigate('/eventos')

            })
            .catch(error => {
                console.error('Houve um problema com sua requisição fetch:', error);
            });
    }

    function includeEvent() {
        validateThatFields()
        const deviceInfo = {
            idDevice: idDevice,
            type: type,
            situation: situation,
            acesso: acesso,
            funcao: funcao,
            setor: setor,
            coordenadas: {
                latitude: latitude,
                longitude: longitude,
            },
            azimute: azimute,
            motivo: motivo
        };

        const fieldsnull = []
        let resultados = type.match(/ponto|polígono/gi);


        if (situation == 'Ativo') {
            delete deviceInfo.motivo;

        }

        deviceInfo.coordenadas.latitude = values
        deviceInfo.coordenadas.longitude = valueslongitude

        Object.keys(deviceInfo).forEach(key => {
            if (key !== 'coordenadas') {
                deviceInfo[key] === undefined && fieldsnull.push(key);
            } else {
                Object.keys(deviceInfo.coordenadas).forEach(innerKey => {
                    deviceInfo.coordenadas[innerKey] === '' && fieldsnull.push(innerKey);
                });
            }
        });

        if (deviceInfo.situation == 'INCLUIR SITUAÇÃO') {
            fieldsnull.push('SITUAÇÃO')
        }
        if (deviceInfo.type == 'INCLUIR TIPO') {
            fieldsnull.push('Tipo')
        }
        if (deviceInfo.coordenadas.latitude.latitude == "" || deviceInfo.coordenadas.longitude.longitude == "" || deviceInfo.coordenadas.latitude.latitude == '' || deviceInfo.coordenadas.longitude.longitude == '' || deviceInfo.coordenadas.latitude.latitude == undefined || deviceInfo.coordenadas.longitude.longitude == '') {
            fieldsnull.push('Coordenadas Invalido')
        }

        if (Object.values(deviceInfo.coordenadas.latitude).some(value => isNaN(Number(value)))) {
            fieldsnull.push('latitude Só aceita números');
        }

        if (Object.values(deviceInfo.coordenadas.longitude).some(value => isNaN(Number(value)))) {
            fieldsnull.push('longitude Só aceita números');
        }



        if (fieldsnull.length == 0) {
            calltheapi(deviceInfo)
        } else {
            document.getElementById('alertError').style.display = 'block'
            document.getElementById('alertError').innerText = `ERRO - o campo ${fieldsnull[0]} encontra-se vazio`;
            setTimeout(function () {
                if (document.getElementById('alertError')) {
                    document.getElementById('alertError').style.display = 'none'
                }
            }, 5000);


        }
    }


    var handleChangeSituacao = (event) => {
        setSituation(event.target.value)
        document.getElementById('motivoField').style.display = event.target.value == 'Inativo' ? 'block' : 'none';
    }



    const Situacao = ['INCLUIR SITUAÇÃO', 'Ativo', 'Inativo']

    const [inputsData, setInputsData] = useState([
        {
            id: 'latitude',
            label: 'Latitude',
            required: true,
        }
    ]);

    const [InputsDataLongitude, setInputsDataLongitude] = useState([
        {
            id: 'longitude',
            label: 'longitude',
            required: true,
        }
    ]);



    const handleChange = (id, value) => {
        setValues(prev => ({ ...prev, [id]: value }));
    };

    const addInput = () => {
        setInputsData(prevInputs => [
            ...prevInputs,
            {
                id: `latitude${prevInputs.length}`,
                label: `Latitude ${prevInputs.length + 1}`,
                required: false,
            }
        ]);
        setInputsDataLongitude(prevInputs => [
            ...prevInputs,
            {
                id: `longitude${prevInputs.length}`,
                label: `Longitude ${prevInputs.length + 1}`,
                required: false,
            }
        ]);
    };


    const handleChangeLongitude = (id, value) => {
        setValuesLongitude(prev => ({ ...prev, [id]: value }));
    };



    var handleChangeTipo = (event) => {
        setIdType(event.target.value)
        let resultados = event.target.value.match(/ponto|polígono/gi);
        if (resultados != 'ponto' && inputsData.length < 2) {
            for (var i = 0; i < 2; i++) {
                addInput()
            }
        }

    }
    return (<>
        <div className="main">
            <div className="main__container">
                <div className="main__title">
                    <IoMdAddCircle style={{ color: '#3ea175', fontSize: '80px', marginLeft: '-15px' }} />
                    <div className="main__greeting">
                        <h1>Inclusão de Evento de Georreferenciamento</h1>
                        <p></p>
                    </div>
                </div>

                <div >
                    <Alert style={{ display: 'none' }} id='alertError' severity="error"></Alert>
                </div>



                <div className='tableForm'>
                    <div className='formcadastro'>
                        <div className="includegroup">
                            <div className='inputFilter'>
                                <input
                                    className='inputlayer'
                                    style={{ width: '400px', height: '20px', borderRadius: '5px' }}
                                    type="number"
                                    required
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Permite apenas números
                                        if (/^\d*$/.test(value)) {
                                            setIdDevice(value);
                                        }
                                    }}
                                />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label style={{ fontFamily: '-apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"' }}>Id dispositivo <span style={{ color: 'red' }}>*</span></label>
                            </div>
                        </div>



                        <div style={{ display: 'flex', marginTop: '25px' }}>
                            <span style={{ fontWeight: 'bold' }}>
                                Tipo:
                            </span>
                            <div>
                                <select
                                    id="tipoSelect" // Adicionado um ID para o select
                                    className="selectCadastrar"
                                    style={{ width: '340px', marginLeft: '35px', borderRadius: '5px' }}
                                    onChange={(e) => handleChangeTipo(e)}
                                >
                                    {Type.map((situacao, index) => (
                                        <option key={index} value={situacao}>
                                            {situacao}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        <div style={{ display: 'flex', marginTop: '25px' }}>
                            <span style={{ fontWeight: 'bold' }}>
                                Situação:
                            </span>
                            <div>
                                <select
                                    className="selectCadastrar"
                                    style={{ width: '340px', marginLeft: '5px', borderRadius: '5px' }}
                                    onChange={(e) => handleChangeSituacao(e)} // Passa o evento para a função
                                >
                                    {Situacao.map((situacao, index) => (
                                        <option key={index} value={situacao}>
                                            {situacao}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="includegroup">
                            <div className='inputFilter'>
                                <input
                                    className='inputlayer'
                                    style={{ width: '400px', height: '20px', borderRadius: '5px' }}
                                    type="text"
                                    required
                                    onChange={(e) => setAcesso(e.target.value)}
                                />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label style={{ fontFamily: '-apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"' }}>Acesso<span style={{ color: 'red' }}>*</span></label>
                            </div>
                        </div>



                        <div className="includegroup">
                            <div className='inputFilter'>
                                <input
                                    className='inputlayer'
                                    style={{ width: '400px', height: '20px', borderRadius: '5px' }}
                                    type="text"
                                    required
                                    onChange={(e) => setFuncao(e.target.value)}
                                />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label style={{ fontFamily: '-apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"' }}>Função<span style={{ color: 'red' }}>*</span></label>
                            </div>
                        </div>




                        <div className="includegroup">
                            <div className='inputFilter'>
                                <input
                                    className='inputlayer'
                                    style={{ width: '400px', height: '20px', borderRadius: '5px' }}
                                    type="text"
                                    required
                                    onChange={(e) => setSetor(e.target.value)}
                                />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label style={{ fontFamily: '-apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"' }}>Setor<span style={{ color: 'red' }}>*</span></label>
                            </div>
                        </div>
                    </div>




                    <div className='formcadastro'>


                        <div className="includegroup" style={{ display: 'none' }} id='motivoField'>
                            <div className='inputFilter'>
                                <input
                                    className='inputlayer'
                                    style={{ width: '400px', height: '20px', borderRadius: '5px' }}
                                    type="text"
                                    required
                                    onChange={(e) => setMotivo(e.target.value)}
                                />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label style={{ fontFamily: '-apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"', }}>Motivo<span style={{ color: 'red' }}>*</span></label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', marginLeft: '0px' }}>




                            <div id='root'>

                                {/* Mapeamento de inputsData para renderizar os inputs */}
                                {inputsData.map((input, index) => (
                                    <div key={index} className="includegroup">
                                        <div className='inputFilter'>
                                            <input
                                                className='inputlayer'
                                                style={{ width: '190px', height: '20px', borderRadius: '5px' }}
                                                type="number" // Mantenha como "text" para maior controle sobre a entrada
                                                required={input.required}
                                                onChange={(e) => handleChange(input.id, e.target.value)}
                                            />
                                            <span className="highlight"></span>
                                            <span className="barMap"></span>
                                            <label style={{ fontFamily: '-apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"' }}>
                                                {input.label}<span style={{ color: 'red' }}>*</span>
                                            </label>
                                        </div>


                                    </div>
                                ))}

                            </div>


                            <div style={{ marginLeft: '-90px' }}>

                                {InputsDataLongitude.map((input, index) => (
                                    <div key={index} className="includegroup">
                                        <div className='inputFilter'>
                                            <input
                                                className='inputlayer'
                                                style={{ width: '190px', height: '20px', borderRadius: '5px' }}
                                                type="number" // Mantenha como "text" para maior controle sobre a entrada
                                                required={input.required}
                                                onChange={(e) => handleChangeLongitude(input.id, e.target.value)}
                                            />
                                            <span className="highlight"></span>
                                            <span className="barMap"></span>
                                            <label style={{ fontFamily: '-apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"' }}>
                                                {input.label}<span style={{ color: 'red' }}>*</span>
                                            </label>

                                        </div>
                                    </div>

                                ))}



                            </div>
                            <div>
                                <div className="includegroup" style={{ marginLeft: '-90px' }}>
                                    <div className='inputFilter'>

                                        <input style={{ height: '32px', width: '150px', marginLeft: '-0px' }} className='button-3' onClick={addInput} type='button' value="Incluir Referência +" />
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div className="includegroup">
                            <div className='inputFilter'>
                                <input
                                    className='inputlayer'
                                    style={{ width: '400px', height: '20px', borderRadius: '5px' }}
                                    type="number" // Mantenha como "text" para maior controle sobre a entrada
                                    required
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Permite apenas dígitos (números inteiros)
                                        if (/^\d*$/.test(value)) {
                                            setAzimute(value);
                                        }
                                    }}
                                />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label style={{ fontFamily: '-apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"' }}>Azimute<span style={{ color: 'red' }}>*</span></label>
                            </div>
                        </div>



                        <input style={{ marginTop: '20px', height: '30px', width: '410px', marginLeft: '-155px' }} className='button-3' type='button' value="Incluir Evento" onClick={includeEvent} />

                    </div>

                </div>
            </div>
        </div>
    </>);

}


export default EventsInclude;