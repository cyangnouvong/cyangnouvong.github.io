import Navigation from '../components/Navigation';
import Socials from '../components/Socials';
import { ChangeTitle } from '../App';
import resume from '../assets/Resume.pdf';
import { Box } from '@mui/material';

const Resume = () => {
    ChangeTitle('Resume');
    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh'}}>
            <Navigation />
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            {window.innerWidth >= 1000 && <Box
                sx={{
                    width: '80vw',
                    height: '70vh',
                }}
            >
                <iframe src={resume} width='100%' height='100%'></iframe>
            </Box>}
            {window.innerWidth < 1000 && <Box
                sx={{
                    width: '80vw',
                    height: '60vh',
                }}
            >
                <iframe src={resume} width='100%' height='100%'></iframe>
            </Box>}
            <Socials />
        </div>
        </div>
    );
}

export default Resume;