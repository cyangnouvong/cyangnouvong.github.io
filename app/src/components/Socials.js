import { Box } from '@mui/material';
import { AiFillGithub, AiFillLinkedin, AiFillInstagram } from 'react-icons/ai'
import '../App.css'

const Socials = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: '0.5em',
                right: '0.5em',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1em',
                }}
            >
                <a href='https://www.linkedin.com/in/cyangnouvong/' target='_blank'>
                    <AiFillLinkedin className="reactIcons" size={'3em'}/>
                </a>
                <a href='https://www.instagram.com/cdaoyang/' target='_blank'>
                    <AiFillInstagram className="reactIcons" size={'3em'}/>
                </a>
                <a href='https://github.com/cyangnouvong' target='_blank'>
                    <AiFillGithub className="reactIcons" size={'3em'}/>
                </a>
            </Box>
        </Box>
    );
}

export default Socials;