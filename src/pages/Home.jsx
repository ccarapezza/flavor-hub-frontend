import { useContext, useEffect, useState } from "react";
import { faCannabis, faChair, faClock, faCogs, faDatabase, faKey, faListAlt, faPollH, faQrcode, faSearch, faSignOutAlt, faSquare, faTags, faUser, faVihara } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Chip, Divider, Grid, InputLabel, Paper, Rating, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Context from "../context/Context";
import Page from "./Page";
import axios from "axios";
import { Box } from "@mui/material";
import { Fragment } from "react";

export default function Home() {
  const context = useContext(Context);
  let navigate = useNavigate();
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const listCalificaciones = () => {
    setLoading(true);
    setCalificaciones();
    axios.get("/api/participante/calificaciones")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setCalificaciones(response.data?.calificaciones);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    }).then(function() {
      setLoading(false);
    })
  };

  useEffect(() => {
    if(context.isParticipanteLogged){
      listCalificaciones();
    }
  }, [context.isParticipanteLogged]);

  return (
    <Page title="Home" loading={loading}>
      <Stack spacing={2}>
        {context.isLogged?
          <>
            <Grid container>
              <Grid item xs={12}>
                <Paper sx={{m:1, p:1, mt: 2}}>
                  <Stack spacing={1}>
                    <Divider sx={{mb:2}}>
                      <Chip label="Carga de Datos" color="primary"/>
                    </Divider>
                    <Button variant="outlined" fullWidth onClick={()=>{navigate("/participante/list")}}>
                      <span className="fa-layers fa-fw fa-2x">
                        <FontAwesomeIcon icon={faListAlt} transform="shrink-6 left-1"/>
                      </span>
                      <span>Participantes</span>
                    </Button>
                    <Button variant="outlined" fullWidth onClick={()=>{navigate("/muestra/list")}}>
                      <span className="fa-layers fa-fw fa-2x">
                        <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-1"/>
                      </span>
                      <span>Muestras</span>
                    </Button>
                    <Button variant="outlined" fullWidth onClick={()=>{navigate("/participante/jurado-list")}}>
                      <span className="fa-layers fa-fw fa-2x">
                        <FontAwesomeIcon icon={faListAlt} transform="shrink-6 left-1"/>
                      </span>
                      <span>Jurados</span>
                    </Button>
                    <Button variant="outlined" fullWidth onClick={()=>{navigate("/dojo/list")}}>
                      <span className="fa-layers fa-fw fa-2x">
                        <FontAwesomeIcon icon={faVihara} transform="shrink-6 left-1"/>
                      </span>
                      <span>Dojos</span>
                    </Button>
                    <Button variant="outlined" fullWidth onClick={()=>{navigate("/categoria/list")}}>
                      <span className="fa-layers fa-fw fa-2x">
                        <FontAwesomeIcon icon={faTags} transform="shrink-6 left-1"/>
                      </span>
                      <span>Categorias</span>
                    </Button>
                    <Button variant="outlined" fullWidth onClick={()=>{navigate("/mesas-manager")}}>
                      <span className="fa-layers fa-fw fa-2x">
                        <FontAwesomeIcon icon={faChair} transform="shrink-6 left-1"/>
                      </span>
                      <span>Mesas</span>
                    </Button>
                  </Stack>
                </Paper>
                <Paper sx={{m:1, p:1, mt: 2}}>
                  <Stack spacing={1}>
                    <Divider sx={{mb:2}}>
                      <Chip label="Avanzando" color="primary"/>
                    </Divider>
                    <Button variant="outlined" fullWidth onClick={()=>{navigate("/change-admin-pass")}}>
                      <span className="fa-layers fa-fw fa-2x">
                        <FontAwesomeIcon icon={faKey} transform="shrink-6 left-1"/>
                      </span>
                      <span>Cambio de contraseña</span>
                    </Button>
                    <Button variant="outlined" fullWidth onClick={()=>{navigate("/config")}}>
                      <span className="fa-layers fa-fw fa-2x">
                        <FontAwesomeIcon icon={faCogs} transform="shrink-6 left-1"/>
                      </span>
                      <span>Configuración Copa</span>
                    </Button>
                  </Stack>
                </Paper>
                <Paper sx={{m:1, p:1, mt: 2}}>
                  <Stack spacing={1}>
                    <Divider sx={{mb:2}}>
                      <Chip label="Generacion QRs" color="primary"/>
                    </Divider>
                    <Button variant="outlined" fullWidth onClick={()=>{navigate("/participante/qr-list")}}>
                      <span className="fa-layers fa-fw fa-2x">
                        <FontAwesomeIcon icon={faQrcode} transform="shrink-6 left-1"/>
                        <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                        <FontAwesomeIcon icon={faUser} inverse transform="shrink-12 down-4 right-4"/>
                      </span>
                      <span>QRs Participantes</span>
                    </Button>
                    <Button variant="outlined" fullWidth onClick={()=>{navigate("/muestra/qr-list")}}>
                      <span className="fa-layers fa-fw fa-2x">
                        <FontAwesomeIcon icon={faQrcode} transform="shrink-6 left-1"/>
                        <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                        <FontAwesomeIcon icon={faCannabis} inverse transform="shrink-12 down-4 right-4"/>
                      </span>
                      <span>QRs Muestras</span>
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{m:1, p:1, mt: 2}}>
                  <Stack spacing={1}>
                    <Divider sx={{mb:2}}>
                      <Chip label="Resumen" color="primary"/>
                    </Divider>
                    <Button variant="outlined" fullWidth onClick={()=>{navigate("/calificaciones/resultados")}}>
                      <span className="fa-layers fa-fw fa-2x">
                        <FontAwesomeIcon icon={faPollH} transform="shrink-6 left-1"/>
                      </span>
                      <span>Resultados</span>
                    </Button>
                    <Button variant="outlined" fullWidth onClick={()=>{navigate("/calificaciones/muestra")}}>
                        <span className="fa-layers fa-fw fa-2x">
                          <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-3"/>
                          <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4 left-2"/>
                          <FontAwesomeIcon icon={faSearch} inverse transform="shrink-12 down-4 right-4 left-2"/>
                        </span>
                      <span>Consultar Muestras</span>
                    </Button>
                    <Button variant="outlined" fullWidth onClick={()=>{navigate("/summary")}}>
                      <span className="fa-layers fa-fw fa-2x">
                        <FontAwesomeIcon icon={faDatabase} transform="shrink-6 left-1"/>
                      </span>
                      <span>Summary</span>
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
            
            
            <Button variant="contained" fullWidth onClick={()=>{context.logout()}}>
              <span className="fa-layers fa-fw fa-2x">
                <FontAwesomeIcon icon={faSignOutAlt} transform="shrink-6 left-1"/>
              </span>
              <span>Cerrar Sesión</span>
            </Button>
          </>
          :context.isParticipanteLogged?
            <>
              <Button variant="outlined" sx={{alignItems: "center", flexDirection: "column"}} onClick={()=>{navigate("/calificacion")}} >
                <span className="fa-layers fa-fw fa-2x">
                  <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-1"/>
                  <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                  <FontAwesomeIcon icon={faQrcode} inverse transform="shrink-12 down-4 right-4"/>
                </span>
                <span>Calificar Muestra</span>
              </Button>
              {context.isJuradoLogged&&
                <Button variant="outlined" sx={{alignItems: "center", flexDirection: "column"}} onClick={()=>{navigate("/calificaciones/muestra")}}>
                  <span className="fa-layers fa-fw fa-2x">
                    <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-1"/>
                    <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                    <FontAwesomeIcon icon={faSearch} inverse transform="shrink-12 down-4 right-4"/>
                  </span>
                  <span>Consultar Muestras</span>
                </Button>
              }
              <Divider>Calificaciones realizadas</Divider>
              {calificaciones?.length?
                <Grid container>
                  {calificaciones?.map((calificacion)=>{
                    const updatedAt = new Date(Date.parse(calificacion.updatedAt));
                    return(<Grid item xs={12} key={calificacion?.muestra?.hash} paddingBottom="10px">
                      <Paper sx={{padding:"5px"}} elevation={3}>
                        <Divider sx={{pb:"5px"}}><Chip color="secondary" label={`Muestra #${calificacion.muestra.n}`}/></Divider>

                        {calificacion.valores.map((currentValor, index)=>{
                          const idInput = "valores-dojo-"+index+"-input"
                          return(<Fragment key={idInput+"-key"}>
                              <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                              <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                              <Divider/>
                            </Fragment>)
                        })}

                        <Divider sx={{marginBottom: "5px"}}/>
                        <Box sx={{display: "flex", justifyContent: "end", alignItems: "center"}}>
                          {/*<Button startIcon={<Edit/>} color="secondary" variant="contained" size="small" onClick={()=>navigate("/calificacion/"+calificacion?.muestra?.hash)}>Editar</Button>*/}
                          <div><FontAwesomeIcon icon={faClock} transform="shrink-6" style={{color: "grey"}}/><span style={{color: "grey"}}>{updatedAt.toLocaleTimeString().substr(0, updatedAt.toLocaleTimeString().lastIndexOf(":"))}</span></div>
                        </Box>
                      </Paper>
                    </Grid>)
                  })}
                </Grid>
                :
                <Chip label="Aún no ha realizado calificaciones"/>
              }
            </>
          :
          <>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "80vh"}} className="animate__animated animate__fadeIn main-logo-animation">
                <img src="/logo-2.png" alt="CodeloCup" style={{width:"100%", maxWidth:"400px", zIndex: 99}}/>
                <Button variant="outlined" fullWidth onClick={()=>{navigate("/login")}} sx={{mt:2}}>
                    <span className="fa-layers fa-fw fa-2x">
                        <FontAwesomeIcon icon={faUser} transform="shrink-6 left-1"/>
                        <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                        <FontAwesomeIcon icon={faQrcode} inverse transform="shrink-12 down-4 right-4"/>
                    </span>
                    <span>Ingresar</span>
                </Button>
            </Box>
          </>
        }
      </Stack>
    </Page>
  );
}
