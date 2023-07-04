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
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: '100vh',
                    marginLeft: '10rem',
                    marginRight: '10rem',
                    gap: '5rem',
                }}
            >
                <Box
                    component={'img'}
                    src={self}
                    width={{ xs: '5vh', md: '55vh' }}
                    height={{ xs: '5vh', md: '55vh' }}
                    borderRadius={'50%'}
                />
                <Box
                    sx={{
                        borderRadius: '1rem',
                        background: 'rgba(0, 0, 0, 0.22)',
                        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
                        WebkitBackdropFilter: 'blur(6px)',
                        padding: '0rem 3rem',
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