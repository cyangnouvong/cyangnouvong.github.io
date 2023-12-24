import { Box } from '@mui/material';
import { ChangeTitle } from '../App';
import Navigation from '../components/Navigation';
import Socials from '../components/Socials';
import self from '../images/self.jpg'
import '../App.css'

const About = () => {
    ChangeTitle('About')
    return (
        <div>
            <Navigation />
            <Box
                className='aboutPage'
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    height: '100vh',
                    marginLeft: '10vw',
                    marginRight: '10vw',
                    gap: '5vw',
                }}
            >
                <Box
                    component={'img'}
                    src={self}
                    width={{ xs: '10rem', sm: '15rem', md: '25rem' }}
                    height={{ xs: '10rem', sm: '15rem', md: '25rem' }}
                    borderRadius={'50%'}
                />
                <Box
                    sx={{
                        borderRadius: '1rem',
                        background: 'rgba(0, 0, 0, 0.22)',
                        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
                        WebkitBackdropFilter: 'blur(6px)',
                        padding: '0vw 2vw',
                    }}
                >
                    <p className='about'>
                    I graduated from the Georgia Institute of Technology with a Bachelor of Science in Computer Science. <br /><br />
                    During my free time, I love gaming, traveling, and drinking a good cup of coffee :{')'} <br /><br />
                    I’m interested in environments that cultivate creative thinking while focusing on equity and diversity.
                    </p>
                </Box>
            </Box>
            <Socials />
        </div>
    );
}

export default About;