
import axios from "axios";
import { useEffect, useState } from "react";
import Page from "../Page";
import { PDFDownloadLink } from "@react-pdf/renderer";
import QrsParticipantePdfDocument from "../pdf/QrsParticipantePdfDocument";
import QRCode from 'qrcode'
import { Avatar, Button, Chip, Divider, IconButton, InputBase, List, ListItem, ListItemAvatar, Paper, Stack, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";

export default function QrListParticipantes() {
  const [participantes, setParticipantes] = useState([]);
  const [participantesWithQrs, setParticipantesWithQrs] = useState([]);
  const [searchField, setSearchField] = useState("");

  const listAllParticipantes = () => {
    setParticipantes();
    axios.get("/api/participante/list")
    .then(function (responseParticipante) {
      // handle success
      if(responseParticipante.status === 200){
        axios.get("/api/participante/jurado-list")
        .then(function (responseJurado) {
          // handle success
          if(responseJurado.status === 200){
            setParticipantes(responseParticipante.data.concat(responseJurado.data));
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  };

  useEffect(() => {
    listAllParticipantes();
  }, []);

  useEffect(() => {
    if(participantes){
      Promise.all(participantes.map(async (participante) => {
        const qrHash = await QRCode.toDataURL(participante.hash);
        return {
          ...participante,
          qrHash: qrHash
        };
      })).then(function(response) {
        setParticipantesWithQrs(response);
      });
    }
  }, [participantes])

  return (
    <Page title="QR Participantes" footer={false}>
      <Stack sx={{textAlign: "center"}} spacing={2}>
        {participantesWithQrs&&participantesWithQrs.length>0?
        <>
          <PDFDownloadLink style={{textDecoration: "none"}} document={<QrsParticipantePdfDocument participantes={participantesWithQrs} />} fileName="Participantes-QR-CodeloCup.pdf">
            {({ loading }) =>
              loading ?
              <Loading/>
            :
              <Button size="large" color="primary" variant="contained">
                <FontAwesomeIcon style={{marginRight: 20}} icon={faFilePdf} transform="grow-6" />Todos los QRs - PDF
              </Button>
            }
          </PDFDownloadLink>
          <Divider>Buscar Participante</Divider>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Buscar Participante"
              inputProps={{ 'aria-label': 'Buscar Participante' }}
              value={searchField}
              onChange={(e)=>setSearchField(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <Search />
            </IconButton>
          </Paper>
          <List sx={{paddingTop: "0", marginTop: 0}}>
            {searchField && participantesWithQrs.filter(participante => parseInt(participante.n)===(!isNaN(searchField)?parseInt(searchField):0) || participante.name?.toLowerCase().includes(searchField?.toLowerCase())).map((participante, index)=>{
              return(index===0&&<Stack>
                <Typography variant="h4">{participante.name}</Typography>
                <ListItem key={index} sx={{pt:0}}>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 62, height: 62 }}>
                      <h2>{"#"+participante.n}</h2>
                    </Avatar>
                  </ListItemAvatar>
                  <img src={participante.qrHash} alt={participante.hash} style={{width: "250px"}}/>
                </ListItem>
                <PDFDownloadLink style={{textDecoration: "none"}} document={<QrsParticipantePdfDocument participantes={[participante]} />} fileName={"Participante-"+participante.id+"-QR-CodeloCup.pdf"}>
                    {({ loading }) =>
                      loading ?
                        <Loading/>
                      :
                        <Button size="large" color="primary" variant="contained">
                          <FontAwesomeIcon style={{marginRight: 20}} icon={faFilePdf} transform="grow-6" />Exportar a PDF
                        </Button>
                    }
                  </PDFDownloadLink>
              </Stack>)
            })}
          </List>
        </>
        :
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2><Chip label="No hay Participantes disponibles"/></h2>
        </Box>
        }
      </Stack>
    </Page>
  );
}
