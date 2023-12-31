import { AddCircleOutline, Delete, Save } from "@mui/icons-material";
import { Button, Chip, Divider, FormControlLabel, IconButton, List, ListItem, Stack, Switch, TextField } from "@mui/material";
import { Box } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import SelectCategoria from "../../components/SelectCategoria";
import SelectDojo from "../../components/SelectDojo";
import Context from "../../context/Context";
import Page from "../Page";

export default function CreateParticipante() {
  const context = useContext(Context);
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [dojo, setDojo] = useState("");
  const [muestras, setMuestras] = useState([
    {
        name:"",
        description:"",
        categoriaId:"",
    }
  ]);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [grow, setGrow] = useState("");

  const [esGrow, setEsGrow] = useState(false);

  const onSubmit = () => {
    createParticipante();
  };

  const createParticipante = () => {
    axios.post("/api/participante/create",{
      name: nombre,
      dni: dni,
      muestras: muestras,
      dojoId: dojo?dojo:null,
      grow: grow?grow:null
    }).then(function (response) {     
      if(response.status === 200){
        context.showMessage("Participante creado correctamente!", "success");
        clearForm();
      }else{
        context.showMessage("No se ha creado el Participante. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha creado el Participante. Contacte con el administrador.", "error");
      console.error(error);
    })
  };

  const setNombreMuestra = (index, value)=>{
    setMuestras(muestras.map((element,currentIndex)=>{
      if(currentIndex!==index){
        return element;
      }else{
        return ({
            ...element,
            name: value
        })
      }
    }));
  }

  const setDescripcionMuestra = (index, value)=>{
    setMuestras(muestras.map((element,currentIndex)=>{
      if(currentIndex!==index){
        return element;
      }else{
        return ({
            ...element,
            description: value
        })
      }
    }));
  }

  const setCategoriaMuestra = (index, value)=>{
    setMuestras(muestras.map((element,currentIndex)=>{
      if(currentIndex!==index){
        return element;
      }else{
        return ({
            ...element,
            categoriaId: value&&!isNaN(value)?parseInt(value):""
        })
      }
    }));
  }

  const addMuestra = ()=>{
    setMuestras(currentMuestras=>{
      return currentMuestras.concat({
        name:"",
        description:"",
        categoriaId:""
      });
    })
  }

  const removeMuestra = (deleteIndex)=>{ 
    setMuestras(muestras.filter((e, index)=>{
      return index!==deleteIndex;
    }))
  }

  const clearForm = ()=>{ 
    setNombre("");
    setDni("");
    setDojo("");
    setGrow("");
    setEsGrow(false);
    setMuestras([
      {
          name:"",
          description:"",
          categoriaId:""
      }
    ]);
  }

  return (
    <Page title="Nuevo Participante" footer={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack width="100%" spacing={2}>
          <TextField {...register("name-input", { required: true })} error={errors["name-input"]?true:false} fullWidth id="name-input" label="Nombre" variant="outlined" value={nombre} onChange={(e)=>setNombre(e?.target?.value)} />
          <TextField type="number" {...register("dni-input", { required: true })} error={errors["dni-input"]?true:false} fullWidth id="dni-input" label="DNI" variant="outlined" value={dni} onChange={(e)=>setDni(e?.target?.value)} />
          <Box sx={{display:"flex", flexDirection: "row" }}>
            <FormControlLabel control={<Switch checked={esGrow} onChange={(e)=>setEsGrow(e.target.checked)} />} label="Es Grow?" sx={{whiteSpace:"nowrap"}}/>
            {esGrow&&
              <TextField {...register("grow-name-input", { required: true })} error={errors["grow-name-input"]?true:false} fullWidth id="grow-name-input" label="Nombre" variant="outlined" value={grow} onChange={(e)=>setGrow(e?.target?.value)} />
            }
          </Box>
          <SelectDojo value={dojo} onChange={(e)=>setDojo(e?.target?.value)}/>
          <Divider>
            <Chip label="Muestras" />
          </Divider>
          <List sx={{paddingTop: "0", marginTop: 0}}>
            {muestras.map((muestra, index)=>{
              return(
                <div key={index}>
                  <ListItem>
                    <Stack width="100%" spacing={2}>
                      <Box sx={{display:"flex", justifyContent:"space-between" }}>
                        <Chip label={"#"+(index+1)}/>
                        <IconButton size="small" component="span" disabled={index===0} onClick={()=>{removeMuestra(index)}}>
                          <Delete fontSize="small"/>
                        </IconButton>
                      </Box>
                      <TextField {...register("muestra-name-input"+index, { required: true })} error={errors["muestra-name-input"+index]?true:false} label="Nombre" variant="outlined" value={muestras[index]?.name} onChange={(e)=>setNombreMuestra(index, e?.target?.value)}/>
                      <TextField id="muestra-desc-input" label="Banco/Criador" variant="outlined" value={muestras[index]?.description} onChange={(e)=>setDescripcionMuestra(index, e?.target?.value)}/>
                      <SelectCategoria optionsEnable={false} selectProps={{...register("categoria-input"+index, { required: true })}} error={errors["categoria-input"+index]?true:false} value={muestras[index]?.categoriaId} onChange={(e)=>setCategoriaMuestra(index, e?.target?.value)}/>
                    </Stack>
                  </ListItem>
                  <Divider/>
                </div>
              )
            })}
            <ListItem sx={{display: "flex", justifyContent: "end"}}>
              <Button sx={{padding: "5px"}} size="small" color="success" variant="outlined" startIcon={<AddCircleOutline />} onClick={()=>{addMuestra()}}>
                Agregar Muestra
              </Button>
            </ListItem>
          </List>
          <Button type="submit" size="large" color="primary" variant="contained" startIcon={<Save />}>
            Guardar
          </Button>
        </Stack>
      </form>
    </Page>
  );
}
