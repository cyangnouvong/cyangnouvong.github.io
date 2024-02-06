import React, { useState, KeyboardEvent, MouseEvent } from 'react';
import { Button, Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { AiOutlineMenu } from 'react-icons/ai';
import { AiOutlineGithub, AiOutlineLinkedin, AiOutlineInstagram, AiOutlineHome, AiOutlineUser, AiOutlineFileText } from 'react-icons/ai'
import './Navigation.scss';
import logo from '../../assets/logo.png';

const navigationList = [
    <AiOutlineHome size={'1.2rem'} />, 
    <AiOutlineUser size={'1.2rem'}/>, 
    <AiOutlineFileText size={'1.2rem'}/>
];

const socialList = [
    <AiOutlineLinkedin size={'1.2rem'} />,
    <AiOutlineInstagram size={'1.2rem'} />,
    <AiOutlineGithub size={'1.2rem'} />
];

const socialLinks = [
    'https://www.linkedin.com/in/cyangnouvong/',
    'https://www.instagram.com/cdaoyang/',
    'https://github.com/cyangnouvong'
]

const Navigation = () => {
    const [state, setState] = useState(false);

    const style = {
        '&.MuiButton-text': {
            color: 'white',
        },
    };

    const toggleDrawer = (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as KeyboardEvent).key === 'Tab' ||
            (event as KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
            setState(open);
    };

    const list = () => {
        return (
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <List>
                    {['Home', 'About', 'Resume'].map((text, index) => (
                        <ListItem className='text' key={text} disablePadding component={Link} to={text === 'Home' ? '/' : '/' + text.toLowerCase()}>
                            <ListItemButton>
                                <ListItemIcon>
                                    {navigationList[index]}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['LinkedIn', 'Instagram', 'GitHub'].map((text, index) => (
                    <ListItem className='text' key={text} disablePadding component={'a'} href={socialLinks[index]}>
                        <ListItemButton>
                        <ListItemIcon>
                            {socialList[index]}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>
            </Box>
        );
    };

    return (
        <>
            <div className='nav-container desktop'>
                <Box
                    component={'img'}
                    src={logo}
                    width={'4rem'}
                    height={'4rem'}
                />
                <Button variant='text' sx={style} component={Link} to='/'>Home</Button>
                <Button variant='text' sx={style} component={Link} to='/about'>About</Button>
                <Button variant='text' sx={style} component={Link} to='/resume'>Resume</Button>
            </div>
            <div className='nav-container mobile'>
                <div className='burger'>
                    {(['left'] as const).map((anchor) => (
                        <div>
                        <Button onClick={toggleDrawer(true)}><AiOutlineMenu className='icon' size={'2em'} /></Button>
                        <Drawer
                            anchor={anchor}
                            open={state}
                            onClose={toggleDrawer(false)}
                        >
                            {list()}
                        </Drawer>
                        </div>
                    ))}
                </div>
                <div className='logo'>
                    <Box
                        component={'img'}
                        src={logo}
                        width={'3rem'}
                        height={'3rem'}
                    />
                </div>
            </div>
        </>
    );
}

export default Navigation;