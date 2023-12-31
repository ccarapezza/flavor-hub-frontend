import { Box, Typography } from "@mui/material"
import { useEffect } from "react"

export default function SplashScreen() {
  useEffect(() => {
    
  }, [])

  return (
    <Box sx={
        {
            height: "100vh",
            width: "100vw",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            backgroundColor: "#FFF",
            borderBottom: "2px solid #000",
        }
    }
    className="animate__animated animate__slideOutUp animate__delay-5s"
    >
        <Box className="animate__animated animate__pulse animate__infinite"
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <img src="/vite.svg" alt="logo" style={{height: "50vh"}} />
            <Typography padding={5}>CARGANDO</Typography>
        </Box>
    </Box>
  )
}
