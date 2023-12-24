import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'
import { AiOutlineMenu } from "react-icons/ai";
import '../App.css'

const SocialMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{ color: 'white' }}
      >
        <AiOutlineMenu size={'2em'} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem href="https://www.linkedin.com/in/cyangnouvong/" target="_blank" component="a" onClick={handleClose}>LinkedIn</MenuItem>
        <MenuItem href="https://www.instagram.com/cdaoyang/" target="_blank" component="a" onClick={handleClose}>Instagram</MenuItem>
        <MenuItem href="https://github.com/cyangnouvong/" target="_blank" component="a" onClick={handleClose}>GitHub</MenuItem>
      </Menu>
    </div>
  );
}

export default SocialMenu;