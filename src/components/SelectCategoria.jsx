import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Divider, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Box } from '@mui/material';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import Context from '../context/Context.js';
import ButtonModal from './ButtonModal.jsx';
import PropTypes from 'prop-types';

SelectCategoria.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    selectProps: PropTypes.object,
    error: PropTypes.bool,
    blankLabel: PropTypes.string,
    sx: PropTypes.object,
    optionsEnable: PropTypes.bool,
    setLabels: PropTypes.func,
}

export default function SelectCategoria({id="select-categoria", label="Categoría", value, onChange, selectProps, error, blankLabel="", sx, optionsEnable=false, setLabels}) {
    const context = useContext(Context)
    const [categorias, setCategorias] = useState([]);
    const [categoriaName, setCategoriaName] = useState([]);

    const addNewCategoria = () => {
        axios.post("/api/categoria/create", {
            name: categoriaName,
        }).then(function (response) {
            if (response.status === 200) {
                const categoria = response.data;
                context.showMessage("Categoría creada correctamente!", "success");
                setCategoriaName("");
                setCategorias(categorias.concat({id: categoria.id, name: categoria.name}));
                onChange({target:{value: categoria.id}});
            } else {
                context.showMessage("No se ha creado la Categoria. Contacte con el administrador.", "error");
                console.error(response);
            }
        })
        .catch(function (error) {
            context.showMessage("No se ha creado la Categoria. Contacte con el administrador.", "error");
            console.error(error);
        })
    };

    useEffect(() => {
        setCategorias([]);
        
        axios.get("/api/categoria/list")
        .then(function (response) {
            // handle success
            if(response.status === 200){
                setCategorias(response.data);
            }
        })
        .catch(function (error) {
            context.showMessage("No se pudo obtener los participantes","error");
            console.log(error);
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <FormControl size='small' fullWidth sx={{my: 2, display:"flex", flexDirection: "row", ...sx}}>
            <InputLabel id={id+"-label"}>{label}</InputLabel>
            <Select 
                {...selectProps}
                fullWidth
                error={error}
                value={value}
                label={label}
                labelId={id+"-label"}
                onChange={(e)=>{
                    onChange(e);
                    if(setLabels){
                        const cat = categorias?.find((categoria)=>categoria.id===parseInt(e.target.value));
                        if(cat){
                            setLabels(categorias?.find((categoria)=>categoria.id===parseInt(e.target.value))?.labels.split(","))
                        }else{
                            setLabels([]);
                        }
                    }
                }}
                sx={{m: 0}}
            >
                <MenuItem value="">{blankLabel}</MenuItem>
                {categorias?.map((categoria)=>{
                    return(
                        <MenuItem key={"select-cat-option-"+categoria.id} value={categoria.id}>{categoria.name}</MenuItem>
                    );
                })}
            </Select>
            {optionsEnable&&
                <ButtonModal onClick={()=>{setCategoriaName("")}} faIcon={faPlus} sx={{whiteSpace: "nowrap", ml: 2}} saveDisabled={!categoriaName} operation={()=>{addNewCategoria()}}>
                    <Box>
                        <Divider sx={{pb:2}}>Nueva Categoría</Divider>
                        <TextField fullWidth id="dojo-name-input" label="Nombre" variant="outlined" value={categoriaName} onChange={(e)=>setCategoriaName(e?.target?.value)} />                         
                    </Box>
                </ButtonModal>
            }
        </FormControl>
    )
}
