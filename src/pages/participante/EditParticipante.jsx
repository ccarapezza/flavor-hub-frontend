import { faCannabis, faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Save } from "@mui/icons-material";
import { Button, Chip, Divider, FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import { green } from "@mui/material/colors";
import { Box } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import CategoriaColors from "../../colors/CategoriaColors.js";
import ButtonModal from "../../components/ButtonModal";
import ConfirmModal from "../../components/ConfirmModal";
import SelectCategoria from "../../components/SelectCategoria";
import SelectDojo from "../../components/SelectDojo";
import Context from "../../context/Context.js";
import Page from "../Page";

export default function EditParticipante() {
  let navigate = useNavigate();
  const context = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [dojo, setDojo] = useState("");
  const { id } = useParams();

  const [n, setN] = useState("");
  const [muestraName, setMuestraName] = useState("");
  const [muestraDescription, setMuestraDescription] = useState("");
  const [muestraCategoria, setMuestraCategoria] = useState("");

  const [muestras, setMuestras] = useState([
    {
      id: null,
      name:"",
      description:"",
    }
  ]);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [grow, setGrow] = useState("");

  const [esGrow, setEsGrow] = useState(false);

  useEffect(() => {
    if(id){
      setLoading(true);
      axios.get("/api/participante",{
        params:{
          id: id
        },
      }).then(function (response) {
        if(response.status === 200){
          context.showMessage("Participante cargado correctamente!", "success");
          const data = response?.data;
          setN(data?.n);
          setNombre(data?.name);
          setDni(data?.dni);
          setGrow(data?.grow);
          setEsGrow(data?.grow?true:false)
          setDojo(data?.dojoId)
          setMuestras(data?.muestras);
        }else{
          context.showMessage("No se ha cargado el Participante. Contacte con el administrador.", "error");
          console.error(response);  
        }
      })
      .catch(function (error) {
        context.showMessage("No se ha cargado el Participante. Contacte con el administrador.", "error");
        console.error(error);
      }).then(function () {
        setLoading(false);
      })

    }
  }, [context, id])

  const reloadParticipante = () => {
    axios.get("/api/participante",{
      params:{
        id: id
      },
    }).then(function (response) {
      if(response.status === 200){
        context.showMessage("Participante cargado correctamente!", "success");
        const data = response?.data;
        setN(data?.n);
        setNombre(data?.name);
        setDni(data?.dni);
        setMuestras(data?.muestras);
      }else{
        context.showMessage("No se ha cargado el Participante. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha cargado el Participante. Contacte con el administrador.", "error");
      console.error(error);
    })
  }

  const onSubmit = () => {
    updateParticipante();
  };

  const updateParticipante = () => {
    axios.put("/api/participante/update",{
      id: id,
      name: nombre,
      dni: dni,
      grow: grow,
      dojoId: dojo?dojo:null
    }).then(function (response) {
      if(response.status === 200){
        context.showMessage("Participante actualizado correctamente!", "success");
        navigate("/participante/list")
      }else{
        context.showMessage("No se ha actualizado el Participante. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha actualizado el Participante. Contacte con el administrador.", "error");
      console.error(error);
    })
  };

  const addMuestra = () => {
    axios.post("/api/participante/add-muestra",{
      participanteId: id,
      name: muestraName,
      description: muestraDescription,
      categoriaId: muestraCategoria,
    }).then(function (response) {
      if(response.status === 200){
        context.showMessage("Participante actualizado correctamente!", "success");
        reloadParticipante();
      }else{
        context.showMessage("No se ha actualizado el Participante. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha actualizado el Participante. Contacte con el administrador.", "error");
      console.error(error);
    })
  };

  const updateMuestra = (muestraId) => {
    axios.put("/api/participante/update-muestra",{
      id: muestraId,
      name: muestraName,
      description: muestraDescription,
      categoriaId: muestraCategoria,
    }).then(function (response) {
      if(response.status === 200){
        context.showMessage("Participante actualizado correctamente!", "success");
        reloadParticipante();
      }else{
        context.showMessage("No se ha actualizado el Participante. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha actualizado el Participante. Contacte con el administrador.", "error");
      console.error(error);
    })
  };

  const deleteMuestra = (idMuestra) => {
    axios.delete("/api/participante/remove-muestra",{
      data:{
        id: idMuestra,
      }
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Muestra eliminada","success");
        reloadParticipante();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo eliminar la muestra","error");
      console.log(error);
    })
  };
  
  return (
    <Page title={"Actualizar Participante - #"+n} footer={false} loading={loading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack width="100%" spacing={2}>
          <TextField {...register("name-input", { required: true })} error={errors["name-input"]} fullWidth id="name-input" label="Nombre" variant="outlined" value={nombre} onChange={(e)=>setNombre(e?.target?.value)} />
          <TextField type="number" {...register("dni-input", { required: true })} error={errors["dni-input"]} fullWidth id="dni-input" label="DNI" variant="outlined" value={dni} onChange={(e)=>setDni(e?.target?.value)} />
          <Box sx={{display:"flex", flexDirection: "row" }}>
            <FormControlLabel control={<Switch checked={esGrow} onChange={(e)=>setEsGrow(e.target.checked)} />} label="Es Grow?" sx={{whiteSpace:"nowrap"}}/>
            {esGrow&&
              <TextField {...register("grow-name-input", { required: true })} error={errors["grow-name-input"]} fullWidth id="grow-name-input" label="Nombre" variant="outlined" value={grow} onChange={(e)=>setGrow(e?.target?.value)} />
            }
          </Box>
          <SelectDojo value={dojo} onChange={(e)=>setDojo(e?.target?.value)}/>
          <Divider>
            <Chip label="Muestras" />
          </Divider>
          {muestras?.map((muestra)=>
            <Box key={"muestra-"+muestra.hash} sx={{display: "flex", flexDirection:"row", alignItems:"center", justifyContent: "start"}}>
              <Chip
                component="span"
                sx={{pl: "5px", mr: 1, backgroundColor: green[500]}}
                icon={<FontAwesomeIcon icon={faCannabis} style={{color:"black"}} />}
                label={
                  <Box sx={{display: "flex", alignItems: "center"}}>
                    <Chip size="small" label={"#"+muestra.n} sx={{mr: 1, backgroundColor: green[300], fontWeight: "bold"}}/>
                    <h3><strong>{muestra.name+(muestra.description?(" ("+muestra.description+")"):"")}</strong></h3>
                    <Chip size="small" label={muestra.categoria?.name} sx={{ml: 1, backgroundColor: CategoriaColors[muestra.categoria?.id], fontWeight: "bold"}}/>
                  </Box>
                } />
              <ButtonModal onClick={()=>{setMuestraName(muestra.name); setMuestraDescription(muestra.description); setMuestraCategoria(muestra.categoriaId);}} faIcon={faEdit} textButton="" sx={{whiteSpace: "nowrap", mr: 1}} saveDisabled={!muestraName||!muestraCategoria} operation={()=>{updateMuestra(muestra.id)}}>
                <Box>
                    <Divider sx={{pb:2}}>Editar Muestra</Divider>
                    <TextField fullWidth id="name-input" label="Nombre" variant="outlined" value={muestraName} onChange={(e)=>setMuestraName(e?.target?.value)} />
                    <TextField fullWidth id="description-input" label="Descripción" variant="outlined" sx={{mt: 2}} value={muestraDescription} onChange={(e)=>setMuestraDescription(e?.target?.value)} />
                    <SelectCategoria value={muestraCategoria} onChange={(e)=>setMuestraCategoria(e?.target?.value)}/>
                </Box>
              </ButtonModal>
              <ConfirmModal faIcon={faTrash} buttonColor="error" message="Esta seguro que desea eliminar la muestra?" operation={()=>{deleteMuestra(muestra.id)}}/>
            </Box>
          )}
          <ButtonModal onClick={()=>{setMuestraName(""); setMuestraDescription(""); setMuestraCategoria("");}} faIcon={faPlus} textButton="Crear Muestra" saveDisabled={!muestraName||!muestraCategoria} operation={()=>{addMuestra()}}>
            <Box>
              <Divider sx={{pb:2}}>Nueva muestra</Divider>
              <TextField fullWidth id="name-input" label="Nombre" variant="outlined" value={muestraName} onChange={(e)=>setMuestraName(e?.target?.value)} />
              <TextField fullWidth id="description-input" label="Descripción" variant="outlined" sx={{mt: 2}} value={muestraDescription} onChange={(e)=>setMuestraDescription(e?.target?.value)} />
              <SelectCategoria value={muestraCategoria} onChange={(e)=>setMuestraCategoria(e?.target?.value)}/>
            </Box>
          </ButtonModal>
          <Button type="submit" size="large" color="primary" variant="contained" startIcon={<Save />} onClick={()=>updateParticipante()}>
            Guardar
          </Button>
        </Stack>
      </form>
    </Page>
  );
}
