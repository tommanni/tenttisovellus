import Button from '@mui/material/Button';
import { useContext } from 'react';
import { TenttiContext } from '../App';

const Header = () => {
    const tenttiContext = useContext(TenttiContext)
    return (
        <header>
            <nav className='nav'>
                <ul className='nav-items'>
                    <li className='tentteja'><Button style={{ color: '#fff' }} href="">TENTIT</Button></li>
                    <li className='tietoa'><Button style={{ color: '#fff' }} href="https://www.youtube.com/watch?v=sAqnNWUD79Q">TIETOA SOVELLUKSESTA</Button></li>
                    {tenttiContext.kirjauduttu && <li className='poistu'><Button onClick={() => tenttiContext.dispatch({ type: 'POISTU' })} style={{ color: "#fff" }} href="">POISTU</Button></li>}
                </ul>
            </nav>
        </header >
    )
}

export default Header