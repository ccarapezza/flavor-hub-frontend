
import { Avatar, Button, Chip, Divider, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Page from "../Page";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faTags, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Box } from "@mui/material";
import CategoriaColors from "../../colors/CategoriaColors.js";
import Context from "../../context/Context.js";
import ButtonModal from "../../components/ButtonModal";
import ConfirmModal from "../../components/ConfirmModal";
import { Search } from "@mui/icons-material";

export default function ListCategoria() {
  const context = useContext(Context);
  const [categorias, setCategorias] = useState([]);
  const [categoriaName, setCategoriaName] = useState("");
  const [categoriaLabels, setCategoriaLabels] = useState([""]);
  const [searchField, setSearchField] = useState("");

  const listAllCategorias = () => {
    setCategorias();
    axios.get("/api/categoria/list")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setCategorias(response.data.map((categoria)=>{
          return({
            ...categoria,
            labels: categoria.labels?.split(",")
          })
        }));
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  };

  const deleteCategoria = (idCategoria) => {
    axios.delete("/api/categoria/delete",{
      data:{
        id: idCategoria,
      }
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Categoría eliminada","success");
        listAllCategorias();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo eliminar la Categoría","error");
      console.log(error);
    })
  };

  const updateCategoria = (idCategoria) => {
    if(validationCategoria()){
      axios.put("/api/categoria/update",{
        id: idCategoria,
        name: categoriaName,
        labels: categoriaLabels.toString()
      })
      .then(function (response) {
        if(response.status === 200){
          context.showMessage("Categoría actualizada","success");
          listAllCategorias();
        }
      })
      .catch(function (error) {
        context.showMessage("No se pudo actualizar la Categoría","error");
        console.log(error);
      })
    }
  };

  const validationCategoria = () => {
    return !categoriaLabels.includes('');
  }

  const createCategoria = () => {
    if(validationCategoria()){
      axios.post("/api/categoria/create", {
          name: categoriaName,
          labels: categoriaLabels.toString()
      }).then(function (response) {
          if (response.status === 200) {
              context.showMessage("Categoría creada correctamente!", "success");
              setCategoriaName("");
              setCategoriaLabels([""])
              listAllCategorias();
          } else {
              context.showMessage("No se ha creado la Categoría. Contacte con el administrador.", "error");
              console.error(response);
          }
      })
      .catch(function (error) {
          context.showMessage("No se ha creado la Categoría. Contacte con el administrador.", "error");
          console.error(error);
      })
    }
  };

  useEffect(() => {
    listAllCategorias();
  }, []);

  return (
    <Page title="Listado Categorias" footer={false}>
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
        <ButtonModal onClick={()=>{setCategoriaName(""); setCategoriaLabels([""])}} faIcon={faPlus} sx={{whiteSpace: "nowrap", ml: 2}} saveDisabled={!categoriaName||!validationCategoria()} operation={()=>{createCategoria()}}>
            <Box>
                <Divider sx={{pb:2}}>Nueva Categoría</Divider>
                <TextField fullWidth id="dojo-name-input" label="Nombre" variant="outlined" size="small" value={categoriaName} onChange={(e)=>setCategoriaName(e?.target?.value)} />
                <Divider sx={{pb:2}}/>
                <Typography variant="subtitle2" sx={{pt:1}}>Valores:</Typography>
                {categoriaLabels.map((label, index)=>
                  <Box key={"categoria-valor-"+index} sx={{display:"flex", flexDirection: "row", pl:3, pt: 1}}>
                    <TextField id={"categoria-valor-input-"+index}
                      fullWidth
                      label="Valor"
                      variant="outlined"
                      size="small"
                      error={!label}
                      value={label}
                      onChange={(e)=>{
                        setCategoriaLabels(categoriaLabels.map((label, currentIndex)=>currentIndex===index?e.target.value:label));
                      }} />
                    <Button onClick={()=>{ setCategoriaLabels(categoriaLabels.filter((label, currentindex)=>index!==currentindex)) }}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </Button>
                  </Box>
                )}
                <Button fullWidth color="success" variant="outlined" startIcon={<FontAwesomeIcon icon={faPlus}/>}  onClick={()=>{setCategoriaLabels(categoriaLabels.concat(""))}} sx={{my:1}}>
                  Agregar Valor
                </Button>
            </Box>
        </ButtonModal>
      </Box>
      <Divider sx={{my: 1}}/>
      {categorias?.length!==0?
        <List sx={{paddingTop: "0", marginTop: 0}}>
          {categorias?.filter(dojo => (dojo.name?.toLowerCase().includes(searchField?.toLowerCase()))).map((categoria)=>{
            return(
              <div key={"categorias-list-element-"+categoria.id}>
                <ListItem sx={{display: "flex", justifyContent: "space-between"}}>
                  <Box sx={{display: "flex"}}>
                    <ListItemAvatar sx={{display: "flex", alignItems: "center"}}>
                      <Avatar sx={{backgroundColor: CategoriaColors[categoria.id]}}>
                        <FontAwesomeIcon icon={faTags}/>
                      </Avatar>
                    </ListItemAvatar>
                    <Stack>
                      <ListItemText primary={<Typography variant="h5" sx={{mr:1, fontWeight: "bold"}}>{categoria.name}</Typography>} />
                      <Typography variant="subtitle2">Valores:</Typography>
                      {categoria.labels.map((label, index)=>
                        <small key={label+"-label-"+index+"-"+categoria.id} style={{marginLeft:"5px"}}>-{label}</small>
                      )}
                    </Stack>
                  </Box>
                  <Box sx={{display:"flex", flexDirection:"column"}}>
                    <ButtonModal onClick={()=>{setCategoriaName(categoria.name); setCategoriaLabels(categoria.labels)}} faIcon={faEdit} textButton="" sx={{m: 1}} saveDisabled={!categoriaName||!validationCategoria()} operation={()=>{updateCategoria(categoria.id)}}>
                      <Box>
                          <Divider sx={{pb:2}}>Editar Categoría</Divider>
                          <TextField fullWidth id="categoria-name-input" label="Nombre" variant="outlined" size="small" value={categoriaName} onChange={(e)=>setCategoriaName(e?.target?.value)} />                         
                          <Divider sx={{pb:2}}/>
                          <Typography variant="subtitle2" sx={{pt:1}}>Valores:</Typography>
                          {categoriaLabels.map((label, index)=>
                            <Box key={"categoria-valor-"+index} sx={{display:"flex", flexDirection: "row", pl:3, pt: 1}}>
                              <TextField id={"categoria-valor-input-"+index}
                                fullWidth
                                label="Valor"
                                variant="outlined"
                                size="small"
                                error={!label}
                                value={label}
                                onChange={(e)=>{
                                  setCategoriaLabels(categoriaLabels.map((label, currentIndex)=>currentIndex===index?e.target.value:label));
                                }} />
                              <Button onClick={()=>{ setCategoriaLabels(categoriaLabels.filter((label, currentindex)=>index!==currentindex)) }}>
                                  <FontAwesomeIcon icon={faTrash}/>
                              </Button>
                            </Box>
                          )}
                          <Button fullWidth color="success" variant="outlined" startIcon={<FontAwesomeIcon icon={faPlus}/>}  onClick={()=>{setCategoriaLabels(categoriaLabels.concat(""))}} sx={{my:1}}>
                            Agregar Valor
                          </Button>
                      </Box>
                    </ButtonModal>
                    <ConfirmModal faIcon={faTrash} buttonColor="error" message="Esta seguro que desea eliminar la Categoría?" operation={()=>{deleteCategoria(categoria.id)}} sx={{m:1, p:0}}/>
                  </Box>
                </ListItem>
                <Divider />
              </div>
            )
          })}
        </List>
      :
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2><Chip label="No se encontraron categorias"/></h2>
        </Box>
      }
    </Page>
  );
}
