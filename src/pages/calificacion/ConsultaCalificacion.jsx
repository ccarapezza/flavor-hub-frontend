import { useContext, useState } from 'react'
import { Button, Card, CardContent, CardHeader, IconButton, Rating, Stack, Chip, Divider, InputLabel, Paper, Accordion, AccordionDetails, AccordionSummary, alpha, Grid, Typography } from '@mui/material'
import Page from '../Page';
import { Box } from '@mui/material';
import { QrScanner } from '@yudiel/react-qr-scanner';//import { QrReader } from "react-qr-reader";
import Context from '../../context/Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faCircle, faClock, faSquareFull, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Loading from '../../components/Loading';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import ComparatorColors from '../../colors/ComparatorColors';
import { ExpandMore } from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';
import { Fragment } from 'react';
import FacingMode from '../../Constants';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export default function ConsultaCalificacion() {
    const context = useContext(Context);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    const [camera, setCamera] = useState(FacingMode.ENVIRONMENT)
    
    const [verGrafico, setVerGrafico] = useState(false);
    const [loading, setLoading] = useState(false);

    const [promedio, setPromedio] = useState({
        labels: [],
        datasets: [],
    });

    const [promedioData, setPromedioData] = useState([]);

    const options = {
        plugins: {
            legend: {
                labels: {
                    font: {
                        weight: "bold"
                    }
                }
            },
        },
        scale: {
            angleLines: {
                display: true,
                lineWidth: 0.5,
                color: 'rgba(128, 128, 128, 0.2)'
            },
            pointLabels: {
                fontSize: 14,
                fontStyle: '500',
                fontColor: 'rgba(204, 204, 204, 1)',
                fontFamily: "'Lato', sans-serif"
            }
        },
        scales: {
            r: {
                min: 1,
                max: 10,
                ticks: {
                    stepSize: 2
                },
                pointLabels: {
                    font: {
                        size: 14,
                    }
                  }
            }
        }
    }

    const addMuestra = (muestraData, labels) => {
        let equalLabels = true;
        if(promedio.labels.length>0){
            if (promedio.labels.length !== labels.length){
                equalLabels = false;
            }
            for (var i = 0; i < promedio.labels.length; i++) {
                if (promedio.labels[i] !== labels[i]){
                    equalLabels = false;
                }
            }
        }
        if(equalLabels){
            setPromedio({
                labels: labels,
                datasets: promedio.datasets.concat(muestraData)
            })
        }else{
            context.showMessage("No se pueden comparar las muestras", "error");
        }
    }

    const validarMuestra = (hash) => {
        setVerGrafico(true);
        setLoading(true);
        axios.post("/api/calificaciones/muestra", {
            hashMuestra: hash
        }).then(function (response) {
            if (response.status === 200) {
                const data = response.data;
                let muestraId = 0;
                const promedioDataResponse = {
                    muestra: data.calificaciones[0].muestra,
                    muestraId: data.calificaciones[0].muestraId,
                    promedioTotal: data.calificaciones.reduce((acc, calificacion) => {
                        return acc + calificacion.valores.reduce((acc, valor) => {
                            return acc + valor.valor
                        }, 0) / calificacion.valores.length
                    }, 0) / data.calificaciones.length,
                    calificaciones: data.calificaciones.map(calificacion => {
                        return {
                            id: calificacion.id,
                            createAt: calificacion.createAt,
                            updatedAt: calificacion.updatedAt,
                            participante: calificacion.participante,
                            participanteId: calificacion.participanteId,
                            valores: calificacion.valores,
                            promedioTotal: calificacion.valores.reduce((acc, valor) => {
                                return acc + valor.valor
                            }, 0) / calificacion.valores.length
                        }
                    }),
                    valores: data.calificaciones[0].valores.map(valor => {
                        return {
                            label: valor.label,
                            valor: data.calificaciones.reduce((acc, calificacion) => {
                                return acc + calificacion.valores.find(v => v.label === valor.label).valor
                            }, 0) / data.calificaciones.length
                        }
                    }),
                    count: data.calificaciones.length
                }

                if(promedioDataResponse){
                    setPromedioData(promedioData.concat(promedioDataResponse));
                    addMuestra(
                        {
                            label: 'Muestra #'+promedioDataResponse?.muestraId,
                            data: promedioDataResponse.valores.map(currentValor=>currentValor.valor),
                            backgroundColor: alpha(ComparatorColors[promedio?.datasets.length], 0.2),
                            borderColor: ComparatorColors[promedio?.datasets.length],
                            lineTension: 0.1,
                            pointBackgroundColor: ComparatorColors[promedio?.datasets.length],
                            pointBorderColor: "rgba(255, 255, 255, 1)",
                            pointRadius: 4,
                            pointHoverRadius: 6,
                        },
                        promedioDataResponse.valores.map(currentValor=>currentValor.label)
                    );
                    context.showMessage("Muestra identificada!", "success");
                }else{
                    context.showMessage("Muestra identificada pero aun no posee calificaciones", "warning");
                }
            } else {
                context.showMessage("No se ha podido validar la muestra.", "error");
                console.error(response);
            }
        }).catch(function (error) {
            //setHashMuestra();
            context.showMessage("No se ha podido validar la muestra.", "error");
            console.error(error);
        }).then(function () {
            setLoading(false);
        })
    }

    const switchCamera = () => {
        setCamera(
          camera === FacingMode.ENVIRONMENT
            ? FacingMode.USER
            : FacingMode.ENVIRONMENT
        )
    }

    const handleScan = (data) => {
        if (data) {
            //setHashMuestra(data);
            validarMuestra(data)
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    /*useEffect(() => {
        if(hashMuestra){
            validarMuestra(hashMuestra)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hashMuestra])*/

    return (
        <Page
            title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    Consulta Calificación
                </Box>} >
            
            {loading ?
                <Loading />
                : verGrafico ?
                    <Stack>
                        {promedioData?.length>0?
                            <Radar data={promedio} options={options} />
                            :
                            <Box sx={{ display: "flex", justifyContent: "center"}}>
                                <h2><Chip label="Aún hay Calificaciones disponibles"/></h2>
                            </Box>
                        }
                        <Button fullWidth variant="outlined" color="primary" onClick={()=>setVerGrafico(false)}>Comparar</Button>
                        <Divider sx={{mt: 2, mb:2}}/>
                        {promedioData.map((currentPromedio, index)=>{
                            return(currentPromedio&&<div key={"promedio-"+index}>
                                <Accordion variant="outlined">
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        <FontAwesomeIcon icon={faCircle} color={ComparatorColors[index]} style={{alignSelf: "center", marginRight: 10}}/><Typography color={ComparatorColors[index]}>Detalles Muestra #{currentPromedio.muestra.n}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack>
                                            <Paper sx={{p:1, mt: 1}} variant="outlined">
                                                <Divider sx={{pb:"5px"}}><Chip color="success" label={"PROMEDIO"}/></Divider>
                                                {currentPromedio.valores.map((currentValor, index)=>{
                                                    const idInput = "valores-promedio-"+index+"-input"
                                                    return(<Fragment key={idInput+"key"}>
                                                        <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                                                        <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                                                        <Divider/>
                                                    </Fragment>)
                                                })}
                                                <InputLabel htmlFor={idInput} sx={{fontWeight: "bold"}}><span>Promedio Total: </span><strong style={{paddingLeft:"5px"}}>{currentPromedio.promedioTotal}</strong></InputLabel>
                                                <Rating name={idInput} value={currentPromedio.promedioTotal} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                                                <Divider sx={{marginBottom: "5px"}}/>
                                                <InputLabel>Calificaciones: <strong style={{paddingLeft:"5px"}}>{currentPromedio.count}</strong></InputLabel>
                                            </Paper>
                                            <Grid container>
                                                {currentPromedio.calificaciones?.map((calificacion, index)=>{
                                                    const updatedAt = new Date(Date.parse(calificacion.updatedAt));
                                                    return(
                                                        <Grid item xs={matches?6:12} key={"calificacion-"+calificacion?.id} >
                                                            <Paper sx={{p: 1, ml: matches?(index%2):0, mt: 1}} elevation={4} key={"calificacion-"+calificacion.id}>
                                                                <Divider sx={{pb:"5px"}}><Chip sx={{textOverflow: "ellipsis"}} color="secondary" label={`#${calificacion.participante?.n} - ${calificacion.participante?.name}`}/></Divider>
                                                                {calificacion.valores.map((currentValor, indexCalificacion)=>{
                                                                    const idInput = "valores-prom-cal-"+index+"-"+indexCalificacion+"-input";
                                                                    return(<>
                                                                        <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                                                                        <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                                                                        <Divider/>
                                                                    </>)
                                                                })}
                                                                <InputLabel htmlFor={idInput} sx={{fontWeight: "bold"}}><span>Promedio Total: </span><strong style={{paddingLeft:"5px"}}>{currentValor.promedioTotal}</strong></InputLabel>
                                                                <Rating name={idInput} value={currentValor.promedioTotal} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                                                                <Divider sx={{marginBottom: "5px"}}/>
                                                                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                                                    <Chip variant="outlined" label={calificacion.participante.mesa?.name?calificacion.participante.mesa?.name:"SIN MESA"} />
                                                                    <div><FontAwesomeIcon icon={faClock} transform="shrink-6" style={{color: "grey"}}/><span style={{color: "grey"}}>{updatedAt.toLocaleTimeString().substr(0, updatedAt.toLocaleTimeString().lastIndexOf(":"))}</span></div>
                                                                </Box>
                                                            </Paper>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                            </div>);
                        })}
                    </Stack>
                    :
                    <Card>
                        <CardHeader
                            sx={{ pb: 0 }}
                            subheader="Escaneé el código de la muestra para consultar sus calificaciones"
                            action={
                                <IconButton aria-label="settings" onClick={() => { switchCamera() }}>
                                    <span className="fa-layers fa-fw fa-2x fa-dark">
                                        <FontAwesomeIcon icon={faCamera} />
                                        <FontAwesomeIcon icon={faSquareFull} transform="shrink-4 down-1" />
                                        <FontAwesomeIcon icon={faSyncAlt} inverse transform="shrink-8 down-1" />
                                    </span>
                                </IconButton>
                            } />
                        <CardContent>
                            {/*
                                <div>
                                    <input type="text" value={hashMuestra} onChange={(e)=>{setHashMuestra(e.target.value)}} />
                                    <button onClick={(e)=>{validarMuestra(hashMuestra)}}>Login</button>
                                </div>
                                <div>QR RESULT:{hashMuestra}</div>
                                <div>{JSON.stringify(error)}</div>
                            */}
                            <QrScanner
                                constraints={camera}
                                scanDelay={300}
                                onError={handleError}
                                onResult={handleScan}
                                containerStyle={{ width: "100%" }}
                            />
                            {/*
                            <QrReader
                                facingMode={camera}
                                delay={300}
                                onError={handleError}
                                onScan={handleScan}
                                style={{ width: "100%" }}
                            />
                            */}
                        </CardContent>
                    </Card>
            }
        </Page>
    )
}
