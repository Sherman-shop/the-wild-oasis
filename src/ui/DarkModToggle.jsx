import ButtonIcon from './ButtonIcon.jsx';  
import { HiOutlineMoon } from 'react-icons/hi';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import { HiOutlineSun } from 'react-icons/hi';




function DarkModToggle() {
    const {isDarkMode, toggleDarkMode} = useDarkMode();
    return (
        <ButtonIcon onClick={toggleDarkMode}>
           {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
        </ButtonIcon>
    );
}


export default DarkModToggle;