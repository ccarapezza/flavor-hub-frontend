import { Save } from "@mui/icons-material";
import { Button, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Context from "../../context/Context";
import Page from "../Page";

export default function CreateJurado() {
  let navigate = useNavigate();
  const context = useContext(Context);
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = () => {
    createJurado();
  };

  const createJurado = () => {
    axios.post("/api/participante/create-jurado",{
      name: nombre,
      dni: dni
    }).then(function (response) {
      if(response.status === 200){
        context.showMessage("Jurado creado correctamente!", "success");
        navigate("/participante/jurado-list");
      }else{
        context.showMessage("No se ha creado el Jurado. Contacte con el administrador.", "error");
        console.error(response);  
      }
    })
    .catch(function (error) {
      context.showMessage("No se ha creado el Jurado. Contacte con el administrador.", "error");
      console.error(error);
    })
  };

  return (
    <Page title="Nuevo Jurado" footer={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack width="100%" spacing={2}>
          <TextField {...register("name-input", { required: true })} error={errors["name-input"]} fullWidth id="name-input" label="Nombre" variant="outlined" value={nombre} onChange={(e)=>setNombre(e?.target?.value)} />
          <TextField type="number" {...register("dni-input", { required: true })} error={errors["dni-input"]} fullWidth id="dni-input" label="DNI" variant="outlined" value={dni} onChange={(e)=>setDni(e?.target?.value)} />
          <Button type="submit" size="large" color="primary" variant="contained" startIcon={<Save />}>
            Guardar
          </Button>
        </Stack>
      </form>
    </Page>
  );
}
