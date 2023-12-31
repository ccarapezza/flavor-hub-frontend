import { Button, Stack, TextField } from "@mui/material";
import { useContext, useState } from "react";
import Context from "../context/Context";
import Page from "./Page";
import { useForm } from "react-hook-form";

export default function AdminLogin() {
  const contex = useContext(Context);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = () => {
    contex.login(username, password);
  };

  return (
    <Page title="Ingreso Administrador" footer={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack width="100%" spacing={2}>
          <TextField {...register("username", { required: true })} error={errors.username} fullWidth id="name-input" label="Usuario" variant="outlined" value={username} onChange={(e)=>setUsername(e?.target?.value)} />
          <TextField {...register("password", { required: true })} error={errors.password} type="password" fullWidth id="password-input" label="Contraseña" variant="outlined" value={password} onChange={(e)=>setPassword(e?.target?.value)} />
          <Button type="submit" size="large" color="primary" variant="contained">
            Iniciar Sesión
          </Button>
        </Stack>
      </form>
    </Page>
  );
}
