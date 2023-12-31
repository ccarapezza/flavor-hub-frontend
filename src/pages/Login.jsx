import {
  faCamera,
  faSquareFull,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Card, CardContent, CardHeader, IconButton, Stack } from "@mui/material"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import Loading from "../components/Loading"
import Context from "../context/Context"
import Page from "./Page"
import { QrScanner } from "@yudiel/react-qr-scanner" //import { QrReader } from "react-qr-reader";
import FacingMode from "../Constants"

export default function Login() {
  const context = useContext(Context)
  const navigate = useNavigate()
  const [camera, setCamera] = useState(FacingMode.ENVIRONMENT)
  const [loading, setLoading] = useState(false)

  const switchCamera = () => {
    setCamera(
      camera === FacingMode.ENVIRONMENT
        ? FacingMode.USER
        : FacingMode.ENVIRONMENT
    )
  }

  const handleScan = (data) => {
    if (data) {
      setLoading(true)
      context
        .participanteLogin(data)
        .catch(function (error) {
          context.showMessage(
            "No se ha encontrado el Participante. Contacte con el administrador.",
            "error"
          )
          navigate("/")
          console.error(error)
        })
        .then(function (response) {
          console.log(response)
          setLoading(false)
        })
    }
  }

  const handleError = (err) => {
    console.error(err)
  }

  return (
    <Page title="Ingresar Participante">
      <Stack>
          <Card>
            <CardHeader
              sx={{ pb: 0 }}
              subheader="Escaneé el código de su credencial para comenzar a calificar"
              action={
                <IconButton
                  type="button"
                  aria-label="settings"
                  onClick={() => {
                    switchCamera()
                  }}
                >
                  <span className="fa-layers fa-fw fa-2x fa-dark">
                    <FontAwesomeIcon icon={faCamera} />
                    <FontAwesomeIcon
                      icon={faSquareFull}
                      transform="shrink-4 down-1"
                    />
                    <FontAwesomeIcon
                      icon={faSyncAlt}
                      inverse
                      transform="shrink-8 down-1"
                    />
                  </span>
                </IconButton>
              }
            />
            <CardContent>
              {/* 
                <div>
                  <input type="text" value={hash} onChange={(e)=>{setHash(e.target.value)}} />
                  <button onClick={(e)=>{context.participanteLogin(hash)}}>Login</button>
                </div>
                <div>QR RESULT:{hash}</div>
                <div>{JSON.stringify(error)}</div>
              */}

              {!loading ? (
                <QrScanner
                  constraints={camera}
                  scanDelay={300}
                  onError={handleError}
                  onResult={handleScan}
                  containerStyle={{ width: "100%" }}
                />
              ) : (
                /*
                <QrReader
                  facingMode={camera}
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: "100%" }}
                  />
                */
                <Loading />
              )}
            </CardContent>
          </Card>
      </Stack>
    </Page>
  )
}
