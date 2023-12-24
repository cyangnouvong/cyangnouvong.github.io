import { Box } from '@mui/material';
import { AiFillGithub, AiFillLinkedin, AiFillInstagram } from 'react-icons/ai'
import '../App.css'
import SocialMenu from './SocialMenu.tsx'

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
                {window.innerWidth >=  1000 && <a href='https://www.linkedin.com/in/cyangnouvong/' target='_blank'>
                    <AiFillLinkedin className="reactIcons" size={'3rem'} title='LinkedIn'/>
                </a>}
                {window.innerWidth >=  1000 && <a href='https://www.instagram.com/cdaoyang/' target='_blank'>
                    <AiFillInstagram className="reactIcons" size={'3rem'} title='Instagram'/>
                </a>}
                {window.innerWidth >=  1000 && <a href='https://github.com/cyangnouvong' target='_blank'>
                    <AiFillGithub className="reactIcons" size={'3rem'} title='GitHub'/>
                </a>}
                {window.innerWidth < 1000 && <SocialMenu />}
            </Box>
        </Box>
    );
}

export default Socials;