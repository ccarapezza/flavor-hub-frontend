import { Box } from "@mui/material";
import axios from "axios";
import { useContext } from "react";
import { useDrag } from "react-dnd";
import Context from "../context/Context";
import PropTypes from 'prop-types';

DraggableBox.propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.object,
    children: PropTypes.node.isRequired,
    sx: PropTypes.object,
    onUpdate: PropTypes.func,
};

export default function DraggableBox({ name, data, children, sx, onUpdate }) {
    const context = useContext(Context);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "box",
        item: { name, data },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                const objectType = item.name.split("-")[0];
                const objectId = item.name.split("-")[1];
                const mesaId = dropResult.name.split("-")[1];
                let forbidden = false;
                
                if(objectType==="participante"){
                    const muestrasDelParticipante = item.data?.muestras;
                    const muestrasDeLaMesa = dropResult.data?.muestras;

                    for (const muestraDelParticipante of muestrasDelParticipante) {
                        for (const muestraDeLaMesa of muestrasDeLaMesa) {
                            forbidden = forbidden || muestraDeLaMesa.id === muestraDelParticipante.id;
                        }
                    }
                    if(!forbidden){
                        addParticipante(objectId, mesaId)
                    }else{
                        context.showMessage("No se puede agregar el participante a esta mesa.", "error");
                    }
                }
                if(objectType==="participanteSecundario"){
                    const muestrasDelParticipante = item.data?.muestras;
                    const muestrasDeLaMesa = dropResult.data?.muestras;

                    for (const muestraDelParticipante of muestrasDelParticipante) {
                        for (const muestraDeLaMesa of muestrasDeLaMesa) {
                            forbidden = forbidden || muestraDeLaMesa.id === muestraDelParticipante.id;
                        }
                    }
                    if(!forbidden){
                        addParticipanteSecundario(objectId, mesaId)
                    }else{
                        context.showMessage("No se puede agregar el participante a esta mesa.", "error");
                    }
                }
                if(objectType==="muestra"){
                    const participantesDeLaMesa = dropResult.data?.participantes.concat(dropResult.data?.participantesSecundarios);
                    for (const participanteDeLaMesa of participantesDeLaMesa) {
                        for (const muestra of participanteDeLaMesa.muestras) {
                            forbidden = forbidden || muestra.id===parseInt(objectId);
                        }
                    }

                    if(!forbidden){
                        addMuestra(objectId, mesaId)
                    }else{
                        context.showMessage("No se puede agregar la muestra a esta mesa.", "error");
                    }
                }
                if(objectType==="categoria"){
                    // eslint-disable-next-line no-unsafe-optional-chaining
                    for (const categoria of dropResult.data?.categorias) {
                        forbidden = forbidden || categoria.id===parseInt(objectId);
                    }

                    if(!forbidden){
                        addCategoria(objectId, mesaId);
                    }else{
                        context.showMessage("No se puede agregar la categoría a esta mesa.", "error");
                    }
                }
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }));

    const addParticipante = (idParticipante, idMesa) => {
        axios.post("/api/mesas/add-participante",{
            idParticipante: idParticipante,
            idMesa: idMesa,
        }).then(function (response) {
            if(response.status === 200){
                context.showMessage("Participante agregado correctamente!", "success");
                if(onUpdate){
                    onUpdate();
                }
            }else{
                context.showMessage("Error al agregar el participante.", "error");
                console.error(response);
            }
        })
        .catch(function (error) {
            context.showMessage("Error al agregar el participante.", "error");
            console.error(error);
        })
    }

    const addParticipanteSecundario = (idParticipante, idMesa) => {
        axios.post("/api/mesas/add-participante-secundario",{
            idParticipante: idParticipante,
            idMesa: idMesa,
        }).then(function (response) {
            if(response.status === 200){
                context.showMessage("Participante Sec. agregado correctamente!", "success");
                if(onUpdate){
                    onUpdate();
                }
            }else{
                context.showMessage("Error al agregar el participante sec.", "error");
                console.error(response);
            }
        })
        .catch(function (error) {
            context.showMessage("Error al agregar el participante sec.", "error");
            console.error(error);
        })
    }

    const addMuestra = (idMuestra, idMesa) => {
        axios.post("/api/mesas/add-muestra",{
            idMuestra: idMuestra,
            idMesa: idMesa,
        }).then(function (response) {
            if(response.status === 200){
                context.showMessage("Muestra agregada correctamente!.", "success");
                if(onUpdate){
                    onUpdate();
                }
            }else{
                context.showMessage("Error al agregar la Muestra.", "error");
                console.error(response);
            }
        })
        .catch(function (error) {
            context.showMessage("Error al agregar la Muestra.", "error");
            console.error(error);
        })
    }

    const addCategoria = (idCategoria, idMesa) => {
        axios.post("/api/mesas/add-categoria",{
            idCategoria: idCategoria,
            idMesa: idMesa,
        }).then(function (response) {
            if(response.status === 200){
                context.showMessage("Categoría agregada correctamente!.", "success");
                if(onUpdate){
                    onUpdate();
                }
            }else{
                context.showMessage("Error al agregar la Categoría.", "error");
                console.error(response);
            }
        })
        .catch(function (error) {
            context.showMessage("Error al agregar la Categoría.", "error");
            console.error(error);
        })
    }
    const opacity = isDragging ? 0.4 : 1;

    return (<Box ref={drag} role="Box" sx={{ ...sx, opacity, cursor: "move" }} data-testid={`box-${name}`}>
        {children}
    </Box>);
}