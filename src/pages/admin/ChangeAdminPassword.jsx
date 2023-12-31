import axios from "axios";
import { useContext, useState } from "react";
import Page from "../Page";
import { useForm } from "react-hook-form";
import Context from "../../context/Context";
import { Button, Stack, TextField } from "@mui/material";

export default function ChangeAdminPassword() {
  const context = useContext(Context);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = () => {
    if(password===repeatPassword){
      axios.put("/api/auth/update-admin-password",{
        oldPassword: oldPassword,
        password: password,
      })
      .then(function (response) {
        if(response.status === 200){
          context.showMessage("Password actualizado","success");
          setOldPassword("");
          setPassword("");
          setRepeatPassword("");
        }
      })
      .catch(function (error) {
        context.showMessage(error.response?.data?.message?error.response?.data?.message:"No se pudo actualizar el password","error");
        console.log(error);
      })
    }else{
      context.showMessage("Las contraseñas no coinciden","error");
    }
  };

  return (
    <Page title="Cambio de contraseña" footer={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack width="100%" spacing={2}>
          <TextField {...register("oldPassword", { required: true })} error={errors.oldPassword} fullWidth id="old-password-input" label="Contraseña actual" variant="outlined" value={oldPassword} onChange={(e)=>setOldPassword(e?.target?.value)} />
          <TextField {...register("password", { required: true })} error={errors.password} type="password" fullWidth id="password-input" label="Contraseña" variant="outlined" value={password} onChange={(e)=>setPassword(e?.target?.value)} />
          <TextField {...register("repeatPassword", { required: true })} error={errors.password} type="password" fullWidth id="repeat-password-input" label="Reingrese Contraseña" variant="outlined" value={repeatPassword} onChange={(e)=>setRepeatPassword(e?.target?.value)} />
          <Button type="submit" size="large" color="primary" variant="contained">
            Modificar Constraseña
          </Button>
        </Stack>
      </form>
    </Page>
  );
}
