import { Box, Typography } from "@mui/material"
import { useContext } from "react"
import Context from "./context/Context"
import { useEffect } from "react"

export default function SplashScreen() {
  const context = useContext(Context)

  useEffect(() => {
    return () => {
        if(context.isShowSplashScreen){
            context.setIsShowSplashScreen(false)
        }
    }
  }, [context])

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
        backgroundColor: "#db4f4f"
      }}
      className={`animate__animated ${
        context.isShowSplashScreen
          ? ""
          : " animate__slideOutUp animate__delay-1s"
      }`}
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
