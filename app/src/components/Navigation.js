import { Box, Button, ThemeProvider, createTheme } from '@mui/material';
import { Link } from "react-router-dom";
import '../App.css';
import logo from '../images/C.png'

const theme = createTheme({
    typography: {
        button: {
            fontSize: '1rem',
            color: 'white',
            fontFamily: ['Inter', 'sans-serif'].join(","),
            maxHeight: '2.5rem',
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
        <div className='navigation'>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '4vw',
                    position: 'fixed',
                    top: '1.5em',
                    alignItems: 'center'
                }}
            >
                <Box
                    component={'img'}
                    src={logo}
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
        </div>
    );
}

export default Navigation;