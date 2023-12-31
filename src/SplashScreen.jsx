import { Box, Typography } from "@mui/material"
import { useEffect } from "react"

export default function SplashScreen() {
  useEffect(() => {}, [])

  return (
    <Box
      sx={{
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
        backgroundColor: "#db4f4f",
        borderBottom: "2px solid #000",
      }}
      className="animate__animated animate__slideOutUp animate__delay-5s"
    >
      <Box
        className="animate__animated animate__pulse animate__infinite"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src="/logo.png" alt="logo" style={{ height: "50vh" }} />
      </Box>
      <Typography
        className="animate__animated animate__flash animate__infinite"
        padding={2}
        sx={{
          fontVariant: "small-caps",
          fontWeight: "bold",
          fontSize: "2rem",
          color: "#ffb500",
          textShadow: "2px 2px 2px #1e4900",
        }}
      >
        CARGANDO
      </Typography>
      <Box
        sx={{
          backgroundColor: "#007327",
          boxShadow: "2px 2px 2px #002c01",
          borderRadius: "5px",
          marginTop: "2rem",
        }}
      ></Box>
    </Box>
  )
}
