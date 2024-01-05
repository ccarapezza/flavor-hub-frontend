import { Fragment, useCallback, useContext, useEffect, useState } from 'react'
import { Button, Card, CardContent, CardHeader, Chip, Divider, IconButton, InputLabel, Paper, Rating, Stack, FormControlLabel, Slider, Switch } from '@mui/material'
import { Star } from "@mui/icons-material";
import Page from '../Page';
import { Box } from '@mui/material';
import { QrScanner } from '@yudiel/react-qr-scanner';//import { QrReader } from "react-qr-reader";
import Context from '../../context/Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSlidersH, faSquareFull, faStar, faSyncAlt, faTag } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Loading from '../../components/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import { red } from '@mui/material/colors';
import { Typography } from '@mui/material';
import CategoriaColors from '../../colors/CategoriaColors';
import FacingMode from '../../Constants';

export default function Calificacion() {
    let navigate = useNavigate();
    const context = useContext(Context);
    const { calificacionHash } = useParams();

    const [camera, setCamera] = useState(FacingMode.ENVIRONMENT)

    const [hashMuestra, setHashMuestra] = useState(calificacionHash);
    const [idMuestra, setIdMuestra] = useState();
    const [loading, setLoading] = useState(false);
    const [categoria, setCategoria] = useState(null);

    const validarMuestra = useCallback((hash) => {
        setIdMuestra(null);
        setCategoria(null);
        setLoading(true);
        axios.post("/api/participante/validar-muestra", {
            hashMuestra: hash
        }).then(function (response) {
            if (response.status === 200) {
                const data = response.data;
                const calificacion = data?.calificacion;
                setIdMuestra(data?.muestraN);
                setCategoria(data?.categoria);
                setLabels(data?.labels);
                if(calificacion){
                    setValores(JSON.parse("["+calificacion.valores.map(valor=>valor.valor).toString()+"]"))
                    context.showMessage("Muestra identificada! Ya calificó esta muestra pero puede actualizarla.", "warning");
                }else{
                    setValores(data?.labels.map(()=>5));
                    context.showMessage("Muestra identificada!", "success");
                }
            } else {
                alert(JSON.stringify(response))
                context.showMessage("No se ha podido validar la muestra.", "error");
                console.error(response);
            }
        }).catch(function (error) {
            alert("!"+JSON.stringify(error))
            setHashMuestra();
            context.showMessage("No se ha podido validar la muestra.", "error");
            console.error(error);
        }).then(function () {
            setLoading(false);
        })
    },[context])

    const calificarMuestra = () => {
        setLoading(true);
        axios.post("/api/participante/calificar", {
            hashMuestra: hashMuestra,
            valores: valores.toString()
        }).then(function (response) {
            if (response.status === 200) {
                context.showMessage("Calificación guardada!", "success");
                navigate("/");
            } else {
                context.showMessage("Error al guardar la calificación.", "error");
                console.error(response);
            }
        }).catch(function (error) {
            context.showMessage("Error al guardar la calificación.", "error");
            console.error(error);
        }).then(function () {
            setLoading(false);
        })
    };

    const switchCamera = () => {
        setCamera(
          camera === FacingMode.ENVIRONMENT
            ? FacingMode.USER
            : FacingMode.ENVIRONMENT
        )
    }

    const handleScan = (data) => {
        if (data) {
            setHashMuestra(data);
        }
    };

    const handleError = (err) => {       
        console.error(err);
    };

    const [labels, setLabels] = useState(["","","","",""]);
    const [valores, setValores] = useState([5,5,5,5,5]);

    const setValor = (index, valor) => {
        setValores(valores.map((currentValor, currentIndex)=>index===currentIndex?valor:currentValor));
    }

    const [starView, setStarView] = useState(true);

    useEffect(() => {
        if(hashMuestra){
            validarMuestra(hashMuestra)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hashMuestra])

    const marks = [
        { value: 1, label: '1'},
        { value: 2, label: '2'},
        { value: 3, label: '3'},
        { value: 4, label: '4'},
        { value: 5, label: '5'},
        { value: 6, label: '6'},
        { value: 7, label: '7'},
        { value: 8, label: '8'},
        { value: 9, label: '9'},
        { value: 10, label: '10'},
    ];

    return (
        <Page
            title={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    Calificación 
                    {idMuestra && <Chip sx={{ ml: 1, color: "white" }} size="small" variant="outlined" label={"Muestra #" + idMuestra} />}
                    {calificacionHash && <Chip sx={{ ml: 1 }} color="primary" size="small" variant="outlined" label={""} />}
                </Box>} >
            {loading ?
                <Loading />
                : idMuestra ?
                    <Stack >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my:0, py:0 }}>
                            {categoria &&
                                <Box key={"categoria"+categoria.id} sx={{color:"white", px: 1, width:"fit-content", display: "flex", alignItems:"center", justifyContent: "space-between", backgroundColor: CategoriaColors[categoria.id], borderRadius: 1, margin: 1}}>
                                    <FontAwesomeIcon icon={faTag} style={{paddingRight: 10, color:"white"}}/>
                                    <Typography variant='caption' sx={{px:2, color:"white"}}>{categoria.name}</Typography>
                                </Box>
                            }
                            <Box sx={{width:"fit-content", display: "flex", alignItems:"center"}}>
                                <Typography>Modo:</Typography>
                                <Box sx={{ display: "flex", alignItems: "center", mx: 2, my:0}}>
                                    <FontAwesomeIcon icon={faSlidersH} style={{margin:0, padding: 0}}/>
                                    <FormControlLabel
                                        sx={{flexGrow: 1, whiteSpace:"nowrap", mx:0, px:0, textAlign: "center", display: "inline", alignSelf: "center"}}
                                        control={<Switch size="small" color="default" checked={starView} onChange={(e)=>{setStarView(e.target?.checked)}} sx={{color:red[500], mx:0}} />}
                                        label={""}
                                    />
                                    <FontAwesomeIcon icon={faStar} style={{margin:0, padding: 0}}/>
                                </Box>
                            </Box>
                        </Box>
                        <Divider sx={{ mt: 1, mb: 1 }} />

                        {labels.map((label, index)=>{
                            const inputName = "value-"+index+"-input";
                            return(<Fragment key={inputName}>
                                <InputLabel htmlFor={inputName}>{label}</InputLabel>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    {starView?
                                        <Rating sx={{ display: "flex" }}
                                            name={inputName}
                                            value={valores[index]}
                                            onChange={(event, value) => {
                                                if(value){
                                                    setValor(index, value)
                                                }
                                            }}
                                            max={10} />
                                        :
                                        <Slider valueLabelDisplay="auto"
                                            step={.5}
                                            marks={marks}
                                            min={1}
                                            sx={{ display: "flex" }}
                                            name={inputName}
                                            value={valores[index]}
                                            onChange={(event, value) => {
                                                if(value){
                                                    setValor(index, value)
                                                }
                                            }}
                                            max={10} />
                                    }
                                    <Paper sx={{ p: 1, ml: 2, borderColor: "black", fontWeight: "bold", width: "2.1rem", textAlign: "center" }} variant="outlined">{valores[index]?.toFixed(1)}</Paper>
                                </Box>
                                <Divider sx={{ mt: 1, mb: 1 }} />
                            </Fragment>)
                        })}
                        
                        <Button size="large" color="primary" variant="contained" startIcon={<Star />} onClick={() => { calificarMuestra() }}>
                            Calificar
                        </Button>
                    </Stack>
                    :
                    <Card>
                        <CardHeader
                            sx={{ pb: 0 }}
                            subheader="Escaneé el código de la muestra para calificarla"
                            action={
                                <IconButton aria-label="settings" onClick={() => { switchCamera() }}>
                                    <span className="fa-layers fa-fw fa-2x fa-dark">
                                        <FontAwesomeIcon icon={faCamera} />
                                        <FontAwesomeIcon icon={faSquareFull} transform="shrink-4 down-1" />
                                        <FontAwesomeIcon icon={faSyncAlt} inverse transform="shrink-8 down-1" />
                                    </span>
                                </IconButton>
                            } />
                        <CardContent>
                            {/* 
                                <div>
                                    <input type="text" value={hashMuestra} onChange={(e)=>{setHashMuestra(e.target.value)}} />
                                    <button onClick={(e)=>{validarMuestra()}}>Login</button>
                                </div>
                                <div>QR RESULT:{hashMuestra}</div>
                                <div>{JSON.stringify(error)}</div>
                            */}
                            <QrScanner
                                constraints={camera}
                                scanDelay={300}
                                onError={handleError}
                                onResult={handleScan}
                                containerStyle={{ width: "100%" }}
                            />
                            {/*
                            <QrReader
                                facingMode={camera}
                                delay={300}
                                onError={handleError}
                                onScan={handleScan}
                                style={{ width: "100%" }}
                            />
                        */}
                        </CardContent>
                    </Card>
            }
        </Page>
    )
}
