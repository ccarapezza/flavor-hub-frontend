import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import { Menu } from "@mui/icons-material";
import { Drawer, Box, List, ListItem, ListItemIcon, ListItemText, Divider, Chip, Paper } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCannabis, faChair, faCogs, faGavel, faHome, faKey, faListAlt, faPollH, faQrcode, faSearch, faSignOutAlt, faSquare, faSyncAlt, faTags, faUser, faVihara } from "@fortawesome/free-solid-svg-icons";
import { deepOrange, indigo, yellow } from "@mui/material/colors";
import Loading from "../components/Loading";
import PropTypes from "prop-types";

Page.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    footer: PropTypes.bool,
    sx: PropTypes.object,
    loading: PropTypes.bool,
    containerMaxWidth: PropTypes.string,
};

export default function Page({ title, children, footer = true, sx, loading = false, containerMaxWidth }) {
  const context = useContext(Context);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate= useNavigate();
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}
            onClick={() => {
              setMenuOpen(true);
            }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{display: "flex", alignItems: "center", flexGrow: 1 }}>
            {title}
            {context.isJuradoLogged&&
              <Chip size="small" sx={{mx: 1, color: "white", backgroundColor: indigo[500]}} label={<Box sx={{display: "flex", alignItems: "center"}}>
                <FontAwesomeIcon icon={faGavel} style={{marginRight: 5, fontSize: "0.6rem"}}/>
                <Typography sx={{fontSize: "0.6rem"}}>Jurado</Typography>
              </Box>}/>
            }
            {context.isLogged&&
              <Chip size="small" sx={{mx: 1, color: "white", backgroundColor: yellow[900]}} label={<Box sx={{display: "flex", alignItems: "center"}}>
                <FontAwesomeIcon icon={faKey} style={{marginRight: 5, fontSize: "0.6rem"}}/>
                <Typography sx={{fontSize: "0.6rem"}}>Admin</Typography>
              </Box>}/>
            }
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
        }}
      >
        <Box sx={{ width: 250 }} role="presentation"
          onClick={() => {
            setMenuOpen(false);
          }}
          onKeyDown={() => {
            setMenuOpen(false);
          }}
        >
          <List>
            <ListItem sx={{py:0}} button key={"home"} onClick={()=>navigate("/")}>
              <ListItemIcon>
                <span className="fa-layers fa-fw fa-2x">
                  <FontAwesomeIcon icon={faHome} transform="shrink-6 left-2"/>
                </span>
              </ListItemIcon>
              <ListItemText primary={"Inicio"} />
            </ListItem>
            {context.isParticipanteLogged?
              <>
                <ListItem sx={{py:0}} button key={"refresh-participante"} onClick={()=>navigate("/login")}>
                  <ListItemIcon>
                    <span className="fa-layers fa-fw fa-2x">
                      <FontAwesomeIcon icon={faUser} transform="shrink-6 left-2"/>
                      <FontAwesomeIcon icon={faSquare} transform="shrink-10 down-4 right-4 left-2"/>
                      <FontAwesomeIcon icon={faSyncAlt} inverse transform="shrink-12 down-4 right-4 left-2"/>
                    </span>
                  </ListItemIcon>
                  <ListItemText primary={"Cambiar Participante"} />
                </ListItem>
                <ListItem sx={{py:0}} button key={"calificar-muestra"} onClick={()=>navigate("/calificacion")}>
                  <ListItemIcon>
                    <span className="fa-layers fa-fw fa-2x">
                      <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-3"/>
                      <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4 left-2"/>
                      <FontAwesomeIcon icon={faQrcode} inverse transform="shrink-12 down-4 right-4 left-2"/>
                    </span>
                  </ListItemIcon>
                  <ListItemText primary={"Calificar Muestra"} />
                </ListItem>
                {context.isJuradoLogged&&
                  <ListItem sx={{py:0}} button key={"consultar-muestra"} onClick={()=>navigate("/calificaciones/muestra")}>
                    <ListItemIcon>
                      <span className="fa-layers fa-fw fa-2x">
                        <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-3"/>
                        <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4 left-2"/>
                        <FontAwesomeIcon icon={faSearch} inverse transform="shrink-12 down-4 right-4 left-2"/>
                      </span>
                    </ListItemIcon>
                    <ListItemText primary={"Consultar Muestra"} />
                  </ListItem>
                }
                <ListItem sx={{py:0}} button key={"logout"} onClick={()=>context.logout()}>
                  <ListItemIcon>
                    <span className="fa-layers fa-fw fa-2x">
                      <FontAwesomeIcon icon={faSignOutAlt} transform="shrink-6 left-2"/>
                    </span>
                  </ListItemIcon>
                  <ListItemText primary={"Cerrar Sesión"} />
                </ListItem>
              </>
              :!context.isLogged&&
              <ListItem sx={{py:0}} button key={"participante-login"} onClick={()=>navigate("/login")}>
                <ListItemIcon>
                <span className="fa-layers fa-fw fa-2x">
                  <FontAwesomeIcon icon={faUser} transform="shrink-6 left-3"/>
                  <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4 left-2"/>
                  <FontAwesomeIcon icon={faQrcode} inverse transform="shrink-12 down-4 right-4 left-2"/>
                </span>
                </ListItemIcon>
                <ListItemText primary={"Ingresar"} />
              </ListItem>
            }
          </List>
          {context.isLogged&&
            <List>
              <Divider key={"admin-menu-title"}>
                <Chip label="Carga Datos" color="primary"/>
              </Divider>
              <ListItem sx={{py:0}} button key={"participante-list"} onClick={()=>{navigate("/participante/list")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-2x">
                    <FontAwesomeIcon icon={faListAlt} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Participantes"} />
              </ListItem>
              <ListItem sx={{py:0}} button key={"muestras"} onClick={()=>{navigate("/muestra/list")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-2x">
                    <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Muestras"} />
              </ListItem>
              <ListItem sx={{py:0}} button key={"jurado-list"} onClick={()=>{navigate("/participante/jurado-list")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-2x">
                    <FontAwesomeIcon icon={faListAlt} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Jurados"} />
              </ListItem>
              <ListItem sx={{py:0}} button key={"dojo-list"} onClick={()=>{navigate("/dojo/list")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-2x">
                    <FontAwesomeIcon icon={faVihara} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Dojos"} />
              </ListItem>
              <ListItem sx={{py:0}} button key={"categoria-list"} onClick={()=>{navigate("/categoria/list")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-2x">
                    <FontAwesomeIcon icon={faTags} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Categorias"} />
              </ListItem>
              <ListItem sx={{py:0}} button key={"mesas-manager"} onClick={()=>{navigate("/mesas-manager")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-2x">
                    <FontAwesomeIcon icon={faChair} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Mesas"} />
              </ListItem>
              <Divider sx={{mb:2}}>
                <Chip label="Avanzando" color="primary"/>
              </Divider>
              <ListItem sx={{py:0}} button key={"change-admin-pass"} onClick={()=>{navigate("/change-admin-pass")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-2x">
                    <FontAwesomeIcon icon={faKey} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Cambio contraseña"} />
              </ListItem>
              <ListItem sx={{py:0}} button key={"config"} onClick={()=>{navigate("/config")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-2x">
                    <FontAwesomeIcon icon={faCogs} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Configuración Copa"} />
              </ListItem>
              <Divider sx={{mt: 3}} key={"qr-menu-title"}>
                <Chip label="Generación QRs" color="primary"/>
              </Divider>
              <ListItem sx={{py:0}} button key={"participante-qr-list"} onClick={()=>{navigate("/participante/qr-list")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-2x">
                    <FontAwesomeIcon icon={faQrcode} transform="shrink-6 left-1"/>
                    <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                    <FontAwesomeIcon icon={faUser} inverse transform="shrink-12 down-4 right-4"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"QRs Participantes"} />
              </ListItem>
              <ListItem sx={{py:0}} button key={"muestra-qr-list"} onClick={()=>{navigate("/muestra/qr-list")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-2x">
                    <FontAwesomeIcon icon={faQrcode} transform="shrink-6 left-1"/>
                    <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4"/>
                    <FontAwesomeIcon icon={faCannabis} inverse transform="shrink-12 down-4 right-4"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"QRs Muestras"} />
              </ListItem>
              <Divider sx={{mt: 3}} key={"resumen-menu-title"}>
                <Chip label="Resumen" color="primary"/>
              </Divider>
              <ListItem sx={{py:0}} button key={"resultados"} onClick={()=>{navigate("/calificaciones/resultados")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-2x">
                    <FontAwesomeIcon icon={faPollH} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Resultados"} />
              </ListItem>
              <ListItem sx={{py:0}} button key={"consultar-muestra"} onClick={()=>{navigate("/calificaciones/muestra")}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-2x">
                    <FontAwesomeIcon icon={faCannabis} transform="shrink-6 left-3"/>
                    <FontAwesomeIcon icon={faSquare} transform="shrink-11 down-4 right-4 left-2"/>
                    <FontAwesomeIcon icon={faSearch} inverse transform="shrink-12 down-4 right-4 left-2"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Consultar Muestra"} />
              </ListItem>
              <Divider sx={{my: 2}}/>
              <ListItem sx={{py:0}} button key={"logout"} onClick={()=>{context.logout()}}>
                <ListItemIcon>
                  <span className="fa-layers fa-fw fa-2x">
                    <FontAwesomeIcon icon={faSignOutAlt} transform="shrink-6 left-1"/>
                  </span>
                </ListItemIcon>
                <ListItemText primary={"Cerrar Sesión"} />
              </ListItem>
            </List>
          }
        </Box>
      </Drawer>
      <Container maxWidth={containerMaxWidth} sx={{p: 2, mb:footer && context.isParticipanteLogged?16:2, ...sx }}>
        {loading?
          <Loading/>
        :
          children
        }
      </Container>
      {footer && context.isParticipanteLogged &&
        <AppBar position="fixed" color="secondary" sx={{ top: "auto", bottom: 0}}>
          <Box sx={{ p: 1 }}>
            {context.isJuradoLogged?
              <Chip variant="outlined" size="small" sx={{color: "white"}} label={<Box sx={{display: "flex", alignItems: "center", px: 1}}>
                <FontAwesomeIcon icon={faGavel} style={{marginRight: 5, fontSize: "1rem"}}/>
                <Typography sx={{fontSize: "1rem"}}>Jurado</Typography>
              </Box>}/>
              :
              <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>
                Participante
              </Typography>

            }
            <Typography variant="h5" component="div">
              <Chip variant={"outlined"} label={"#"+context.participanteData?.n} sx={{ mr: 1, bgcolor: deepOrange[500], color:"white!important" }}/>{context.participanteData?.name}
            </Typography>
            <Box sx={{display: "flex", flexWrap: "wrap" }}>  
              {context.participanteData?.mesa&&
                <Paper variant={"outlined"} sx={{width: "fit-content", mt: 1, px: 1, bgcolor: "transparent", borderColor:"white!important"}}>
                  <Typography sx={{ fontSize: ".9rem", fontWeight: "bold", color:"white!important"}} color="text.secondary">
                    {context.participanteData?.mesa?.name}
                  </Typography>
                </Paper>
              }
              {context.participanteData?.mesaSecundaria&&
                <Paper variant={"outlined"} sx={{width: "fit-content", mt: 1, ml:1, px: 1, bgcolor: "transparent", borderColor:"white!important"}}>
                  <small style={{ fontSize: ".9rem", fontWeight: "bold", color:"white!important"}}>
                    {context.participanteData?.mesaSecundaria?.name}
                  </small>
                </Paper>
              }
            </Box>
          </Box>
        </AppBar>
      }
    </>
  );
}
