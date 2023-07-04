import { Box, Button, ThemeProvider, createTheme } from '@mui/material';
import { Link } from "react-router-dom";
import '../App.css';

const theme = createTheme({
    typography: {
        button: {
            fontSize: '1rem',
            color: 'white',
            fontFamily: ['Inter', 'sans-serif'].join(","),
            
        }
    }
});

const style = {
    '&.MuiButton-text': {
        color: 'white',
    },
};

const Navigation = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '3em',
                position: 'absolute',
                top: '1.5em',
                right:'3em',
            }}
        >
            <ThemeProvider theme={theme}>
                <Button variant='text' sx={style} component={Link} to='/'>Home</Button>
                <Button variant='text' sx={style} component={Link} to='/about'>About</Button>
                <Button variant='text' sx={style} component={Link} to='/Resume'>Resume</Button>
                <Button variant='text' sx={style} component={Link} to='/Contact'>Contact</Button>
            </ThemeProvider>
        </Box>
    );
}

export default Navigation;