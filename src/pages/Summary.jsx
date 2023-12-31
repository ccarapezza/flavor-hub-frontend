import { faCannabis, faClock, faGavel, faStoreAlt, faUser, faVihara } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Card, CardContent, Divider,List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'
import { deepOrange, deepPurple, green, indigo, lightGreen } from '@mui/material/colors';
import { Box } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import CategoriaColors from "../colors/CategoriaColors";

export default function Summary() {
    const [dataCup, setDataCup] = useState({});
    const [dojos, setDojos] = useState([]);
    const [grows, setGrows] = useState([]);
    const [muestrasPorCategoria, setMuestasPorCategoria] = useState([]);
    const [muestasPorCategoriaGraphData, setMuestasPorCategoriaGraphData] = useState();

    const [options, setOptions] = useState({});

    const listAllDojos = () => {
        axios.get("/api/dojo/list")
        .then(function (response) {
            // handle success
            if(response.status === 200){
                setDojos(response.data);
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });       
    };

    const listAllParticipantes = () => {
        axios.get("/api/participante/list")
        .then(function (response) {
          // handle success
          if(response.status === 200){
            const participantes = response.data;
            const grows = participantes.filter((participante)=>(participante.grow)?true:false).reduce(function(grows, participante){
                if(!grows.includes(participante.grow)){
                    grows.push(participante.grow);
                }
                
                return grows;
            },[]);

            const muestras = participantes.reduce(function(muestras, participante){
                muestras.push(...participante.muestras);
                return muestras;
            },[]);

            const muestrasPorCategoriaAux = muestras.reduce(function(categorias, muestra){
                if(!categorias[muestra.categoria.name]){
                    categorias[muestra.categoria.name] = {
                        count : 1,
                        categoriaId : muestra.categoria.id
                    };
                }else{
                    categorias[muestra.categoria.name] = {
                        ...categorias[muestra.categoria.name],
                        count : categorias[muestra.categoria.name].count+1,
                    };
                }
                return categorias;
            },[])

            const data = {
                labels: ["Muestras"],
                datasets: Object.keys(muestrasPorCategoriaAux).map((categoria)=>{
                    return({
                        label: categoria,
                        data: [muestrasPorCategoriaAux[categoria].count],
                        backgroundColor: CategoriaColors[muestrasPorCategoriaAux[categoria].categoriaId],
                    });
                }),
            };

            const totalMuestras = Object.keys(muestrasPorCategoriaAux).map((categoria)=>muestrasPorCategoriaAux[categoria]).reduce(function(total, muestra){ total+=muestra.count; return total; },0);

            setOptions({
                scales: {
                    y: {
                        stacked: true,
                        ticks: {
                            beginAtZero: true,
                            stepSize: 1
                        },
                        max: totalMuestras+(totalMuestras*0.1)
                    },
                    x: {
                        stacked: true
                    }
                }
            });

            setGrows(grows);
            setMuestasPorCategoria(muestrasPorCategoriaAux);
            setMuestasPorCategoriaGraphData(data);
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    };

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

                const mesaDataCalificaciones = data.mesaData.map((mesa)=>{
                    const calificacionesMesaCount = mesa.participantes.reduce(function(calificacionesCount, participante){
                        return calificacionesCount + participante.calificaciones.length;
                    },0);
                    return ({
                        name: mesa.name,
                        calificacionesRealizadas:  calificacionesMesaCount,
                        calificacionesEsperadas: mesa.participantes.length*mesa.muestras.length,
                        participantes: mesa.participantes,
                        muestras: mesa.muestras
                    });
                });

                console.log(mesaDataCalificaciones)

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
        listAllDojos();
        listAllParticipantes();
    }, [])

    return (<Box>
        <Box sx={{display: "flex", justifyContent: "space-around", alignItems: "stretch"}}>
            
            <Card elevation={4} sx={{ minWidth: 275, width:"fit-content", alignSelf: "center", margin: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <Typography component="div" sx={{ fontSize: 20, textAlign: "center" }} color="text.primary" gutterBottom>
                        <h2>Resumen de la copa</h2>
                    </Typography>
                    <Divider/>
                    <Typography variant="h5" component="div" sx={{display:"flex", alignItems: "center", color: deepOrange[500], fontSize:"2.5rem"}}>
                        <FontAwesomeIcon icon={faUser} style={{padding: 10, paddingTop:5, paddingBottom:5}}/>
                        {dataCup.participantesCount}
                    </Typography>
                    <Typography sx={{ mb: 1.5, fontWeight: "bold", fontSize:"1.3rem" }} color="text.secondary">
                        Participantes
                    </Typography>
                    <Divider/>
                    <Typography variant="h5" component="div" sx={{display:"flex", alignItems: "center", color: green[500], fontSize:"2.5rem"}}>
                        <FontAwesomeIcon icon={faCannabis} style={{padding: 10, paddingTop:5, paddingBottom:5}}/>
                    {dataCup.muestrasCount}
                    </Typography>
                    <Typography sx={{ mb: 1.5, fontWeight: "bold", fontSize:"1.3rem" }} color="text.secondary">
                        Muestras
                    </Typography>
                    <Divider/>
                    <Typography variant="h5" component="div" sx={{display:"flex", alignItems: "center", color: indigo[500], fontSize:"2.5rem"}}>
                        <FontAwesomeIcon icon={faGavel} style={{padding: 10, paddingTop:5, paddingBottom:5}}/>
                        {dataCup.juradosCount}
                    </Typography>
                    <Typography sx={{ mb: 1.5, fontWeight: "bold", fontSize:"1.3rem" }} color="text.secondary">
                        Jurados
                    </Typography>
                    <Divider/>
                    <div><FontAwesomeIcon icon={faClock} transform="shrink-6" style={{color: "grey"}}/><span style={{color: "grey"}}>{dataCup.ultimaActualizacion}</span></div>
                </CardContent>
            </Card>
            <Card elevation={4} sx={{ minWidth: 275, width:"fit-content", alignSelf: "center", margin: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <Typography component="div" sx={{ fontSize: 20, textAlign: "center" }} color="text.primary" gutterBottom>
                        <h2>Dojos</h2>
                    </Typography>
                    <List sx={{paddingTop: "0", marginTop: 0}}>
                        {dojos?.map((dojo)=>{
                            return(
                                <ListItem key={"dojo-list-element-"+dojo.id} sx={{display: "flex", justifyContent: "space-between"}}>
                                    <Box sx={{display: "flex"}}>
                                    <ListItemAvatar sx={{display: "flex", alignItems: "center"}}>
                                        <Avatar sx={{backgroundColor: deepPurple[500]}}>
                                        <FontAwesomeIcon icon={faVihara}/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <Stack>
                                        <ListItemText primary={<Typography variant="h5" sx={{mr:1, fontWeight: "bold"}}>{dojo.name}</Typography>} />
                                    </Stack>
                                    </Box>
                                </ListItem>
                            )
                        })}
                    </List>
                </CardContent>
            </Card>
            <Card elevation={4} sx={{ minWidth: 275, width:"fit-content", alignSelf: "center", margin: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <Typography component="div" sx={{ fontSize: 20, textAlign: "center" }} color="text.primary" gutterBottom>
                        <h2>Grows</h2>
                    </Typography>
                    <List sx={{paddingTop: "0", marginTop: 0}}>
                        {grows?.map((grow)=>{
                            return(
                                <ListItem key={"dojo-list-element-"+grow} sx={{display: "flex", justifyContent: "space-between"}}>
                                    <Box sx={{display: "flex"}}>
                                    <ListItemAvatar sx={{display: "flex", alignItems: "center"}}>
                                        <Avatar sx={{backgroundColor: lightGreen[500]}}>
                                            <span className="fa-layers fa-fw" style={{color: "white"}}>
                                                <FontAwesomeIcon icon={faCannabis} transform="shrink-4 up-8"/>
                                                <FontAwesomeIcon icon={faStoreAlt} transform="shrink-3 down-5"/>
                                            </span>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <Stack>
                                        <ListItemText primary={<Typography variant="h5" sx={{mr:1, fontWeight: "bold"}}>{grow}</Typography>} />
                                    </Stack>
                                    </Box>
                                </ListItem>
                            )
                        })}
                    </List>
                </CardContent>
            </Card>
            <Card elevation={4} sx={{ minWidth: 275, width:"fit-content", alignSelf: "center", margin: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <Typography component="div" sx={{ fontSize: 20, textAlign: "center" }} color="text.primary" gutterBottom>
                        <h2>Muestras</h2>
                    </Typography>
                    <List sx={{paddingTop: "0", marginTop: 0}}>
                        {Object.keys(muestrasPorCategoria).map((categoria)=>{
                            return(
                                <ListItem key={"dojo-list-element-"+categoria} sx={{display: "flex", justifyContent: "space-between"}}>
                                    <Box sx={{display: "flex"}}>
                                    <ListItemAvatar sx={{display: "flex", alignItems: "center"}}>
                                        <Avatar sx={{backgroundColor: CategoriaColors[muestrasPorCategoria[categoria].categoriaId]}}>
                                            {muestrasPorCategoria[categoria].count}
                                            {}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <Stack>
                                        <ListItemText primary={<Typography variant="h5" sx={{mr:1, fontWeight: "bold"}}>{categoria}</Typography>} />
                                    </Stack>
                                    </Box>
                                </ListItem>
                            )
                        })}
                    </List>
                </CardContent>
            </Card>

            <Card elevation={4} sx={{ minWidth: 275, alignSelf: "center", margin: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    {muestasPorCategoriaGraphData?.datasets?.length>0&&
                        <Bar data={muestasPorCategoriaGraphData} options={options} height={500}/>
                    }
                </CardContent>
            </Card>
        </Box>
    </Box>)
}
