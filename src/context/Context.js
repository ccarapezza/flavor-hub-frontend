/* eslint-disable no-unused-vars */
import { createContext } from "react";
const initial = {   
    userData: { },
    isLogged: false,
    participanteData: { },
    isJuradoLogged: false,
    isParticipanteLogged: false,
    showMessage: (message, severity = "info") => { },
    login: (username, password) => { },
    logout: () => { },
    participanteLogin: (hash) => {}
}

const Context = createContext(initial);
export default Context;