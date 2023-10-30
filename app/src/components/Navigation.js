import { Box, Button, ThemeProvider, createTheme } from '@mui/material';
import { Link } from "react-router-dom";
import '../App.css';
import C from '../images/C.png'

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
                position: 'fixed',
                top: '1.5em',
                right:'3em',
            }}
        >
            <Box
                component={'img'}
                src={C}
                width={{ xs: '5vh', md: '7vh' }}
                height={{ xs: '5vh', md: '7vh' }}
                borderRadius={'50%'}
            />
            <ThemeProvider theme={theme}>
                <Button variant='text' sx={style} component={Link} to='/'>Home</Button>
                <Button variant='text' sx={style} component={Link} to='/about'>About</Button>
                <Button variant='text' sx={style} component={Link} to='/resume'>Resume</Button>
            </ThemeProvider>
        </Box>
    );
}

export default Navigation;