import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, CardContent, Chip, Divider, Grid, LinearProgress, Paper, Typography } from '@mui/material'
import { indigo, orange } from '@mui/material/colors';
import { Box } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react'

export default function SummaryCalificaciones() {
    const [dataCup, setDataCup] = useState({});

    const getDataCup = () => {
        axios.get("/api/data")
        .then(function (response) {
            // handle success
            if(response.status === 200){
                const data = response.data;
                const cantidadDeVotosEsperados = data.mesaData.map((mesa)=>{
                    return mesa.muestras?.length*mesa.participantes?.length;
                }).reduce(function(valorAnterior, valorActual){
                    return valorAnterior + valorActual;
                },0);

                const muestrasCountByCategoria = data.muestrasCategoria.reduce(function(reduceValue, currentValue){
                    if(reduceValue[currentValue.categoria.name]){
                        reduceValue[currentValue.categoria.name]++
                    }else{
                        reduceValue[currentValue.categoria.name] = 1;
                    }
                    return reduceValue;
                },{})

                const mesaDataCalificaciones = data.mesaData.map((mesa)=>{
                    const calificacionesMesaCount = mesa.participantes.reduce(function(calificacionesCount, participante){
                        return calificacionesCount + participante.calificaciones.length;
                    },0);

                    const calificacionesSecMesaCount = mesa.participantesSecundarios.reduce(function(calificacionesCount, participante){
                        return calificacionesCount + participante.calificaciones.length;
                    },0);

                    const calificacionesByCategoriaMesaCount = mesa.categorias.map((categoria)=>categoria.name).reduce(function(reduceValue, currentValue){
                        reduceValue+=muestrasCountByCategoria[currentValue];
                        return reduceValue;
                    },0);

                    return ({
                        id: mesa.id,
                        name: mesa.name,
                        calificacionesRealizadas:  calificacionesMesaCount+calificacionesSecMesaCount,
                        calificacionesEsperadas: mesa.participantes.length*(mesa.participantesSecundarios.length?mesa.participantesSecundarios.length:1)*mesa.muestras.length + calificacionesByCategoriaMesaCount*mesa.participantes.length+ calificacionesByCategoriaMesaCount*mesa.participantesSecundarios.length ,
                        calificacionesEsperadaPorParticipante: mesa.muestras.length + calificacionesByCategoriaMesaCount,
                        participantes: mesa.participantes,
                        participantesSecundarios: mesa.participantesSecundarios,
                        muestras: mesa.muestras
                    });
                });

                console.log(mesaDataCalificaciones)
                console.log(muestrasCountByCategoria)

                const calificacionesCount = data.calificaciones.length;
                const calificacionesJuradoCount = data.calificacionesJurado.length;
                const muestrasCount = data.muestras.count;
                const participantesCount = data.participantes.count;
                const juradosCount = data.jurados.count;
                const lastUpdated = new Date();

                setDataCup({
                    mesaDataCalificaciones,
                    cantidadDeVotosEsperados,
                    calificacionesCount,
                    calificacionesJuradoCount,
                    muestrasCount,
                    muestrasCountByCategoria,
                    participantesCount,
                    juradosCount,
                    ultimaActualizacion: lastUpdated.toLocaleTimeString().substr(0, lastUpdated.toLocaleTimeString().lastIndexOf(":"))
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        })
    };

    useEffect(() => {
        getDataCup();
    }, [])

    return (<Box>
        <Card elevation={4} sx={{ minWidth: 275, alignSelf: "center", margin: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ width: '100%', mr: 1, display: "block" }}>
                    <Typography component="div" sx={{ fontSize: 20, textAlign: "center" }} color="text.primary" gutterBottom>
                        <h2 style={{margin: 0}}>Calificaciones totales</h2>
                        <h1 style={{margin: 0}}>{parseInt(dataCup.cantidadDeVotosEsperados?dataCup.calificacionesCount/dataCup.cantidadDeVotosEsperados*100:0)}%</h1>
                    </Typography>
                    <LinearProgress  sx={{height:"1rem", borderRadius: "5px", marginBottom: 2}} color="success" variant="determinate" value={dataCup.cantidadDeVotosEsperados?dataCup.calificacionesCount/dataCup.cantidadDeVotosEsperados*100:0} />
                    <Typography component="div" sx={{ fontSize: 20, textAlign: "center" }} color="text.primary" gutterBottom>
                        <p style={{margin:1}}><small style={{fontWeight: "bold"}}>Cal. realizadas: {dataCup.calificacionesCount}</small></p>
                        <p style={{margin:1}}><small style={{fontWeight: "bold"}}>Cal. restantes: {dataCup.cantidadDeVotosEsperados-dataCup.calificacionesCount}</small></p>
                    </Typography>
                    <Divider/>
                    <p style={{margin:1}}><small style={{fontWeight: "bold"}}><i>Cal. de jurados: {dataCup.calificacionesJuradoCount}</i></small></p>
                </Box>
            </CardContent>
        </Card>
        <Card elevation={4} sx={{ minWidth: 275, alignSelf: "center", margin: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Grid container>
                    {dataCup.mesaDataCalificaciones?.sort(function(a, b) {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                    }).map((mesa)=>{
                    return(<Grid key={"mesa"+mesa.id} item xs={12} sm={6} sx={{padding: 1}}>
                        <Paper sx={{borderColor:"#000" }} variant="outlined">
                            <Divider><h3 style={{margin:10}}>{mesa.name}</h3></Divider>
                            <Box sx={{px: 1}}>
                                <Box sx={{ position: 'relative'}}>
                                    <LinearProgress sx={{height:"1.1rem", borderRadius: "5px", marginBottom: 1}} color="success" variant="determinate" value={mesa.calificacionesEsperadas?mesa.calificacionesRealizadas/mesa.calificacionesEsperadas*100:0} />
                                    <Box sx={{
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {parseInt(mesa.calificacionesEsperadas?mesa.calificacionesRealizadas/mesa.calificacionesEsperadas*100:0)}%
                                    </Box>
                                </Box>
                                <p style={{margin:1}}><small style={{fontWeight: "bold"}}>Cal. realizadas: {mesa.calificacionesRealizadas}</small></p>
                                <p style={{margin:1}}><small style={{fontWeight: "bold"}}>Cal. restantes: {mesa.calificacionesEsperadas-mesa.calificacionesRealizadas}</small></p>
                                <Divider/>
                                {mesa.participantes.map((participante)=>
                                    <Box key={"mesa"+mesa.id+"participante"+participante.id} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: orange[500], borderRadius: 1, margin: 1, fontSize: ".7rem"}}>
                                        <Box sx={{display: "flex", alignItems:"center", justifyContent: "start"}}>
                                            <FontAwesomeIcon icon={faUser} style={{paddingLeft: 10}}/>
                                            <Chip size="small" label={"#"+participante.n} sx={{margin: 0, fontSize: ".6rem", fontWeight: "bold", backgroundColor: orange[200], mx: "4px"}}/>
                                            <Typography sx={{maxWidth:"150px", whiteSpace: "nowrap", fontSize: ".7rem", overflow: "hidden", textOverflow: "ellipsis", p:"2px"}}>{participante.name}</Typography>
                                        </Box>
                                        <Box sx={{mx: 1, fontWeight: "bold", fontSize: ".8rem"}}>
                                            <p style={{margin:0}}>{participante.calificaciones.length}/{mesa.calificacionesEsperadaPorParticipante}</p>
                                        </Box>
                                    </Box>
                                )}

                                {mesa.participantesSecundarios.map((participante)=>
                                    <Box key={"mesa"+mesa.id+"participante"+participante.id} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: indigo[300], borderRadius: 1, margin: 1, fontSize: ".7rem"}}>
                                        <Box sx={{display: "flex", alignItems:"center", justifyContent: "start"}}>
                                            <FontAwesomeIcon icon={faUser} style={{paddingLeft: 10}}/>
                                            <Chip size="small" label={"#"+participante.n} sx={{margin: 0, fontSize: ".6rem", fontWeight: "bold", backgroundColor: indigo[200], mx: "4px"}}/>
                                            <Typography sx={{maxWidth:"150px", whiteSpace: "nowrap", fontSize: ".7rem", overflow: "hidden", textOverflow: "ellipsis", p:"2px"}}>{participante.name}</Typography>
                                        </Box>
                                        <Box sx={{mx: 1, fontWeight: "bold", fontSize: ".8rem"}}>
                                            <p style={{margin:0}}>{participante.calificaciones.length}/{mesa.calificacionesEsperadaPorParticipante}</p>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Grid>)
                    })}
                </Grid>
            </CardContent>
        </Card>
    </Box>)
}
