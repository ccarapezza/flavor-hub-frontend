import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Calificacion from "../pages/calificacion/Calificacion";
import CreateParticipante from "../pages/participante/CreateParticipante";
import ListParticipante from "../pages/participante/ListParticipante";
import AdminLogin from "../pages/AdminLogin";
import Context from "../context/Context";
import NotFoundPage from "../pages/NotFoundPage";
import Resultados from "../pages/calificacion/Resultados";
import QrListParticipantes from "../pages/participante/QrListParticipantes";
import QrListMuestra from "../pages/participante/QrListMuestra";
import MesasManager from "../pages/mesa/MesasManager";
import EditParticipante from "../pages/participante/EditParticipante";
import ConsultaCalificacion from "../pages/calificacion/ConsultaCalificacion";
import ListDojo from "../pages/dojo/ListDojo";
import ListCategoria from "../pages/categoria/ListCategoria";
import Summary from "../pages/Summary";
import CreateJurado from "../pages/participante/CreateJurado";
import ListJurado from "../pages/participante/ListJurado";
import SummaryCalificaciones from "../pages/SummaryCalificaciones";
import ListMuestra from "../pages/muestra/ListMuestra";
import ChangeAdminPassword from "../pages/admin/ChangeAdminPassword";
import Configuration from "../pages/admin/Configuration";
import ServerDownPage from "../pages/ServerDownPage";

export default function DynamicRoutes() {
  const context = useContext(Context);

  if (!context.isLogged&&!context.isParticipanteLogged&&!context.isJuradoLogged) {
    return (
      <Routes>
          <Route path="/admin" Component={AdminLogin}/>
          <Route path="/login" Component={Login}/>
          <Route path="/server-down" Component={ServerDownPage}/>
          <Route exact path="/" Component={Home}/>
          <Route path="*" component={NotFoundPage} />
      </Routes>
    );
  }

  if (context.isLogged&&!context.isParticipanteLogged&&!context.isJuradoLogged) {
    return (
      <Routes>
          <Route path="/participante/create" Component={CreateParticipante} />
          <Route path="/participante/create-jurado" Component={CreateJurado} />
          <Route path="/participante/jurado-list" Component={ListJurado} />
          <Route path="/participante/edit/:id?" Component={EditParticipante} />
          <Route path="/calificaciones/resultados" Component={Resultados} />
          <Route path="/calificaciones/muestra" Component={ConsultaCalificacion} />
          <Route path="/participante/list" Component={ListParticipante} />
          <Route path="/dojo/list" Component={ListDojo} />
          <Route path="/categoria/list" Component={ListCategoria} />
          <Route path="/participante/qr-list" Component={QrListParticipantes} />
          <Route path="/summary-calificaciones" Component={SummaryCalificaciones} />
          <Route path="/muestra/list" Component={ListMuestra} />
          <Route path="/muestra/qr-list" Component={QrListMuestra} />
          <Route path="/summary" Component={Summary} />
          <Route path="/mesas-manager" Component={MesasManager} />
          <Route path="/change-admin-pass" Component={ChangeAdminPassword} />
          <Route path="/config" Component={Configuration} />
          <Route path="/server-down" Component={ServerDownPage} />
          <Route exact path="/" Component={Home} />
          <Route path="*" component={NotFoundPage} />
      </Routes>
    );
  }

  if (context.isParticipanteLogged&&!context.isJuradoLogged) {
    return (
      <Routes>
        <Route path="/calificacion/:calificacionHash?" Component={Calificacion} />
        <Route path="/login" Component={Login}/>
        <Route path="/server-down" Component={ServerDownPage}/>
        <Route exact path="/" Component={Home}/>
        <Route path="*" component={NotFoundPage} />
      </Routes>
    );
  }

  if (context.isJuradoLogged) {
    return (
      <Routes>
        <Route path="/calificaciones/muestra" Component={ConsultaCalificacion} />
        <Route path="/calificacion/:calificacionHash?" Component={Calificacion} />
        <Route path="/login" Component={Login}/>
        <Route path="/server-down" Component={ServerDownPage}/>
        <Route exact path="/" Component={Home}/>
        <Route path="*" component={NotFoundPage} />
      </Routes>
    );
  }
}
