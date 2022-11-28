import Button from '@mui/material/Button';
import { useContext } from 'react';
import { TenttiContext } from '../App';
import axios from 'axios';

const Header = () => {
    const { kirjauduttu, dispatch, tenttiDatat, kayttaja } = useContext(TenttiContext)

    const handlePoistuClick = async () => {
        const token = JSON.parse(localStorage.getItem(tenttiDatat.kayttaja.kayttajatunnus))
        try {
            await axios.post('http://localhost:8080/kayttaja/poistu', {
            }, {
                headers: {
                    'Authorization': `Bearer ${token.token}`,
                    'content-type': 'application/json',
                    kayttajaId: tenttiDatat.kayttaja.id,
                    token: token.refreshToken
                }
            })
            dispatch({
                type: 'POISTU',
                payload: tenttiDatat.kayttaja
            })
        } catch (err) {
            if (err.response.status === 403) {
                console.log('403 error')
                let tokens = JSON.parse(localStorage.getItem(tenttiDatat.kayttaja.kayttajatunnus))
                let newToken = await axios.post('http://localhost:8080/kayttaja/token',
                    { token: tokens.refreshToken }
                )
                localStorage.setItem(
                    tenttiDatat.kayttaja.kayttajatunnus,
                    { token: newToken.data.token, refreshToken: tokens.refreshToken }
                )
                await axios.post('http://localhost:8080/kayttaja/poistu', {
                }, {
                    headers: {
                        'Authorization': `Bearer ${newToken.data.token}`,
                        'content-type': 'application/json',
                        kayttajaId: tenttiDatat.kayttaja.id,
                        token: token.refreshToken
                    }
                }
                )
            }
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