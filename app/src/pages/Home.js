import { Box } from '@mui/material';
import Typewriter from 'typewriter-effect';
import { ChangeTitle } from '../App';
import Navigation from '../components/Navigation';
import Socials from '../components/Socials';
import '../App.css'

const greetings = ['Hello', 'Hola', 'Hallo', 'Bonjour', 'مرحبا', 'こんにちは',
    'ສະບາຍດີ', '안녕하세요', '你好', '哈囉', 'Здравствуйте', 'Salam', 'Xin chào'];

const Home = () => {
    ChangeTitle("Chelsea Yangnouvong [WIP]");
    return (
        <div>
            <Navigation />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '50vh',
                    marginLeft: '5rem',
                    marginRight: '5rem',
                    marginTop: '10rem',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        flexFlow: 'row wrap',

                }}>
                    <Typewriter
                        options={{
                            loop: true,
                            autoStart: true,
                            pauseFor: 1500,
                            deleteSpeed: 100,
                            strings: greetings,
                            wrapperClassName: 'introduction',
                            cursorClassName: 'introduction',
                        }}
                    />
                    <h1 className='introduction'>
                        , I'm {' '}
                            <span className='gradient'>Chelsea</span>
                        {' '} -
                    </h1>
                </Box>
                <h1 className='subIntroduction'>
                    a {' '}
                        <span className='gradient'>software developer</span>
                    {' '} based in <br /> Atlanta, GA.
                </h1>
            </Box>
            <Socials />
        </div>
    );
}

export default Home;