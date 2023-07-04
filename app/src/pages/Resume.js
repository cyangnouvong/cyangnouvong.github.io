import Navigation from '../components/Navigation';
import Socials from '../components/Socials';
import { ChangeTitle } from '../App';

const Resume = () => {
    ChangeTitle('Resume');
    return (
        <div>
            <Navigation />
            <Socials />
        </div>
    );
}

export default Resume;