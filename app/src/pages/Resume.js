import Navigation from '../components/Navigation';
import Socials from '../components/Socials';
import { ChangeTitle } from '../App';
import resume from '../assets/Resume.pdf';
import { Box } from '@mui/material';

const Resume = () => {
    ChangeTitle('Resume');
    return (
        <div>
            <Navigation />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '80vh',
                    marginLeft: '10rem',
                    marginRight: '10rem',
                    marginTop: '7rem',
                    gap: '5rem',
                }}
            >
                <iframe src={resume} width='100%' height='100%'></iframe>
            </Box>
            <Socials />
        </div>
    );
}

export default Resume;