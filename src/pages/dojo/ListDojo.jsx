import { Avatar, Chip, Divider, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Page from "../Page";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faTrash, faVihara } from '@fortawesome/free-solid-svg-icons'
import { deepPurple } from '@mui/material/colors';
import { Box } from "@mui/material";
import Context from "../../context/Context.js";
import ConfirmModal from "../../components/ConfirmModal";
import ButtonModal from "../../components/ButtonModal";
import { Search } from "@mui/icons-material";

export default function ListDojo() {
  const context = useContext(Context);
  const [dojos, setDojos] = useState([]);
  const [dojoName, setDojoName] = useState("");
  const [searchField, setSearchField] = useState("");

  const listAllDojos = () => {
    setDojos();
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
    })
  };

  const deleteDojo = (idDojo) => {
    axios.delete("/api/dojo/delete",{
      data:{
        id: idDojo,
      }
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Dojo eliminado","success");
        listAllDojos();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo eliminar el Dojo","error");
      console.log(error);
    })
  };

  const updateDojo = (idDojo) => {
    axios.put("/api/dojo/update",{
      id: idDojo,
      name: dojoName,
    })
    .then(function (response) {
      if(response.status === 200){
        context.showMessage("Dojo actualizado","success");
        listAllDojos();
      }
    })
    .catch(function (error) {
      context.showMessage("No se pudo actualizar el Dojo","error");
      console.log(error);
    })
  };

  const createDojo = () => {
    axios.post("/api/dojo/create", {
        name: dojoName,
    }).then(function (response) {
        if (response.status === 200) {
            context.showMessage("Dojo creado correctamente!", "success");
            setDojoName("");
            listAllDojos();
        } else {
            context.showMessage("No se ha creado el Dojo. Contacte con el administrador.", "error");
            console.error(response);
        }
    })
    .catch(function (error) {
        context.showMessage("No se ha creado el Dojo. Contacte con el administrador.", "error");
        console.error(error);
    })
  };      

  useEffect(() => {
    listAllDojos();
  }, []);

  return (
    <Page title="Listado Dojos" footer={false}>
      {dojos?.length!==0?
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
            <ButtonModal onClick={()=>{setDojoName("")}} faIcon={faPlus} sx={{whiteSpace: "nowrap", ml: 2}} saveDisabled={!dojoName} operation={()=>{createDojo()}}>
                <Box>
                    <Divider sx={{pb:2}}>Nuevo dojo</Divider>
                    <TextField fullWidth id="dojo-name-input" label="Nombre" variant="outlined" value={dojoName} onChange={(e)=>setDojoName(e?.target?.value)} />                         
                </Box>
            </ButtonModal>
          </Box>
          <Divider sx={{my: 1}}/>
          <List sx={{paddingTop: "0", marginTop: 0}}>
            {dojos?.filter(dojo => (dojo.name?.toLowerCase().includes(searchField?.toLowerCase()))).map((dojo)=>{
              return(
                <div key={"dojo-list-element-"+dojo.id}>
                  <ListItem sx={{display: "flex", justifyContent: "space-between"}}>
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
                    <Box>
                      <ButtonModal onClick={()=>{setDojoName(dojo.name)}} faIcon={faEdit} textButton="" sx={{whiteSpace: "nowrap", mr: 1}} saveDisabled={!dojoName} operation={()=>{updateDojo(dojo.id)}}>
                        <Box>
                            <Divider sx={{pb:2}}>Editar dojo</Divider>
                            <TextField fullWidth id="new-dojo-name-input" label="Nombre" variant="outlined" value={dojoName} onChange={(e)=>setDojoName(e?.target?.value)} />                         
                        </Box>
                      </ButtonModal>
                      <ConfirmModal faIcon={faTrash} buttonColor="error" message="Esta seguro que desea eliminar el Dojo?" operation={()=>{deleteDojo(dojo.id)}}/>
                    </Box>
                  </ListItem>
                  <Divider />
                </div>
              )
            })}
          </List>
        </>
        :
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2><Chip label="No se encontraron dojos"/></h2>
        </Box>
      }
    </Page>
  );
}
