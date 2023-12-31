import { useState } from "react"
import Page from "../Page"
import {
  Button,
  Chip,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Modal,
  Switch,
  Typography,
} from "@mui/material"
import { green, grey, red } from "@mui/material/colors"
import { Box } from "@mui/material"
import { useEffect } from "react"
import axios from "axios"
import Context from "../../context/Context"
import { useContext } from "react"

const styleDefault = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "85%",
  width: 350,
  bgcolor: "white",
  border: "1px solid #000",
  borderRadius: "5px",
  boxShadow: 24,
  pt: 2,
  px: 2,
  pb: 3,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}

export default function Configuration() {
  const context = useContext(Context)
  const [restriccionPorMesa, setRestriccionPorMesa] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const updateRestriccionPorMesa = () => {
    setLoading(true)
    axios
      .put("/api/admin/update-mesa-restricted", {
        value: (!restriccionPorMesa).toString(),
      })
      .then(function (response) {
        // handle success
        if (response.status === 200) {
          setRestriccionPorMesa(response.data?.value === "true")
        }
      })
      .catch(function (error) {
        context.showMessage("No se pudo obtener los dojos", "error")
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setLoading(true)
    axios
      .get("/api/admin/get-mesa-restricted")
      .then(function (response) {
        // handle success
        if (response.status === 200) {
          setRestriccionPorMesa(response.data?.value === "true")
        }
      })
      .catch(function (error) {
        context.showMessage("No se pudo obtener los dojos", "error")
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [context])

  return (
    <Page
      loading={loading}
      title="Configuración Global"
      footer={false}
      containerMaxWidth="xl"
    >
      {!loading && (
        <List subheader={<ListSubheader>Parámetros</ListSubheader>}>
          <ListItem
            key={"value"}
            secondaryAction={
              <FormControlLabel
                sx={{ color: restriccionPorMesa ? green[500] : grey[500] }}
                control={
                  <Switch
                    color="success"
                    checked={restriccionPorMesa}
                    onChange={() => {
                      setOpen(true)
                    }}
                    sx={{ color: red[500], mx: 0 }}
                  />
                }
                label={""}
              />
            }
          >
            <ListItemButton>
              <ListItemText
                primary={
                  <>
                    Restricción por mesa{" "}
                    {restriccionPorMesa ? (
                      <Chip
                        sx={{ ml: 2 }}
                        color="success"
                        size="small"
                        label="Activado"
                      />
                    ) : (
                      <Chip sx={{ ml: 2 }} size="small" label="Desactivado" />
                    )}
                  </>
                }
                secondary="Si esta opción está habilitada solo se permitirá la calificación según la mesa del participante, no podrá calificar muestras que se entreguen a otras mesas"
              />
            </ListItemButton>
          </ListItem>
        </List>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ ...styleDefault }}>
          <Typography variant="h6" sx={{ pb: 5, m: 1, p: 0 }}>
            Esta seguro que desea modificar el parámetro? Esto podría afectar el
            funcionamiento del sistema.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              color="error"
              variant="outlined"
              onClick={() => setOpen(false)}
            >
              No
            </Button>
            <Button
              color="success"
              variant="outlined"
              onClick={() => {
                updateRestriccionPorMesa()
                setOpen(false)
              }}
            >
              Si
            </Button>
          </Box>
        </Box>
      </Modal>
    </Page>
  )
}
