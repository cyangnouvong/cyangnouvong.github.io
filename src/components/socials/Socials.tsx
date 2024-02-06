import { AiFillGithub, AiFillLinkedin, AiFillInstagram } from 'react-icons/ai'
import './Socials.scss';

const Socials = () => {
    return (
        <div className='social-container'>
            <div className='social-container'>
                <a href='https://www.linkedin.com/in/cyangnouvong/' target='_blank' rel='noreferrer'>
                    <AiFillLinkedin className='icon' size={'2.5rem'} title='LinkedIn'/>
                </a>
                <a href='https://www.instagram.com/cdaoyang/' target='_blank' rel='noreferrer'>
                    <AiFillInstagram className='icon' size={'2.5rem'} title='Instagram'/>
                </a>
                <a href='https://github.com/cyangnouvong' target='_blank' rel='noreferrer'>
                    <AiFillGithub className='icon' size={'2.5rem'} title='GitHub'/>
                </a>
            </div>
        </div>
    );
}

export default Socials;