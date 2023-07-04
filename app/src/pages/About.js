import { Box } from '@mui/material';
import { ChangeTitle } from '../App';
import Navigation from '../components/Navigation';
import Socials from '../components/Socials';

const About = () => {
    ChangeTitle('About')
    return (
        <div>
            <Navigation />
            <Box
                sx={{
                    border: 1,
                    borderColor: 'red',
                }}
            >
                Hello
            </Box>
            <Socials />
        </div>
    );
}

export default About;