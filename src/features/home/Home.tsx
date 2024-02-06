import './Home.scss';
import { ReactTyped } from 'react-typed';

const Home = () => {

    const greetings = ['Hello', 'Hola', 'Bonjour', 'مرحبا', 'こんにちは',
    'ສະບາຍດີ', '안녕하세요', '你好', 'Salam', 'Xin chào'];

    return (
        <div className='home-container'>
            <div className='header-container'>
                <ReactTyped
                    strings={greetings}
                    typeSpeed={100}
                    backSpeed={100}
                    backDelay={1500}
                    className='introduction'
                    loop
                />
                <div className='introduction desktop'>
                    , I'm {' '}
                        <span className='gradient'>Chelsea</span>
                    {' '} -
                </div>
            </div>
            <div className='introduction mobile'>
                I'm {' '}
                    <span className='gradient'>Chelsea</span>
                {' '}
            </div>
            <div className='subintroduction'>
                a {' '}
                    <span className='gradient'>software developer</span>
                {' '} based in <br /> Dallas, TX.
            </div>
        </div>
    );
}

export default Home;