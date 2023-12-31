import { Divider, Paper } from "@mui/material";
import { useDrop } from "react-dnd";
import { yellow } from '@mui/material/colors';
import PropTypes from 'prop-types';

DropBox.propTypes = {
    name: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    data: PropTypes.object,
    children: PropTypes.node.isRequired,
    sx: PropTypes.object,
};

export  default function DropBox({ name, children, sx, displayName, data }) {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: "box",
        drop: () => ({ name: name, data: data }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));
    const isActive = canDrop && isOver;
    let backgroundColor = '#fff';
    if (isActive) {
        backgroundColor = yellow[500];
    }
    else if (canDrop) {
        backgroundColor = yellow[100];
    }
    return (<Paper ref={drop} role={name} sx={{ ...sx, backgroundColor, borderColor:"#000" }} variant="outlined">
                <Divider><h3 style={{margin:10}}>{displayName}</h3></Divider>
                {children}
            </Paper>);
}