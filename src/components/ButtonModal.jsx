import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Modal } from '@mui/material'
import { useState } from 'react'
import PropTypes from 'prop-types';

const styleDefault = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: "85%",
    width: 350,
    bgcolor: 'white',
    border: '1px solid #000',
    borderRadius: '5px',
    boxShadow: 24,
    pt: 2,
    px: 2,
    pb: 3,
    display:"flex",
    flexDirection: "column",
    justifyContent: "space-between"
  };

ButtonModal.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    faIcon: PropTypes.object,
    textButton: PropTypes.string,
    buttonColor: PropTypes.string,
    operation: PropTypes.func,
    closeLabel: PropTypes.string,
    saveLabel: PropTypes.string,
    saveDisabled: PropTypes.bool,
    onClick: PropTypes.func,
    sx: PropTypes.object,
}

export default function ButtonModal({children, style, faIcon, textButton="", buttonColor="primary", operation, closeLabel="Cerrar", saveLabel="Guardar", saveDisabled=false, onClick=()=>{}, sx}) {
    const [open, setOpen] = useState(false);

    return (<>
        <Button variant="outlined" color={buttonColor} onClick={()=>{setOpen(true); onClick();}} sx={{...sx, p: 1, m: 1}}>
            <FontAwesomeIcon icon={faIcon}/>{textButton&&<span style={{ marginLeft: 5 }}>{textButton}</span>}
        </Button>
        <Modal open={open} onClose={()=>setOpen(false)} >
            <Box sx={{ ...styleDefault, ...style}}>
                {children}
                <Box sx={{display:"flex", flexDirection: "row", justifyContent: "space-between", mt: 2 }}>
                    <Button color="error" variant="outlined" onClick={()=>{setOpen(false)}}>{closeLabel}</Button>
                    <Button color="success" disabled={saveDisabled} variant="outlined" onClick={()=>{operation(); setOpen(false);}}>{saveLabel}</Button>
                </Box>
            </Box>
        </Modal>
    </>)
}
