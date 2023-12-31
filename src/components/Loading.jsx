import { faCannabis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Typography } from '@mui/material'
import { Box } from '@mui/material'

export default function Loading() {
    return (
        <Box sx={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
            <FontAwesomeIcon icon={faCannabis} className="fa-4x fa-spin"/>
            <Typography variant="h6" component="div">CARGANDO...</Typography>
        </Box>
    )
}
