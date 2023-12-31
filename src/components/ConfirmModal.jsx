import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal, Typography } from '@mui/material'
import { Box } from '@mui/material'
import { useState } from 'react'
import PropTypes from 'prop-types';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
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

ConfirmModal.propTypes = {
    message: PropTypes.string,
    operation: PropTypes.func,
    faIcon: PropTypes.object,
    buttonColor: PropTypes.string,
}

export default function ConfirmModal({message, operation, faIcon, buttonColor="primary"}) {
    const [open, setOpen] = useState(false);

    return (<>
        <Button variant="outlined" color={buttonColor} onClick={()=>{setOpen(true)}} sx={{p: 1, m: 1}}>
            <FontAwesomeIcon icon={faIcon}/>
        </Button>
        <Modal open={open} onClose={()=>setOpen(false)} >
            <Box sx={{ ...style}}>
                {<Typography variant="h6" sx={{ pb: 5 }}>{message}</Typography>}
                <Box sx={{display:"flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Button color="error" variant="outlined" onClick={()=>setOpen(false)}>No</Button>
                    <Button color="success" variant="outlined" onClick={()=>{operation(); setOpen(false);}}>Si</Button>
                </Box>
            </Box>
        </Modal>
    </>)
}
