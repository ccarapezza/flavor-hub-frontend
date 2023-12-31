
import { Avatar, Button, Chip, Divider, FormControlLabel, IconButton, InputLabel, LinearProgress, List, ListItem, ListItemAvatar, Paper, Rating, Stack, Switch, Typography, useMediaQuery} from "@mui/material";
import { Box } from "@mui/material";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import Page from "../Page";
import { faCannabis, faClock, faEye, faEyeSlash, faFileAlt, faGavel, faSortAmountDown, faSortAmountUp, faStoreAlt, faSync, faTable, faUser, faUserAlt, faVihara } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deepOrange, green, indigo } from '@mui/material/colors';
import SelectCategoria from "../../components/SelectCategoria";
import CategoriaColors from "../../colors/CategoriaColors";
import { deepPurple, lightGreen } from "@mui/material/colors";
import { useTheme } from "@emotion/react";
import EnhancedTable from "../../components/EnhancedTable";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

export default function Resultados() {
  const [loading, setLoading] = useState(false); 

  const [muestraSelected, setMuestraSelected] = useState(null); 
  const [showDetailSelected, setShowDetailSelected] = useState(false); 

  const [calificaciones, setCalificaciones] = useState([]);

  const [resultados, setResultados] = useState([]);
  const [resultadoProcessed, setResultadoProcessed] = useState([]);
  const [resultadoGrouped, setResultadoGrouped] = useState([]);
  const [muestraCategoriaFilter, setMuestraCategoriaFilter] = useState("")
  const matches = useMediaQuery(useTheme().breakpoints.up('sm'));
  //Custom Table End

  const [showDetails, setShowDetails] = useState([]);
  const [orderValue, setOrderValue] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [dojoFilter, setDojoFilter] = useState(false);
  const [growFilter, setGrowFilter] = useState(false);
  const [juradoFilter, setJuradoFilter] = useState(false);
  const [participanteFilter, setParticipanteFilter] = useState(false);  

  const [labels, setLabels] = useState([]);

  const getProgressColor = (value) => {
    //value from 0 to 1
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,45%)"].join("");
  }

  useEffect(() => {
    setLoading(true);
    axios.get("/api/calificaciones/resultados")
      .then(function (response) {
        // handle success
        if(response.status === 200){
          setCalificaciones(response.data?.calificaciones);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function(){
        setLoading(false);
      })
  }, []);

  const reloadResultados = ()=>{
    setLoading(true);
    axios.get("/api/calificaciones/resultados")
      .then(function (response) {
        // handle success
        if(response.status === 200){
          setCalificaciones(response.data?.calificaciones);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function(){
        setLoading(false);
      })
  }

  useEffect(() => {
    setMuestraSelected(null);
    setResultados(calificaciones
      .filter((calificacion)=>{
        if(juradoFilter){
          return calificacion.participante.esJurado;
        }else if(participanteFilter){
          return !calificacion.participante.esJurado;
        }else{
          return true;
        }
      })
      .reduce(function(m, d){
        if(!m[d.muestraId]){
          m[d.muestraId] = {
            muestraId: d.muestraId,
            muestra: d.muestra,
            valores: d.valores,
            count: 1,
            calificaciones: []
          };
          m[d.muestraId].calificaciones.push(d);
          return m;
        }

        m[d.muestraId].valores = m[d.muestraId].valores.map((currentValor, index)=>{
          return {
            ...currentValor,
            valor: currentValor.valor + d.valores[index].valor
          };
        })
        m[d.muestraId].count += 1;
        m[d.muestraId].calificaciones.push(d);
        return m;
    },{}));
  }, [calificaciones, juradoFilter, participanteFilter])

  useEffect(() => {
    setMuestraSelected(null);
    const resultadoSortAndFilter = Object.keys(resultados).map((k)=>resultados[k])
      .map((e)=>{
        return({
        ...e,
        promedioTotal: (e.valores.reduce((previousValue, currentValue)=>previousValue+currentValue.valor, 0) / e.valores.length)
      })})
      .map((calificacion)=>{
        return({
          ...calificacion,
          valores: calificacion.valores.map((currentValor)=>{
            return({
              ...currentValor,
              valor: Math.round(currentValor.valor/calificacion.count * 10) / 10
            })
          }),
          promedioTotal: Math.round(calificacion.promedioTotal/calificacion.count * 10) / 10
        })
      })
      .filter((resultado)=>{
        if(resultado.muestra?.categoria && muestraCategoriaFilter){
          return parseInt(resultado.muestra.categoria.id) === muestraCategoriaFilter
        }else{
          return resultado;
        }
      })
      .sort(function(a, b) {
        let aValue = null;
        let bValue = null;

        if(orderValue==="promedioTotal"){
          aValue = a.promedioTotal;
          bValue = b.promedioTotal;
        }else if(orderValue){
          aValue = a.valores.find((valor)=>camelize(valor.label)===orderValue).valor;
          bValue = b.valores.find((valor)=>camelize(valor.label)===orderValue).valor;
        }
        if (aValue > bValue) {
          return sortOrder?1:-1;
        }
        if (aValue < bValue) {
          return sortOrder?-1:1;
        }
        return 0;
      });
      setResultadoProcessed(resultadoSortAndFilter);
  }, [dojoFilter, growFilter, muestraCategoriaFilter, orderValue, resultados, sortOrder])

  useEffect(() => {
    setMuestraSelected(null);
    let resultadoGroupedList;
    if(resultadoProcessed.length>0){
      resultadoGroupedList = resultadoProcessed.filter((resultado)=>{
        if(dojoFilter){
          return resultado.muestra?.participante?.dojo?true:false;
        } else if(growFilter){
          return resultado.muestra?.participante?.grow?true:false;
        } else {
          return false;
        }
      });
      if(dojoFilter){
        resultadoGroupedList = resultadoGroupedList.reduce(function(dojos, muestraDojo){
          if(!dojos[muestraDojo?.muestra?.participante?.dojo?.id]){
            dojos[muestraDojo?.muestra?.participante?.dojo?.id] = {
              dojo: muestraDojo?.muestra?.participante?.dojo,
              valores: [],
              promedioTotal: muestraDojo.promedioTotal,
              count: 1,
              muestras: []
            };
            dojos[muestraDojo?.muestra?.participante?.dojo?.id].muestras.push(muestraDojo);
            return dojos;
          }
          dojos[muestraDojo?.muestra?.participante?.dojo?.id].promedioTotal += muestraDojo.promedioTotal;
          dojos[muestraDojo?.muestra?.participante?.dojo?.id].count += 1;
          dojos[muestraDojo?.muestra?.participante?.dojo?.id].muestras.push(muestraDojo);
          return dojos;
        },[])
      }
  
      if(growFilter){
        resultadoGroupedList = resultadoGroupedList.reduce(function(grows, muestraGrow){
          const findedGrow = grows.findIndex(g=>muestraGrow?.muestra?.participante?.grow===g?.grow);
          if(findedGrow<0){
            let newGrow  = {
              grow: muestraGrow.muestra?.participante?.grow,
              promedioTotal: muestraGrow.promedioTotal,
              count: 1,
              muestras: []
            };
            newGrow.muestras.push(muestraGrow);
            grows.push(newGrow);
          }else{
            grows[findedGrow].promedioTotal += muestraGrow.promedioTotal;
            grows[findedGrow].count += 1;
            grows[findedGrow].muestras.push(muestraGrow);
          }
          return grows;
        },[])
      }
  
      if(dojoFilter||growFilter){
        setResultadoGrouped(resultadoGroupedList.map((calificacion)=>{
          return({
            ...calificacion,
            valores: [],
            promedioTotal: Math.round(calificacion.promedioTotal/calificacion.count * 10) / 10
          })
        })
        .sort(function(a, b) {
          const aValue = a.promedioTotal;
          const bValue = b.promedioTotal;
          if (aValue > bValue) {
            return sortOrder?1:-1;
          }
          if (aValue < bValue) {
            return sortOrder?-1:1;
          }
          return 0;
        }));
      }else{
        setResultadoGrouped([]);
      }
    }
  }, [dojoFilter, growFilter, resultadoProcessed, sortOrder]);

  /*
  useEffect(() => {
    loadResultados();
  }, [loadResultados]);
  */

  const camelize = (str)=> {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }));

  const [mode, setMode] = useState("tabla");

  return (
    <Page containerMaxWidth={false} title="Resultados" footer={false} loading={loading}>
        <Divider sx={{m: 0}}>Modo:</Divider>
        <Stack sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", flexWrap: "wrap", margin: 0}} direction="row" spacing={1}>
          <Button color="secondary" sx={{margin: "5px!important", alignItems: "end"}} variant={mode==="tabla"?"contained":"outlined"} size="small" onClick={()=>{setMode("tabla")}}>
            <FontAwesomeIcon icon={faTable} style={{margin: 5}}/>
            <small style={{marginRight: 5}}>Tabla</small>
          </Button>
          <Button color="secondary" sx={{margin: "5px!important", alignItems: "end"}} variant={mode==="tarjetas"?"contained":"outlined"} size="small" onClick={()=>{setMode("tarjetas")}}>
            <FontAwesomeIcon icon={faFileAlt} style={{margin: 5}}/>
            <small style={{marginRight: 5}}>Tarjetas</small>
          </Button>
        </Stack>
        {mode==="tarjetas"&&
          <>
            <Divider sx={{m: 0}}>Ordenar por:</Divider>
            <Stack sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", flexWrap: "wrap", margin: 0}} direction="row" spacing={1}>
              {labels.map((label, index)=>{
                const lbl = camelize(label);
                return(<Button key={"label-order-"+index} color="secondary" sx={{margin: "5px!important"}} variant={orderValue===lbl?"contained":"outlined"} size="small" onClick={()=>{setOrderValue(lbl); setSortOrder(sortOrder?0:1)}}>
                  {orderValue===label&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
                  <small>{label}</small>
                </Button>);
              })}
              <Button color="secondary" sx={{margin: "5px!important"}} variant={orderValue==="promedioTotal"?"contained":"outlined"} size="small" onClick={()=>{setOrderValue("promedioTotal"); setSortOrder(sortOrder?0:1)}}>
                {orderValue==="promedioTotal"&&<FontAwesomeIcon icon={sortOrder?faSortAmountUp: faSortAmountDown} style={{margin: 5}}/>}
                <small>Promedio Total</small>
              </Button>
            </Stack>
          </>
        }
        <Divider>Filtrar por:</Divider>
          <Box sx={{display:"flex", flexDirection:matches?"row":"column"}}>
            <SelectCategoria sx={{flexGrow: 1, whiteSpace:"nowrap", width: "auto", mt:0, mb:1}} blankLabel="Todas" value={muestraCategoriaFilter} onChange={(e)=>{setMuestraCategoriaFilter(e?.target?.value); setOrderValue("");}} setLabels={setLabels}/>
            <FormControlLabel sx={{flexGrow: 1, whiteSpace:"nowrap", mx:1, textAlign: "center", display: "inline", alignSelf: "center"}} control={<Switch checked={dojoFilter} onChange={(e)=>{setDojoFilter(e.target.checked); setGrowFilter(e.target.checked?false:growFilter);}} />} label={<><FontAwesomeIcon icon={faVihara}/>Categoria Dojos</>}/>
            <FormControlLabel sx={{flexGrow: 1, whiteSpace:"nowrap", mx:1, textAlign: "center", display: "inline", alignSelf: "center"}} control={<Switch checked={growFilter} onChange={(e)=>{setGrowFilter(e.target.checked); setDojoFilter(e.target.checked?false:dojoFilter);}} />} label={<><span className="fa-layers fa-fw" style={{color: "black", marginLeft:10}}><FontAwesomeIcon icon={faCannabis} transform="shrink-4 up-8"/><FontAwesomeIcon icon={faStoreAlt} transform="shrink-3 down-5"/></span>Categoria Grows</>}/>           
          </Box>
        <Divider/>
          <Box sx={{display:"flex", flexDirection:matches?"row":"column"}}>
            <FormControlLabel sx={{flexGrow: 1, whiteSpace:"nowrap", mx:1, textAlign: "center", display: "inline", alignSelf: "center"}} control={<Switch checked={juradoFilter} onChange={(e)=>{setJuradoFilter(e.target.checked); setParticipanteFilter(e.target.checked?false:participanteFilter);}} />} label={<><FontAwesomeIcon icon={faGavel}/>Solo Jurados</>}/>
            <FormControlLabel sx={{flexGrow: 1, whiteSpace:"nowrap", mx:1, textAlign: "center", display: "inline", alignSelf: "center"}} control={<Switch checked={participanteFilter} onChange={(e)=>{setParticipanteFilter(e.target.checked); setJuradoFilter(e.target.checked?false:juradoFilter);}} />} label={<><FontAwesomeIcon icon={faUser}/>Solo Participantes</>}/>
          </Box>
        <Divider/>
        <Stack sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", margin: 1}} direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={()=>{reloadResultados()}}>
            <FontAwesomeIcon icon={faSync} style={{marginRight: 15}} />
            <Typography variant="h10">Refrescar</Typography>
          </Button>
        </Stack>
        <Divider/>
        {muestraSelected&&

          <List sx={{paddingTop: 0, marginTop: 0}}>
            <ListItem className="scroll-flex-fix" sx={{display:"flex", alignItems:"center", overflowX: "auto"}}>
                
              <ListItemAvatar sx={{display:"flex", flexDirection:"column", alignItems:"center", margin: 2}}>
                <Avatar sx={{ width: 74, height: 74, bgcolor: green[500] }}>
                  <Stack sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                    <FontAwesomeIcon icon={faCannabis}/>
                    <h2 style={{padding:0, margin: 0}}>{"#"+muestraSelected?.muestra?.n}</h2>
                  </Stack>
                </Avatar>
                <h3 style={{padding:0, margin: 0}}>{muestraSelected?.muestra?.name}</h3>
                <Chip size="small" label={muestraSelected?.muestra.categoria?.name} sx={{backgroundColor: CategoriaColors[muestraSelected?.muestra.categoria.id], fontWeight: "bold"}}/>
                <Paper variant="outlined" sx={{display:"flex", flexDirection:"column", alignItems:"center", padding: 1, marginTop: 2, bgcolor: deepOrange[500]}}>
                  <h6 style={{padding:0, margin:0}}><FontAwesomeIcon icon={faUserAlt} style={{marginRight: 5}}/>Participante</h6>
                  <Typography variant="h6" component="div" className="max-150" sx={{whiteSpace: "nowrap"}}>{"#"+muestraSelected?.muestra?.participante?.n+" - "+muestraSelected?.muestra?.participante?.name}</Typography>
                  {muestraSelected?.muestra?.participante?.dojo&&
                    <Chip icon={<FontAwesomeIcon icon={faVihara} style={{color: "white"}}/>} size="small" label={muestraSelected?.muestra?.participante?.dojo?.name} sx={{backgroundColor: deepPurple[400], color: "white"}}/>
                  }
                  {muestraSelected?.muestra?.participante?.grow&&
                    <Chip title="Es Grow" icon={
                      <span className="fa-layers fa-fw" style={{color: "black", marginLeft:10}}>
                        <FontAwesomeIcon icon={faCannabis} transform="shrink-4 up-8"/>
                        <FontAwesomeIcon icon={faStoreAlt} transform="shrink-3 down-5"/>
                      </span>
                    }
                    sx={{backgroundColor: lightGreen[400], fontWeight: "bold"}}
                    label={muestraSelected?.muestra?.participante?.grow}
                    />
                  }
                </Paper>
                <Button variant="outlined" sx={{my: 1}} onClick={()=>setMuestraSelected(null)}>
                  Ocultar
                  <FontAwesomeIcon icon={faEyeSlash} style={{marginLeft: 5}}/>
                </Button>
              </ListItemAvatar>
              <Paper sx={{padding:"5px", marginRight: 2}} elevation={4}>
                <Divider sx={{pb:"5px"}}><Chip color="success" label={"PROMEDIO"}/></Divider>
                {muestraSelected.valores.map((currentValor, index)=>{
                  const idInput = "valores-"+index+"-input"
                  return(<Fragment key={"valores-value"+index}>
                      <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                      <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                      <Divider/>
                    </Fragment>)
                })}
                <InputLabel htmlFor={"promedio-total-input-"+muestraSelected.id}><strong>Promedio Total: {muestraSelected.promedioTotal}</strong></InputLabel>
                  <Rating name={"promedio-total-input-"+muestraSelected.id} value={muestraSelected.promedioTotal} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                <Divider sx={{marginBottom: "5px"}}/>
                <Box sx={{display:"flex", justifyContent: "space-between"}}>
                  <InputLabel>Calificaciones: <strong>{muestraSelected.count}</strong></InputLabel>
                  {showDetailSelected?
                    <Button size="small" variant="outlined" onClick={()=>{
                      setShowDetailSelected(false);
                    }}>
                      <FontAwesomeIcon icon={faEyeSlash} />
                    </Button>
                  :
                    <Button size="small" variant="outlined" onClick={()=>{
                      setShowDetailSelected(true);
                    }}>
                      <FontAwesomeIcon icon={faEye}/>
                    </Button>
                  }
                </Box>
              </Paper>
              
              {showDetailSelected&&muestraSelected.calificaciones?.sort((a, b) => a.participante?.n>b.participante?.n).map((calificacion)=>{
                const updatedAt = new Date(Date.parse(calificacion.updatedAt));
                return(<Paper sx={{padding:"5px", mr: 1}} elevation={4} key={"calificacion-"+calificacion.id}>
                    <Divider sx={{pb:"5px"}}><Chip sx={{textOverflow: "ellipsis"}} color="secondary" label={`#${calificacion.participante?.n} - ${calificacion.participante?.name}`}/></Divider>
                    {calificacion.valores.map((currentValor, index)=>{
                      const idInput = "valores-details-"+index+"-input";
                      return(<Fragment key={"valores-details-value"+index}>
                          <InputLabel htmlFor={idInput}><span>{currentValor.label}!: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                          <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                          <Divider/>
                        </Fragment>)
                    })}
                    <InputLabel htmlFor={"promedio-total-input-"+calificacion.id}><strong>Promedio Total: {calificacion.valores.reduce((previousValue, currentValue)=>previousValue+currentValue.valor, 0) / calificacion.valores.length}</strong></InputLabel>
                    <Rating name={"promedio-total-input-"+calificacion.id} value={calificacion.valores.reduce((previousValue, currentValue)=>previousValue+currentValue.valor, 0) / calificacion.valores.length} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                    <Divider sx={{marginBottom: "5px"}}/>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      <Chip size="small" variant="outlined" label={calificacion.participante.mesa?.name?calificacion.participante.mesa?.name:"SIN MESA"} />
                      {calificacion.participante.esJurado&&
                        <Chip size="small" sx={{mx: 1, color: "white", backgroundColor: indigo[500]}}
                        label={<Box sx={{display: "flex", alignItems: "center"}}>
                          <FontAwesomeIcon icon={faGavel} style={{marginRight: 5, fontSize: "0.6rem"}}/>
                          <Typography sx={{fontSize: "0.6rem"}}>Jurado</Typography>
                        </Box>}
                        />
                      }
                      <div><FontAwesomeIcon icon={faClock} transform="shrink-6" style={{color: "grey"}}/><span style={{color: "grey"}}>{updatedAt.toLocaleTimeString().substr(0, updatedAt.toLocaleTimeString().lastIndexOf(":"))}</span></div>
                    </Box>
                  </Paper>)
              })}
            </ListItem>
            <Divider />
          </List>

        }
        <Divider/>
        {mode==="tabla"&&(dojoFilter||growFilter)&&
          <EnhancedTable
            selected={muestraSelected}
            rows={resultadoGrouped}
            headCells={[
              {
                id: growFilter?'grow':'dojo.name',
                align: "center",
                disablePadding: false,
                label: growFilter?'Grow':'Dojo',
                valueRenderer: (row) => {
                  return(growFilter?
                    <Chip
                      title="Es Grow"
                      icon={
                        <span className="fa-layers fa-fw" style={{color: "black", marginLeft:10}}>
                          <FontAwesomeIcon icon={faCannabis} transform="shrink-4 up-8"/>
                          <FontAwesomeIcon icon={faStoreAlt} transform="shrink-3 down-5"/>
                        </span>
                      }
                      sx={{backgroundColor: lightGreen[400], fontWeight: "bold"}}
                      label={row.grow}
                    />
                    :
                    <Chip
                      title="Dojo" 
                      icon={<FontAwesomeIcon icon={faVihara} style={{color: "white", marginLeft:10}}/>}
                      sx={{backgroundColor: deepPurple[400], fontWeight: "bold", color: "white"}}
                      label={row.dojo?.name}
                    />
                  )
                }
              },
              {
                id: 'muestras.length',
                numeric: true,
                disablePadding: false,
                align: "center",
                label: 'Muestras',
                valueRenderer: (row) => {
                  
                  return(<>
                    <b>Cantidad: </b>{row.muestras.length}
                    {row.muestras.map((row)=>{return(
                      <p key={
                        growFilter?
                        "grow-"+row?.muestra?.participante?.grow+"-muestra-"+row?.muestra?.id
                        :
                        "dojo-"+row?.muestra?.participante?.dojo?.id+"-muestra-"+row?.muestra?.id
                      } style={{margin:0, marginBottom: "5px"}}>
                        <Chip
                          size="small"
                          label={<>
                            <FontAwesomeIcon color="white" icon={faCannabis} style={{}}/>
                            <b style={{padding:0, margin: 0}}>{"#"+row?.muestra?.n}</b>
                            <Typography variant="span" paddingX={1}>{row?.muestra?.name}</Typography>
                          </>}
                          sx={{backgroundColor: green[700], color: "white"}}/>
                      </p>
                    )})}
                  </>)
                }
              },
              {
                id: 'promedioTotal',
                numeric: true,
                disablePadding: false,
                align: "center",
                label: 'Promedio',
                valueRenderer: (row) => {
                  return(<div>
                    <Typography>{row?.promedioTotal}</Typography>
                    <Box fullWidth sx={{ color: getProgressColor(1-row.promedioTotal/10)}}>
                      <LinearProgress color='inherit' variant="determinate" value={row.promedioTotal/10*100} sx={{maxWidth: "50px!important", margin: "0 auto"}}/>
                    </Box>
                  </div>)
                }
              }
            ]}
          />
        }
        {mode==="tarjetas"&&resultadoGrouped.map((resultado)=>{
          return(<p key={growFilter ? "grow-"+resultado?.grow : "dojo-"+resultado?.dojo?.id}>
            <Paper sx={{padding:"5px", margin: 2}} elevation={4}>
                  {dojoFilter&&
                    <Divider sx={{pb:"5px"}}>
                      <Chip
                        component="div"
                        icon={<FontAwesomeIcon icon={faVihara} style={{color: "white"}}/>}
                        label={resultado?.dojo?.name}
                        sx={{backgroundColor: deepPurple[400], color: "white", fontWeight: "bold", fontSize:"1.2rem"}}
                      />
                    </Divider>
                  }
                  {growFilter&&
                    <Divider sx={{pb:"5px"}}>
                      <Chip
                        title="Es Grow"
                        icon={
                          <span className="fa-layers fa-fw" style={{color: "black", marginLeft:10}}>
                            <FontAwesomeIcon icon={faCannabis} transform="shrink-4 up-8"/>
                            <FontAwesomeIcon icon={faStoreAlt} transform="shrink-3 down-5"/>
                          </span>
                        }
                        sx={{backgroundColor: lightGreen[400], fontWeight: "bold"}}
                        label={resultado.grow}
                      />
                    </Divider>
                  }
                  <Divider sx={{pb:"5px"}}><Chip color="success" label={"PROMEDIO"}/></Divider>
                  {resultado.valores.map((currentValor, index)=>{
                    const idInput = "valores-grows-"+index+"-input"
                    return(<Fragment key={"res-val-grow-"+resultado.muestra?.participante?.grow+"-"+index}>
                        <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                        <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                        <Divider/>
                      </Fragment>)
                  })}
                  <InputLabel htmlFor={"promedio-total-grow-input-"+resultado.id}><strong>Promedio Total: {resultado.promedioTotal}</strong></InputLabel>
                    <Rating name={"promedio-total-grow-input-"+resultado.id} value={resultado.promedioTotal} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                  <Divider sx={{marginBottom: "5px"}}/>
                  <InputLabel>Muestras: <strong style={{paddingLeft:"5px"}}>{resultado.count}</strong></InputLabel>
                </Paper>
          </p>);
        })}
        <Divider/>
          {mode==="tabla"&&!dojoFilter&&!growFilter&&
            <EnhancedTable
              rows={resultadoProcessed}
              headCells={[
                {
                  id: 'muestraId',
                  align: "center",
                  disablePadding: false,
                  label: 'N#',
                  valueRenderer: (row) => {
                    return(
                      <>
                        <Stack sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                          <FontAwesomeIcon color={green[700]} icon={faCannabis}/>
                          <b style={{padding:0, margin: 0}}>{"#"+row?.muestra?.n}</b>
                        </Stack>
                      </>
                    )
                  }
                },
                {
                  id: 'muestra.name',
                  numeric: false,
                  disablePadding: true,
                  label: 'Muestra',
                  valueRenderer: (row) => {
                    return(<div>{row.muestra.name}</div>)
                  }
                },
                {
                  id: 'muestra.categoria.name',
                  numeric: false,
                  disablePadding: true,
                  label: 'Categoria',
                  valueRenderer: (row) => {
                    return(
                      <Chip size="small" label={row?.muestra.categoria?.name} sx={{backgroundColor: CategoriaColors[row?.muestra.categoria.id], fontWeight: "bold"}}/>
                    )
                  }
                },
                {
                  id: 'muestra.participante.id',
                  numeric: false,
                  disablePadding: true,
                  label: 'Participante',
                  valueRenderer: (row) => {
                    return(
                      <Chip size="small" label={"#"+row?.muestra?.participante?.n+" - "+row?.muestra?.participante?.name} sx={{bgcolor: deepOrange[500], fontWeight: "bold"}}/>
                    )
                  }
                },
                ...labels.map((currentLabel, index)=>{
                  return({
                    id: 'valores-'+index,
                    numeric: true,
                    disablePadding: false,
                    align: "center",
                    label: currentLabel,
                    valueRenderer: (row) => {
                      const currentValor = row.valores.find((currentValor)=>currentValor.label===currentLabel)
                      return(<Box fullWidth sx={{ color: getProgressColor(1-currentValor?.valor/10)}}>
                          <InputLabel><strong style={{paddingLeft:"5px"}}>{currentValor?.valor}</strong></InputLabel>
                          <LinearProgress color='inherit' variant="determinate" value={currentValor?.valor/10*100} sx={{maxWidth: "50px!important", margin: "0 auto"}}/>
                        </Box>)
                    }
                  })
                }),
                {
                  id: 'promedioTotal',
                  numeric: true,
                  disablePadding: false,
                  align: "center",
                  label: 'Promedio',
                  valueRenderer: (row) => {
                    return(<div>

                      <LightTooltip
                        title={
                          <Box>
                            <Divider sx={{pb:"5px"}}><Chip color="success" label={"PROMEDIO"}/></Divider>
                            {row.valores.map((currentValor, index)=>{
                              const idInput = "valores-"+index+"-input"
                              return(<Fragment key={"valores-value"+index}>
                                  <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                                  <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                                  <Divider/>
                                </Fragment>)
                            })}
                            <InputLabel htmlFor={"promedio-total-input-"+row.id}><strong>Promedio Total: {row.promedioTotal}</strong></InputLabel>
                              <Rating name={"promedio-total-input-"+row.id} value={row.promedioTotal} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                            <Divider sx={{marginBottom: "5px"}}/>
                            <Box sx={{display:"flex", justifyContent: "space-between"}}>
                              <InputLabel>Calificaciones: <strong>{row.count}</strong></InputLabel>
                            </Box>
                          </Box>
                        }
                      >
                        <Typography>{row?.promedioTotal}</Typography>
                      </LightTooltip>
                      <Box fullWidth sx={{ color: getProgressColor(1-row.promedioTotal/10)}}>
                        <LinearProgress color='inherit' variant="determinate" value={row.promedioTotal/10*100} sx={{maxWidth: "50px!important", margin: "0 auto"}}/>
                      </Box>
                    </div>)
                  }
                },
                {
                  id:null,
                  valueRenderer: (row) => {
                    return(
                      <Box sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                        <IconButton title={"Ver Detalles"} onClick={()=>{setMuestraSelected(row)}} size="small" sx={{color: green[500]}}>
                          <FontAwesomeIcon icon={faEye}/>
                        </IconButton>
                      </Box>
                    )
                  }
                }
              ]}/>
          }
        <List sx={{paddingTop: 0, marginTop: 0}}>
          {mode==="tarjetas"&&(!dojoFilter&&!growFilter)&&resultadoProcessed?.slice(0,9).map((resultado, index)=>{
              return(
                <div key={"muestra-res"+resultado.muestraId}>
                  <ListItem className="scroll-flex-fix" sx={{display:"flex", alignItems:"center", overflowX: "auto"}}>
                    
                  <ListItemAvatar sx={{display:"flex", flexDirection:"column", alignItems:"center", margin: 2}}>
                      <Avatar sx={{ width: 74, height: 74, bgcolor: green[500] }}>
                        <Stack sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                          <FontAwesomeIcon icon={faCannabis}/>
                          <h2 style={{padding:0, margin: 0}}>{"#"+resultado?.muestra?.n}</h2>
                        </Stack>
                      </Avatar>
                      <h3 style={{padding:0, margin: 0}}>{resultado?.muestra?.name}</h3>
                      <Chip size="small" label={resultado?.muestra.categoria?.name} sx={{backgroundColor: CategoriaColors[resultado?.muestra.categoria.id], fontWeight: "bold"}}/>
                      <Paper variant="outlined" sx={{display:"flex", flexDirection:"column", alignItems:"center", padding: 1, marginTop: 2, bgcolor: deepOrange[500]}}>
                        <h6 style={{padding:0, margin:0}}><FontAwesomeIcon icon={faUserAlt} style={{marginRight: 5}}/>Participante</h6>
                        <Typography variant="h6" component="div" className="max-150" sx={{whiteSpace: "nowrap"}}>{"#"+resultado?.muestra?.participante?.n+" - "+resultado?.muestra?.participante?.name}</Typography>
                        {resultado?.muestra?.participante?.dojo&&
                          <Chip icon={<FontAwesomeIcon icon={faVihara} style={{color: "white"}}/>} size="small" label={resultado?.muestra?.participante?.dojo?.name} sx={{backgroundColor: deepPurple[400], color: "white"}}/>
                        }
                        {resultado?.muestra?.participante?.grow&&
                          <Chip title="Es Grow" icon={
                            <span className="fa-layers fa-fw" style={{color: "black", marginLeft:10}}>
                              <FontAwesomeIcon icon={faCannabis} transform="shrink-4 up-8"/>
                              <FontAwesomeIcon icon={faStoreAlt} transform="shrink-3 down-5"/>
                            </span>
                          }
                          sx={{backgroundColor: lightGreen[400], fontWeight: "bold"}}
                          label={resultado?.muestra?.participante?.grow}
                          />
                        }
                      </Paper>
                    </ListItemAvatar>
                    <Paper sx={{padding:"5px", marginRight: 2}} elevation={4}>
                      <Divider sx={{pb:"5px"}}><Chip color="success" label={"PROMEDIO"}/></Divider>
                      {resultado.valores.map((currentValor, index)=>{
                        const idInput = "valores-"+index+"-input"
                        return(<Fragment key={"valores-value"+index}>
                            <InputLabel htmlFor={idInput}><span>{currentValor.label}: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                            <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                            <Divider/>
                          </Fragment>)
                      })}
                      <InputLabel htmlFor={"promedio-total-input-"+resultado.id}><strong>Promedio Total: {resultado.promedioTotal}</strong></InputLabel>
                        <Rating name={"promedio-total-input-"+resultado.id} value={resultado.promedioTotal} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                      <Divider sx={{marginBottom: "5px"}}/>
                      <Box sx={{display:"flex", justifyContent: "space-between"}}>
                        <InputLabel>Calificaciones: <strong>{resultado.count}</strong></InputLabel>
                        {showDetails.includes(index)?
                          <Button size="small" variant="outlined" onClick={()=>{
                            setShowDetails(showDetails.filter(function(value){ 
                              return value !== index;
                            }));
                            
                          }}>
                            <FontAwesomeIcon icon={faEyeSlash} />
                          </Button>
                        :
                          <Button size="small" variant="outlined" onClick={()=>{
                            setShowDetails(showDetails.concat(index));
                          }}>
                            <FontAwesomeIcon icon={faEye}/>
                          </Button>
                        }
                      </Box>
                    </Paper>
                    
                    {showDetails.includes(index)&&resultado.calificaciones?.sort((a, b) => a.participante?.n>b.participante?.n).map((calificacion)=>{
                      const updatedAt = new Date(Date.parse(calificacion.updatedAt));
                      return(<Paper sx={{padding:"5px", mr: 1}} elevation={4} key={"calificacion-"+calificacion.id}>
                          <Divider sx={{pb:"5px"}}><Chip sx={{textOverflow: "ellipsis"}} color="secondary" label={`#${calificacion.participante?.n} - ${calificacion.participante?.name}`}/></Divider>
                          {calificacion.valores.map((currentValor, index)=>{
                            const idInput = "valores-details-"+index+"-input";
                            return(<Fragment key={"valores-details-value"+index}>
                                <InputLabel htmlFor={idInput}><span>{currentValor.label}!: </span><strong style={{paddingLeft:"5px"}}>{currentValor.valor}</strong></InputLabel>
                                <Rating name={idInput} value={currentValor.valor} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                                <Divider/>
                              </Fragment>)
                          })}
                          <InputLabel htmlFor={"promedio-total-input-"+calificacion.id}><strong>Promedio Total: {calificacion.valores.reduce((previousValue, currentValue)=>previousValue+currentValue.valor, 0) / calificacion.valores.length}</strong></InputLabel>
                          <Rating name={"promedio-total-input-"+calificacion.id} value={calificacion.valores.reduce((previousValue, currentValue)=>previousValue+currentValue.valor, 0) / calificacion.valores.length} max={10} readOnly sx={{fontSize: "1.4rem"}}/>
                          <Divider sx={{marginBottom: "5px"}}/>
                          <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Chip variant="outlined" label={calificacion.participante.mesa?.name?calificacion.participante.mesa?.name:"SIN MESA"} />
                            <div><FontAwesomeIcon icon={faClock} transform="shrink-6" style={{color: "grey"}}/><span style={{color: "grey"}}>{updatedAt.toLocaleTimeString().substr(0, updatedAt.toLocaleTimeString().lastIndexOf(":"))}</span></div>
                          </Box>
                        </Paper>)
                    })}
                  </ListItem>
                  <Divider />
                </div>
              )
            })}
        </List>
    </Page>
  );
}
