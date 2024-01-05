
import { Avatar, Button, Chip, Divider, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Page from "../Page";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCannabis, faChair, faEdit, faPlus, faStoreAlt, faTrash, faVihara } from '@fortawesome/free-solid-svg-icons'
import { orange, green, deepPurple, lightGreen, blueGrey } from '@mui/material/colors';
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import CategoriaColors from "../../colors/CategoriaColors";
import { Search } from "@mui/icons-material";
import ConfirmModal from "../../components/ConfirmModal";
import Context from "../../context/Context";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { faPersonThroughWindow } from "@fortawesome/free-solid-svg-icons";

export default function ListParticipante() {
  const context = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [participantes, setParticipantes] = useState([]);
  const [searchField, setSearchField] = useState("");
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  
  let navigate = useNavigate();

  const listAllParticipantes = () => {
    setLoading(true);
    setParticipantes();
    axios.get("/api/participante/list")
    .then(function (response) {
      // handle success
      console.log(response)
      if(response.status === 200){
        setParticipantes(response.data);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      setLoading(false);
    })
  };

  const deleteParticipante = (idParticipante) => {
    axios.delete("/api/participante/delete",{
      data:{
        id: idParticipante,
      }
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Categoría eliminada","success");
        listAllParticipantes();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo eliminar la Categoría","error");
      console.log(error);
    })
  };

  useEffect(() => {
    listAllParticipantes();
  }, []);

  return (
    <Page title="Listado Participantes" footer={false} loading={loading}>
        <>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width:"100%" }}
              >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={"Buscar..."}
                inputProps={{ 'aria-label': 'Buscar Participante'}}
                value={searchField}
                onChange={(e)=>setSearchField(e.target.value)}
                />
              <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <Search />
              </IconButton>
            </Paper>
            <Button variant="outlined" onClick={()=>{navigate("/participante/create")}} sx={{p: 1, m: 1}}>
              <FontAwesomeIcon icon={faPlus}/>
            </Button>
          </Box>
          <Divider sx={{my: 1}}/>
          {participantes?.length!==0?
            <List sx={{paddingTop: "0", marginTop: 0}}>
              {participantes?.filter(participante => (parseInt(participante.n)===(!isNaN(searchField)?parseInt(searchField):0) || participante.name?.toLowerCase().includes(searchField?.toLowerCase()))).map((participante)=>{
                return(
                  <div key={"participante-hash-"+participante.hash}>
                    <ListItem sx={{display: "flex", justifyContent: "space-between", m:0, p:0}}>
                      <Box sx={{display: "flex"}}>
                        <ListItemAvatar sx={{display: "flex", alignItems: "center", m:0, p:0}}>
                          <Avatar sx={{backgroundColor: orange[500]}}>
                            <h6>{"#"+participante.n}</h6>
                          </Avatar>
                        </ListItemAvatar>
                        <Stack>
                          <ListItemText
                            primary={
                              <Box sx={{display: "flex", alignItems: "center", mb: 1}}>
                                <Typography variant="h5" sx={{mr:1, fontWeight: "bold"}}>{participante.name}</Typography>
                                {participante.dojo&&
                                  <Chip component="div" icon={<FontAwesomeIcon icon={faVihara} style={{color: "white"}}/>} size="small" label={participante.dojo?.name} sx={{mr: 1, backgroundColor: deepPurple[400], color: "white"}}/>
                                }
                                {participante.esInvitado&&
                                  <Chip component="div" icon={<FontAwesomeIcon icon={faPersonThroughWindow} style={{color: "white"}}/>} size="small" label="Invitado" sx={{mr: 1, backgroundColor: blueGrey[400], color: "white"}}/>
                                }
                                {participante.grow&&
                                  <Chip title="Es Grow" icon={
                                    <span className="fa-layers fa-fw" style={{color: "black", marginLeft:10}}>
                                      <FontAwesomeIcon icon={faCannabis} transform="shrink-4 up-8"/>
                                      <FontAwesomeIcon icon={faStoreAlt} transform="shrink-3 down-5"/>
                                    </span>
                                  }
                                  sx={{backgroundColor: lightGreen[400], fontWeight: "bold"}}
                                  label={participante.grow}
                                  />
                                }
                              </Box>
                            } 
                            secondaryTypographyProps={{variant: "div"}}
                            secondary={participante.muestras?.map((muestra)=>
                              <Chip
                                key={"muestra-hash-"+muestra.hash}
                                component="span"
                                sx={{pl: "5px", mr: 1, mb: 1, backgroundColor: green[200], fontWeight: "bold", height: "auto", p: 1}}
                                icon={<FontAwesomeIcon icon={faCannabis} style={{color: "black"}}/>}
                                label={
                                <Box sx={{display: "flex", flexDirection: matches?"row":"column", alignItems: "center", m:0, p:0}}>
                                  <Chip size="small" label={"#"+muestra.n} sx={{mx: 1, backgroundColor: green[400]}}/>
                                  <Typography sx={{fontWeight: "bold", maxWidth:matches?"auto":"150px", overflow: "hidden", textOverflow: "ellipsis"}}>{muestra.name+(muestra.description?(" ("+muestra.description+")"):"")}</Typography>
                                  <Chip size="small" label={muestra.categoria?.name} sx={{mx: 1, backgroundColor: CategoriaColors[muestra.categoria.id-1], fontWeight: "bold", color:"white"}}/>
                                </Box>
                              } />
                            )}
                          />
                          <Box sx={{display:"flex"}}>
                            {participante.mesa&&
                              <Chip icon={<FontAwesomeIcon icon={faChair} style={{color: "black", marginLeft:"10px"}}/>} variant="outlined" label={participante.mesa?.name} sx={{mr: 1, width: "fit-content", fontWeight: "bold"}}/>
                            }
                            {participante.mesaSecundaria&&
                              <Chip icon={<FontAwesomeIcon icon={faChair} style={{color: "lightGray", marginLeft:"10px"}}/>} variant="outlined" label={participante.mesaSecundaria?.name} sx={{mr: 1, p:0, fontSize: ".7rem", color: "lightGray", width: "fit-content", fontWeight: "bold"}}/>
                            }
                          </Box>
                        </Stack>
                      </Box>
                      <Box>
                        <Button variant="outlined" sx={{justifySelf: "end", mr: 1}} onClick={()=>{navigate("/participante/edit/"+participante.id)}}><FontAwesomeIcon icon={faEdit}/></Button>
                        <ConfirmModal faIcon={faTrash} buttonColor="error" message="Esta seguro que desea eliminar el Participante?" operation={()=>{deleteParticipante(participante.id)}}/>
                      </Box>
                    </ListItem>
                    <Divider sx={{mt:1}} />
                  </div>
                )
              })}
            </List>
            :
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h2><Chip label="No se encontraron participantes"/></h2>
            </Box>
          }
        </>
    </Page>
  );
}
