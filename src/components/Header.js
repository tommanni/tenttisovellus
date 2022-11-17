import Button from '@mui/material/Button';
import { useContext } from 'react';
import { TenttiContext } from '../App';
import axios from 'axios';

const Header = () => {
    const { kirjauduttu, dispatch, tenttiDatat, kayttaja } = useContext(TenttiContext)

    const handlePoistuClick = async () => {
        try {
            const token = JSON.parse(localStorage.getItem(tenttiDatat.kayttaja.kayttajatunnus))
            await axios.post('http://localhost:8080/kayttaja/poistu', { kayttajaId: tenttiDatat.kayttaja.id, token: token.refreshToken })
            dispatch({ type: 'POISTU', payload: tenttiDatat.kayttaja })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <header>
            <nav className='nav'>
                <ul className='nav-items'>
                    <li className='tentteja'><Button onClick={() => dispatch({ type: 'NAYTATENTIT' })} style={{ color: '#fff' }} href="">TENTIT</Button></li>
                    {kayttaja === 1 && kirjauduttu && <li ><Button onClick={() => dispatch({ type: 'NAYTAOPPILAAT' })} style={{ color: '#fff' }} href="">OPPILAAT</Button></li>}
                    <li className='tietoa'><Button style={{ color: '#fff' }} href="https://www.youtube.com/watch?v=sAqnNWUD79Q">TIETOA SOVELLUKSESTA</Button></li>
                    {kirjauduttu && <li className='poistu'><Button onClick={handlePoistuClick} style={{ color: "#fff" }} href="">POISTU</Button></li>}
                </ul>
            </nav>
        </header >
    )
}

export default Header