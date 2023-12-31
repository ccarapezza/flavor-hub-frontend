
import { Avatar, Chip, Divider, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Page from "../Page";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Box } from "@mui/material";
import { Search } from "@mui/icons-material";
import { green, orange } from "@mui/material/colors";
import CategoriaColors from "../../colors/CategoriaColors";

export default function ListMuestra() {
  const [muestras, setMuestras] = useState([]);
  const [searchField, setSearchField] = useState("");

  const listAllMuestras = () => {
    setMuestras();
    axios.get("/api/muestras/list")
    .then(function (response) {
      // handle success
      if(response.status === 200){
        setMuestras(response.data);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  };

  useEffect(() => {
    listAllMuestras();
  }, []);

  return (
    <Page title="Listado Muestras" footer={false}>
      {muestras?.length!==0?
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
          </Box>
          <Divider sx={{my: 1}}/>
          <List sx={{paddingTop: "0", marginTop: 0}}>
            {muestras?.filter(muestra => (muestra.name?.toLowerCase().includes(searchField?.toLowerCase()))).map((muestra)=>{
              return(
                <div key={"muestras-list-element-"+muestra.id}>
                  <ListItem sx={{display: "flex", justifyContent: "space-between"}}>
                    <Box sx={{display: "flex"}}>
                      <ListItemAvatar sx={{display: "flex", alignItems: "center"}}>
                        <Avatar sx={{bgcolor: green[500] }}>
                          #{muestra.n}
                        </Avatar>
                      </ListItemAvatar>
                      <Box>
                        <Stack direction={"row"}>
                          <ListItemText primary={<Typography variant="h5" sx={{mr:1, fontWeight: "bold"}}>{muestra.name}</Typography>} />
                          <Chip size="small" label={muestra.categoria?.name} sx={{mx: 1, backgroundColor: CategoriaColors[muestra.categoria.id-1], fontWeight: "bold", color:"white"}}/>
                        </Stack>
                        <Box sx={{display: "flex", alignItems:"center", justifyContent: "start", m:0, pr: 2, borderRadius: 2, backgroundColor: orange[500], width: "fit-content"}}>
                          <FontAwesomeIcon icon={faUser} style={{paddingLeft: 10}}/>
                          <Chip size="small" label={"#"+muestra.participante.n} sx={{margin: 1, fontSize: ".8rem", fontWeight: "bold", backgroundColor: orange[200]}}/>
                          <Typography>{muestra.participante.name}</Typography>
                        </Box>
                      </Box>
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
          <h2><Chip label="No se encontraron Muestras"/></h2>
        </Box>
      }
    </Page>
  );
}
