
import { Avatar, Chip, Divider, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Page from "../Page";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faGavel, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Box } from "@mui/material";
import Context from "../../context/Context.js";
import ButtonModal from "../../components/ButtonModal";
import ConfirmModal from "../../components/ConfirmModal";
import { Search } from "@mui/icons-material";
import { indigo } from "@mui/material/colors";

export default function ListJurado() {
  const context = useContext(Context);
  const [jurados, setJurados] = useState([]);
  const [name, setName] = useState("");
  const [searchField, setSearchField] = useState("");

  const listAllJurados = () => {
    setJurados();
    axios.get("/api/participante/jurado-list")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setJurados(response.data);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  };

  const deleteJurado = (idJurado) => {
    axios.delete("/api/participante/delete",{
      data:{
        id: idJurado,
      }
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Jurado eliminada","success");
        listAllJurados();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo eliminar el Jurado","error");
      console.log(error);
    })
  };

  const updateJurado = (idJurado) => {
    axios.put("/api/participante/update",{
      id: idJurado,
      name: name,
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Jurado actualizado","success");
        listAllJurados();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo actualizar el Jurado","error");
      console.log(error);
    })
  };

  const createJurado = () => {
    axios.post("/api/participante/create-jurado", {
        name: name,
    }).then(function (response) {
        if (response.status === 200) {
            context.showMessage("Jurado creado correctamente!", "success");
            setName("");
            listAllJurados();
        } else {
            context.showMessage("No se ha creado el Jurado. Contacte con el administrador.", "error");
            console.error(response);
        }
    })
    .catch(function (error) {
        context.showMessage("No se ha creado el Jurado. Contacte con el administrador.", "error");
        console.error(error);
    })
  };

  useEffect(() => {
    listAllJurados();
  }, []);

  return (
    <Page title="Listado Jurados" footer={false}>
        <>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width:"100%" }}
              >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={"Buscar..."}
                inputProps={{ 'aria-label': 'Buscar Jurado...'}}
                value={searchField}
                onChange={(e)=>setSearchField(e.target.value)}
                />
              <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <Search />
              </IconButton>
            </Paper>
            <ButtonModal onClick={()=>{setName("")}} faIcon={faPlus} sx={{whiteSpace: "nowrap", ml: 2}} saveDisabled={!name} operation={()=>{createJurado()}}>
                <Box>
                    <Divider sx={{pb:2}}>Nuevo Jurado</Divider>
                    <TextField fullWidth id="edit-jurado-name-input" label="Nombre" variant="outlined" value={name} onChange={(e)=>setName(e?.target?.value)} />                         
                </Box>
            </ButtonModal>
          </Box>
          <Divider sx={{my: 1}}/>
          {jurados?.length!==0?
            <List sx={{paddingTop: "0", marginTop: 0}}>
              {jurados?.filter(jurado => (jurado.name?.toLowerCase().includes(searchField?.toLowerCase()))).map((jurado)=>{
                return(
                  <div key={"jurado-list-element-"+jurado.id}>
                    <ListItem sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      <Box sx={{display: "flex"}}>
                        <ListItemAvatar sx={{display: "flex", alignItems: "center"}}>
                          <Avatar sx={{backgroundColor: indigo[500]}}>
                            <h6>{"#"+jurado.n}</h6>
                          </Avatar>
                        </ListItemAvatar>
                        <Stack>
                          <ListItemText
                          primary={<Box sx={{display: "flex", alignItems: "center"}}>
                          <Typography variant="h5" sx={{mr:1, fontWeight: "bold"}}>{jurado.name}</Typography>
                          <Chip size="small" sx={{mx: 1, color: "white", backgroundColor: indigo[500]}} label={<Box sx={{display: "flex", alignItems: "center"}}>
                            <FontAwesomeIcon icon={faGavel} style={{marginRight: 5, fontSize: "0.6rem"}}/>
                            <Typography sx={{fontSize: "0.6rem"}}>Jurado</Typography>
                          </Box>}/>
                          </Box>}
                          />
                        </Stack>
                      </Box>
                      <Box>
                        <ButtonModal onClick={()=>{setName(jurado.name)}} faIcon={faEdit} textButton="" sx={{whiteSpace: "nowrap", mr: 1}} saveDisabled={!name} operation={()=>{updateJurado(jurado.id)}}>
                          <Box>
                              <Divider sx={{pb:2}}>Editar Categoría</Divider>
                              <TextField fullWidth id="new-jurado-name-input" label="Nombre" variant="outlined" value={name} onChange={(e)=>setName(e?.target?.value)} />                         
                          </Box>
                        </ButtonModal>
                        <ConfirmModal faIcon={faTrash} buttonColor="error" message="Esta seguro que desea eliminar el Dojo?" operation={()=>{deleteJurado(jurado.id)}}/>
                      </Box>
                    </ListItem>
                    <Divider />
                  </div>
                )
              })}
            </List>
            :
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h2><Chip label="No se encontraron Jurados"/></h2>
            </Box>
          }
        </>
    </Page>
  );
}
