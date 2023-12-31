import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Page from "../Page";
import { Button, Chip, Divider, Grid, IconButton, InputBase, Paper, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import { Search } from "@mui/icons-material";
import { Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCannabis, faDice, faEdit, faExclamationCircle, faPlus, faTag, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { orange, green, red, indigo, yellow, blue } from '@mui/material/colors';
import DropBox from "../../components/DropBox";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend'
import DraggableBox  from "../../components/DraggableBox";
import Context from "../../context/Context.js";
import ConfirmModal from "../../components/ConfirmModal";
import ButtonModal from "../../components/ButtonModal";
import CategoriaColors from "../../colors/CategoriaColors.js";
import { useTheme } from "@emotion/react";

export default function MesasManager() {
  const [loading, setLoading] = useState(false);
  const [mesas, setMesas] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [muestras, setMuestras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [searchFieldMuestra, setSearchFieldMuestra] = useState("");
  const [searchFieldParticipante, setSearchFieldParticipante] = useState("");
  const [mesaName, setMesaName] = useState("");
  const [randomizeEnableDisabled, setRandomizeEnableDisabled] = useState(false);
  const matches = useMediaQuery(useTheme().breakpoints.up('sm'));
  const [mode, setMode] = useState("");

  const context = useContext(Context);

  const listAllParticipantes = () => {
    setParticipantes([]);
    axios.get("/api/participante/list")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setParticipantes(response.data);
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo obtener los participantes","error");
      console.log(error);
    })   
  };

  const listAllMuestras = () => {
    setMuestras([]);
    axios.get("/api/muestras/qrs")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setMuestras(response.data);
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo obtener las muestras","error");
      console.log(error);
    })
  };

  const listAllCategorias = () => {
    setCategorias([]);
    axios.get("/api/categoria/list")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setCategorias(response.data);
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo obtener las categorías","error");
      console.log(error);
    })   
  };

  const listAllMesas = () => {
    setLoading(true);
    setMesas([]);
    clearSearchFields();
    axios.get("/api/mesas/all")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setMesas(response.data);
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo obtener las mesas","error");
      console.log(error);
    })
    .then(function () {
      setLoading(false);
    })
  };

  const deleteParticipanteOfMesa = (idParticipante, idMesa) => {
    axios.post("/api/mesas/remove-participante",{
      idParticipante: idParticipante,
      idMesa: idMesa,
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Mesa actualizada","success");
        listAllMesas();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo actualizar la mesa","error");
      console.log(error);
    })
  };

  const deleteCategoriaOfMesa = (idCategoria, idMesa) => {
    axios.post("/api/mesas/remove-categoria",{
      idCategoria: idCategoria,
      idMesa: idMesa,
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Mesa actualizada","success");
        listAllMesas();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo actualizar la mesa","error");
      console.log(error);
    })
  };

  const deleteParticipanteSecOfMesa = (idParticipante, idMesa) => {
    axios.post("/api/mesas/remove-participante-secundario",{
      idParticipante: idParticipante,
      idMesa: idMesa,
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Mesa actualizada","success");
        listAllMesas();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo actualizar la mesa","error");
      console.log(error);
    })
  };

  const deleteMuestraOfMesa = (idMuestra, idMesa) => {
    axios.post("/api/mesas/remove-muestra",{
      idMuestra: idMuestra,
      idMesa: idMesa,
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Mesa actualizada","success");
        listAllMesas();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo actualizar la mesa","error");
      console.log(error);
    })
  };

  const updateMesa = (idMesa) => {
    axios.put("/api/mesas/update",{
      id: idMesa,
      name: mesaName,
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Mesa actualizada","success");
        listAllMesas();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo actualizar la mesa","error");
      console.log(error);
    })
  };

  const createMesa = (mesa) => {
    console.log("Create Mesa: "+mesa);
    axios.post("/api/mesas/create",{
      name: mesaName,
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Mesa creada","success");
        listAllMesas();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo crear la mesa","error");
      console.log(error);
    })
  };

  const deleteMesa = (idMesa) => {
    axios.delete("/api/mesas/delete",{
      data:{
        id: idMesa,
      }
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Mesa eliminada","success");
        listAllMesas();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo eliminar la mesa","error");
      console.log(error);
    })
  };

  const clearSearchFields = () => {
    setMode("");
    setSearchFieldMuestra("");
    setSearchFieldParticipante("");
  }

  const isParticipanteExistInMesas = (idParticipante) => {
    return mesas.map((mesa)=>mesa.participantes.map((participante)=>participante.id)).flat().includes(idParticipante);
  }

  const isParticipanteSecExistInMesas = (idParticipante) => {
    return mesas.map((mesa)=>mesa.participantesSecundarios.map((participante)=>participante.id)).flat().includes(idParticipante);
  }

  const isMuestraExistInMesas = (idMuestra) => {
    return mesas.map((mesa)=>mesa.muestras.map((muestra)=>muestra.id)).flat().includes(idMuestra);
  }

  const muestraCountInMesas = (idMuestra) => {
    return mesas.map((mesa)=>mesa.muestras.map((muestra)=>muestra.id)).flat().reduce(function(valorAnterior, valorActual){
      return valorAnterior + ((valorActual===idMuestra)?1:0);
    },0)
  }

  const naturalSorter = (as, bs) => {
    var a, b, a1, b1, i= 0, n, L,
    rx=/(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;
    if(as=== bs) return 0;
    a= as.toLowerCase().match(rx);
    b= bs.toLowerCase().match(rx);
    L= a.length;
    while(i<L){
        if(!b[i]) return 1;
        a1= a[i];
        b1= b[i++];
        if(a1!== b1){
            n= a1-b1;
            if(!isNaN(n)) return n;
            return a1>b1? 1:-1;
        }
    }
    return b[i]? -1:0;
  }

  const handoutParticipantes = () => {
    axios.get("/api/mesas/handOutMuestas")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        context.showMessage("Mesas distribuidas correctamente","success");
        listAllMesas();
        obtainRandomizeEnable();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo distribuir las mesas correctamente","error");
      console.log(error);
    })   
  }

  const obtainRandomizeEnable = () => {
    setLoading(true);
    axios.get("/api/mesas/randomizeEnable")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        console.log(response.data);
        setRandomizeEnableDisabled(!response.data?.randomizeEnable);
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo obtener los participantes","error");
      console.log(error);
    }).then(function () {
      setLoading(false);
    })
  }

  useEffect(() => {
    listAllMesas();
    listAllParticipantes();
    listAllMuestras();
    listAllCategorias();
    obtainRandomizeEnable();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title="Mesas" footer={false} loading={loading} containerMaxWidth="xl">
      <DndProvider backend={HTML5Backend}>
        <Stack sx={{textAlign: "center"}} spacing={2}>
          <Box>
            <Button variant="outlined" onClick={()=>{mode==="participante"?setMode(""):setMode("participante")}} sx={{mx: 1, backgroundColor: orange[500], p:mode==="participante"?2:1}}>
              <FontAwesomeIcon icon={faUser}/><span style={{ marginLeft: 5 }}>Agregar Participantes</span>
            </Button>
            <Button variant="outlined" onClick={()=>{mode==="participanteSecundario"?setMode(""):setMode("participanteSecundario")}} sx={{mx: 1, backgroundColor: indigo[300], p:mode==="participanteSecundario"?2:1}}>
              <FontAwesomeIcon icon={faUser}/><span style={{ marginLeft: 5 }}>Agregar Participantes Sec.</span>
            </Button>
            <Button variant="outlined" onClick={()=>{mode==="muestra"?setMode(""):setMode("muestra")}} sx={{mx: 1, backgroundColor: green[500], p:mode==="muestra"?2:1}}>
              <FontAwesomeIcon icon={faCannabis}/><span style={{ marginLeft: 5 }}>Agregar Muestras</span>
            </Button>
            <Button variant="outlined" onClick={()=>{mode==="categoria"?setMode(""):setMode("categoria")}} sx={{mx: 1, backgroundColor: yellow[500], p:mode==="categoria"?2:1}}>
              <FontAwesomeIcon icon={faTag}/><span style={{ marginLeft: 5 }}>Agregar Categoría</span>
            </Button>
            <Button variant="outlined" disabled={randomizeEnableDisabled} onClick={()=>{handoutParticipantes();}} sx={{mx: 1, backgroundColor: blue[300], p:1}}>
              <FontAwesomeIcon icon={faDice}/><span style={{ marginLeft: 5 }}>Repartir Muestras y Participantes</span>
            </Button>
            
            <ButtonModal onClick={()=>setMesaName("")} sx={{mx: 1}} faIcon={faPlus} textButton="Crear Mesa" operation={()=>{createMesa()}}>
              <Box>
                <Divider sx={{pb:2}}>Nueva mesa</Divider>
                <TextField fullWidth id="name-input" label="Nombre" variant="outlined" value={mesaName} onChange={(e)=>setMesaName(e?.target?.value)} />
              </Box>
            </ButtonModal>
          </Box>
          {mode==="participante"&&
            <>
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={"Buscar Participante - ("+participantes?.filter(participante => !isParticipanteExistInMesas(participante.id)).length+" Restantes)"}
                  inputProps={{ 'aria-label': 'Buscar Participante'}}
                  value={searchFieldParticipante}
                  onChange={(e)=>setSearchFieldParticipante(e.target.value)}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                  <Search />
                </IconButton>
              </Paper>
              <Grid container spacing={1} sx={{paddingTop: "0", marginTop: 0, width: "100%", maxHeight: '250px', overflowY:'auto'}}>
                {participantes?.filter(participante => (parseInt(participante.id)===(!isNaN(searchFieldParticipante)?parseInt(searchFieldParticipante):0) || participante.name?.toLowerCase().includes(searchFieldParticipante?.toLowerCase()) || participante.muestras.find(e=>e.categoria?.name?.toLowerCase().includes(searchFieldParticipante?.toLowerCase()))) && !isParticipanteExistInMesas(participante.id)).map((participante)=>{
                  return(<Grid item xs={6} md={12} key={"participante"+participante.id}>
                    <DraggableBox data={{muestras: participante.muestras}} onUpdate={()=>listAllMesas()} name={"participante-"+participante.id} sx={{display: "flex", alignItems:"center", justifyContent: "start", backgroundColor: orange[500], borderRadius: 1, margin: 1, width:"100%", m:0, overflow: "hidden"}}>
                      <Box sx={{display: "flex", alignItems:"center", justifyContent: "start", width: "100%", m:0}}>
                        <FontAwesomeIcon icon={faUser} style={{paddingLeft: 10}}/>
                        <Chip size="small" label={"#"+participante.n} sx={{margin: 1, fontSize: ".8rem", fontWeight: "bold", backgroundColor: orange[200]}}/>
                        <Typography>{participante.name}</Typography>
                        {participante.muestras?.map((muestra)=>
                          <Chip
                            key={muestra.hash}
                            component="span"
                            sx={{pl: "5px", mr: 1, mb: 1, backgroundColor: green[200], fontWeight: "bold", height: "auto", p: "3px", mt: 1, mx: 1}}
                            icon={<FontAwesomeIcon icon={faCannabis} style={{color: "black"}}/>}
                            label={
                            <Box sx={{display: "flex", flexDirection: matches?"row":"column", alignItems: "center", m:0, p:0, fontSize:".5rem!important"}}>
                              <Chip size="small" label={"#"+muestra.n} sx={{mx: 0, backgroundColor: green[400]}}/>
                              <Typography title={muestra.name+(muestra.description?(" ("+muestra.description+")"):"")} sx={{fontSize:".8rem!important", fontWeight: "bold", maxWidth:"50px", overflow: "hidden", textOverflow: "ellipsis", px: "5px"}}>{muestra.name+(muestra.description?(" ("+muestra.description+")"):"")}</Typography>
                              <Chip size="small" label={muestra.categoria?.name} sx={{mx: 0, backgroundColor: CategoriaColors[muestra.categoria.id-1], fontWeight: "bold", color:"white"}}/>
                            </Box>
                          } />
                        )}
                      </Box>
                    </DraggableBox>
                  </Grid>)
                })}
              </Grid>
            </>
          }
          {mode==="participanteSecundario"&&
            <>
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={"Buscar Participante Sec. - ("+participantes?.filter(participante => !isParticipanteSecExistInMesas(participante.id)).length+" Restantes)"}
                  inputProps={{ 'aria-label': 'Buscar Participante Sec.'}}
                  value={searchFieldParticipante}
                  onChange={(e)=>setSearchFieldParticipante(e.target.value)}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                  <Search />
                </IconButton>
              </Paper>
              <Grid container spacing={1} sx={{paddingTop: "0", marginTop: 0, width: "100%", maxHeight: '250px', overflow:'auto'}}>
                {participantes?.filter(participante => (parseInt(participante.id)===(!isNaN(searchFieldParticipante)?parseInt(searchFieldParticipante):0) || participante.name?.toLowerCase().includes(searchFieldParticipante?.toLowerCase()) || participante.muestras.find(e=>e.categoria?.name?.toLowerCase().includes(searchFieldParticipante?.toLowerCase()))) && !isParticipanteSecExistInMesas(participante.id)).map((participante)=>{
                  return(<Grid item xs={6} md={12} key={"participante"+participante.id}>
                    <DraggableBox data={{muestras: participante.muestras}} onUpdate={()=>listAllMesas()} name={"participanteSecundario-"+participante.id} sx={{display: "flex", alignItems:"center", justifyContent: "start", backgroundColor: indigo[300], borderRadius: 1, margin: 1, width:"100%", m:0, overflow: "hidden"}}>
                      <Box sx={{display: "flex", alignItems:"center", justifyContent: "start", width: "100%", m:0}}>
                        <FontAwesomeIcon icon={faUser} style={{paddingLeft: 10}}/>
                        <Chip size="small" label={"#"+participante.n} sx={{margin: 1, fontSize: ".8rem", fontWeight: "bold", backgroundColor: indigo[200]}}/>
                        <Typography>{participante.name}</Typography>
                        {participante.muestras?.map((muestra)=>
                          <Chip
                            key={muestra.hash}
                            component="span"
                            sx={{pl: "5px", mr: 1, mb: 1, backgroundColor: green[200], fontWeight: "bold", height: "auto", p: "3px", mt: 1, mx: 1}}
                            icon={<FontAwesomeIcon icon={faCannabis} style={{color: "black"}}/>}
                            label={
                            <Box sx={{display: "flex", flexDirection: matches?"row":"column", alignItems: "center", m:0, p:0, fontSize:".5rem!important"}}>
                              <Chip size="small" label={"#"+muestra.n} sx={{mx: 0, backgroundColor: green[400]}}/>
                              <Typography title={muestra.name+(muestra.description?(" ("+muestra.description+")"):"")} sx={{fontSize:".8rem!important", fontWeight: "bold", maxWidth:"50px", overflow: "hidden", textOverflow: "ellipsis", px: "5px"}}>{muestra.name+(muestra.description?(" ("+muestra.description+")"):"")}</Typography>
                              <Chip size="small" label={muestra.categoria?.name} sx={{mx: 0, backgroundColor: CategoriaColors[muestra.categoria.id-1], fontWeight: "bold", color:"white"}}/>
                            </Box>
                          } />
                        )}
                      </Box>
                    </DraggableBox>
                  </Grid>)
                })}
              </Grid>
            </>
          }
          {mode==="muestra"&&
            <>
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Buscar Muestra"
                  inputProps={{ 'aria-label': 'Buscar Muestra' }}
                  value={searchFieldMuestra}
                  onChange={(e)=>setSearchFieldMuestra(e.target.value)}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                  <Search />
                </IconButton>
              </Paper>
              <Grid container spacing={1} sx={{paddingTop: "0", marginTop: 0, width: "100%", maxHeight: '250px', overflow:'auto'}}>
                {muestras?.filter(muestra => parseInt(muestra.id)===(!isNaN(searchFieldMuestra)?parseInt(searchFieldMuestra):0) || muestra.name?.toLowerCase().includes(searchFieldMuestra?.toLowerCase())).map((muestra)=>{
                  return(<Grid item xs={6} md={12} key={"muestras"+muestra.id}>
                    <DraggableBox onUpdate={()=>listAllMesas()} name={"muestra-"+muestra.id} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: green[500], borderRadius: 1, margin: 1, m: 0}}>
                      <Box sx={{display: "flex", alignItems:"center", justifyContent: "start"}}>
                        <FontAwesomeIcon icon={faCannabis} style={{paddingLeft: 10}}/>
                        <Chip size="small" label={"#"+muestra.n} sx={{margin: 1, fontSize: ".8rem", fontWeight: "bold", backgroundColor: green[200]}}/>
                        <Typography>{muestra.name}</Typography>
                        <Chip size="small" label={muestra.categoria?.name} sx={{ml: 1, backgroundColor: CategoriaColors[muestra.categoria?.id], fontWeight: "bold"}}/>
                        {isMuestraExistInMesas(muestra.id)&&
                          <FontAwesomeIcon icon={faExclamationCircle} style={{paddingLeft: 10, color: red[700]}}/>
                        }
                        <Box title={muestra?.participante?.name} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: orange[200], borderRadius: 1, p: 0, ml: 1, fontSize: "100%"}}>
                          <Box sx={{display: "flex", alignItems:"center", justifyContent: "start", p: "2px"}}>
                            <FontAwesomeIcon icon={faUser} style={{paddingLeft: 5}}/>
                            <Typography sx={{mx: 1, fontSize: "90%", fontWeight: "bold"}}>{"#"+muestra?.participante?.n}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </DraggableBox>
                  </Grid>)
                })}
              </Grid>
            </>
          }
          {mode==="categoria"&&
            <>
              <Grid container spacing={1} sx={{paddingTop: "0", marginTop: 0, width: "100%", maxHeight: '250px', overflow:'auto'}}>
                {categorias?.map((categoria)=>{
                  return(<Grid item xs={6} md={12} key={"categoria-"+categoria.id}>
                    <DraggableBox data={categoria} onUpdate={()=>listAllMesas()} name={"categoria-"+categoria.id} sx={{width:"fit-content",display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: CategoriaColors[categoria.id], borderRadius: 1, margin: 1, m: 0}}>
                      <Box sx={{display: "flex", alignItems:"center", justifyContent: "start"}}>
                        <FontAwesomeIcon icon={faTag} style={{paddingLeft: 10, paddingRight: 10}}/>
                        <Typography sx={{pr:2}}>{categoria.name}</Typography>
                      </Box>
                    </DraggableBox>
                  </Grid>)
                })}
              </Grid>
            </>
          }
          <Grid container>
            {mesas.sort(function(a, b) {
              return naturalSorter(a.name, b.name);
            }).map((mesa)=>{
              return(<Grid key={"mesa"+mesa.id} item xs={12} sm={3} sx={{padding: 1}}>
                <DropBox name={"mesa-"+mesa.id} displayName={mesa.name} data={{participantes: mesa.participantes, participantesSecundarios: mesa.participantesSecundarios, muestras: mesa.muestras, categorias: mesa.categorias}} sx={{minHeight: "250pt", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                    <Box sx={{pr: 4, pl: 4}}>
                      {mesa.categorias.map((categoria)=>
                        <Box key={"mesa"+mesa.id+"categoria"+categoria.id} sx={{width:"fit-content", display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: CategoriaColors[categoria.id], borderRadius: 1, margin: 1}}>
                          <Box sx={{display: "flex", alignItems:"center", justifyContent: "start", whiteSpace: "nowrap", overflow: "hidden"}}>
                            <FontAwesomeIcon icon={faTag} style={{paddingLeft: 10, paddingRight: 10}}/>
                            <Typography sx={{pr:2}}>{categoria.name}</Typography>
                          </Box>
                          <IconButton sx={{justifySelf:"end"}} onClick={()=>{deleteCategoriaOfMesa(categoria.id, mesa.id)}}>
                            <FontAwesomeIcon icon={faTrash} style={{fontSize: ".8rem"}}/>
                          </IconButton>
                        </Box>
                      )}
                      {mesa.participantes.map((participante)=>
                        <Box key={"mesa"+mesa.id+"participante"+participante.id} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: orange[500], borderRadius: 1, margin: 1}}>
                          <Box sx={{display: "flex", alignItems:"center", justifyContent: "start", whiteSpace: "nowrap", overflow: "hidden"}}>
                            <FontAwesomeIcon icon={faUser} style={{paddingLeft: 10}}/>
                            <Chip size="small" label={"#"+participante.n} sx={{margin: "2px 8px", p:"0px", fontSize: ".8rem", fontWeight: "bold", backgroundColor: orange[200]}}/>
                            <Typography sx={{overflow: "hidden", textOverflow: "ellipsis"}}>{participante.name}</Typography>
                          </Box>
                          <IconButton sx={{justifySelf:"end"}} onClick={()=>{deleteParticipanteOfMesa(participante.id, mesa.id)}}>
                            <FontAwesomeIcon icon={faTrash} style={{fontSize: ".8rem"}}/>
                          </IconButton>
                        </Box>
                      )}
                      {mesa.participantesSecundarios.map((participante)=>
                        <Box key={"mesa"+mesa.id+"participante"+participante.id} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: indigo[300], borderRadius: 1, margin: 1}}>
                          <Box sx={{display: "flex", alignItems:"center", justifyContent: "start", whiteSpace: "nowrap", overflow: "hidden"}}>
                            <FontAwesomeIcon icon={faUser} style={{paddingLeft: 10}}/>
                            <Chip size="small" label={"#"+participante.n} sx={{margin: "2px 8px", p:"0px", fontSize: ".8rem", fontWeight: "bold", backgroundColor: indigo[200]}}/>
                            <Typography sx={{overflow: "hidden", textOverflow: "ellipsis"}}>{participante.name}</Typography>
                          </Box>
                          <IconButton sx={{justifySelf:"end"}} onClick={()=>{deleteParticipanteSecOfMesa(participante.id, mesa.id)}}>
                            <FontAwesomeIcon icon={faTrash} style={{fontSize: ".8rem"}}/>
                          </IconButton>
                        </Box>
                      )}
                      {mesa.muestras.map((muestra)=>
                        <Box key={"mesa"+mesa.id+"muestra"+muestra.id} sx={{display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: green[500], borderRadius: 1, margin: 1}}>
                          <Box sx={{display: "flex", alignItems:"center", justifyContent: "start", whiteSpace: "nowrap", overflow: "hidden"}}>
                            <FontAwesomeIcon icon={faCannabis} style={{paddingLeft: 10}}/>
                            <Chip size="small" label={"#"+muestra.n} sx={{margin: "2px 8px", p:"0px", fontSize: ".8rem", fontWeight: "bold", backgroundColor: green[200]}}/>
                            <Typography sx={{overflow: "hidden", textOverflow: "ellipsis"}}>{muestra.name}</Typography>
                            <Chip size="small" label={muestra.categoria?.name} sx={{ml: 1, p:"0px", backgroundColor: CategoriaColors[muestra.categoria?.id], fontWeight: "bold"}}/>
                            {muestraCountInMesas(muestra.id)>1&&
                              <FontAwesomeIcon icon={faExclamationCircle} style={{paddingLeft: 10, color: red[700]}}/>
                            }
                          </Box>
                          <IconButton sx={{justifySelf:"end"}} onClick={()=>{deleteMuestraOfMesa(muestra.id, mesa.id)}}>
                            <FontAwesomeIcon icon={faTrash} style={{fontSize: ".8rem"}}/>
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{display: "flex", alignItems:"center", justifyContent: "space-between", p: 1}}>
                      <ButtonModal onClick={()=>setMesaName(mesa.name)} faIcon={faEdit} operation={()=>{updateMesa(mesa.id)}}>
                        <Box>
                          <Divider sx={{pb:2}}>Editar mesa</Divider>
                          <TextField fullWidth id="name-input" label="Nombre" variant="outlined" value={mesaName} onChange={(e)=>setMesaName(e?.target?.value)} />
                        </Box>
                      </ButtonModal>
                      <ConfirmModal faIcon={faTrash} buttonColor="error" message="Esta seguro que desea eliminar la mesa?" operation={()=>{deleteMesa(mesa.id)}}/>
                    </Box>
                </DropBox>
              </Grid>)
            })}
          </Grid>
        </Stack>
      </DndProvider>
    </Page>
  );
}
