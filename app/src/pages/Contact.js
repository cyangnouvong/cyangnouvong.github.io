import Navigation from '../components/Navigation';
import Socials from '../components/Socials';
import { ChangeTitle } from '../App';

const Contact = () => {
    ChangeTitle('Let\'s Connect');
    return (
        <div>
            <Navigation />
            <Socials />
        </div>
    );
}

export default Contact;