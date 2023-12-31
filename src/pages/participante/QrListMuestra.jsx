
import axios from "axios";
import { useEffect, useState } from "react";
import Page from "../Page";
import { PDFDownloadLink } from "@react-pdf/renderer";
import QRCode from 'qrcode'
import QrsMuestraPdfDocument from "../pdf/QrsMuestraPdfDocument";
import Loading from "../../components/Loading";
import { Avatar, Button, Chip, Divider, IconButton, InputBase, List, ListItem, ListItemAvatar, Paper, Stack } from "@mui/material";
import { Search } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";

export default function QrListMuestra() {
  const [muestras, setMuestras] = useState([]);
  const [muestrasWithQrs, setMuestrasWithQrs] = useState([]);
  const [searchField, setSearchField] = useState("");

  const listAllMuestras = () => {
    setMuestras();
    axios.get("/api/muestras/qrs")
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

  useEffect(() => {
    if(muestras){
      Promise.all(muestras.map(async (muestra) => {
        const qrHash = await QRCode.toDataURL(muestra.hash);
        return {
          ...muestra,
          qrHash: qrHash
        };
      })).then(function(response) {
        setMuestrasWithQrs(response);
      });
    }
  }, [muestras])

  return (
    <Page title="QR Muestras" footer={false}>
      <Stack sx={{textAlign: "center"}} spacing={2}>
        {muestrasWithQrs&&muestrasWithQrs.length>0?
        <>
          <PDFDownloadLink style={{textDecoration: "none"}} document={<QrsMuestraPdfDocument muestras={muestrasWithQrs} />} fileName="Muestras-QR-CodeloCup.pdf">
            {({ loading }) =>
              loading ?
                <Loading/>
              :
                <Button size="large" color="primary" variant="contained">
                  <FontAwesomeIcon style={{marginRight: 20}} icon={faFilePdf} transform="grow-6" />Todos los QRs - PDF
                </Button>
            }
          </PDFDownloadLink>
          <Divider>Buscar Muestra</Divider>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Buscar Muestra"
              inputProps={{ 'aria-label': 'Buscar Muestra' }}
              value={searchField}
              onChange={(e)=>setSearchField(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <Search />
            </IconButton>
          </Paper>
          <List sx={{paddingTop: "0", marginTop: 0}}>
              {searchField && !isNaN(searchField) && muestrasWithQrs.filter(muestra => parseInt(muestra.n)===parseInt(searchField)).map((muestra, index)=>{
                return(<>
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 62, height: 62 }}>
                        <h2>{"#"+muestra.n}</h2>
                      </Avatar>
                    </ListItemAvatar>
                    <img src={muestra.qrHash} alt={muestra.hash} style={{width: "250px"}}/>
                    
                  </ListItem>
                  <PDFDownloadLink style={{textDecoration: "none"}} document={<QrsMuestraPdfDocument muestras={[muestra]} />} fileName={"Muestra"+muestra.id+"-QR-CodeloCup.pdf"}>
                      {({ loading }) =>
                        loading ?
                          <Loading/>
                        :
                          <Button size="large" color="primary" variant="contained">
                            <FontAwesomeIcon style={{marginRight: 20}} icon={faFilePdf} transform="grow-6" />Exportar a PDF
                          </Button>
                      }
                    </PDFDownloadLink>
                </>)
              })}
            </List>
        </>
        :
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2><Chip label="No hay Muestras disponibles"/></h2>
        </Box>
        }
        
      </Stack>
    </Page>
  );
}
