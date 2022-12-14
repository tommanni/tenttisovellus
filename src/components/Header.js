import Button from '@mui/material/Button';
import { useContext } from 'react';
import { TenttiContext } from '../App';
import axios from 'axios';

const Header = () => {
    const { kirjauduttu, dispatch, tenttiDatat, kayttaja, setValue } = useContext(TenttiContext)

    const handlePoistuClick = async () => {
        const token = JSON.parse(localStorage.getItem(tenttiDatat.kayttaja.kayttajatunnus))
        try {
            console.log(token.refreshToken)
            const res = await axios.post('http://localhost:8080/kayttaja/poistu', {}, {
                headers: {
                    'Authorization': `Bearer ${token.token}`,
                    'content-type': 'application/json',
                    kayttajaId: tenttiDatat.kayttaja.id,
                    token: token.refreshToken
                }
            })
            console.log(res)
            dispatch({
                type: 'POISTU',
                payload: tenttiDatat.kayttaja
            })
            let result = await axios.get('http://localhost:8080/tentti/offline-data', { params: { kayttaja: kayttaja } });
            dispatch({ type: "ALUSTA_DATA", payload: { data: result.data, setValue: setValue } })
        } catch (err) {
            console.log('positutana')
            if (err.response.status === 403) {
                console.log('403 error')
                let tokens = JSON.parse(localStorage.getItem(tenttiDatat.kayttaja.kayttajatunnus))
                let newToken = await axios.post('http://localhost:8080/kayttaja/token',
                    { token: tokens.refreshToken }
                )
                localStorage.removeItem(tenttiDatat.kayttaja.kayttajatunnus);
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
                dispatch({
                    type: 'POISTU',
                    payload: tenttiDatat.kayttaja
                })
            }
        }
    }

    return (
        <header>
            <nav className='nav'>
                <ul className='nav-items'>
                    <li className='tentteja'><Button onClick={() => dispatch({ type: 'NAYTATENTIT' })} style={{ color: '#fff' }} href="">TENTIT</Button></li>
                    {kirjauduttu && <li ><Button onClick={() => dispatch({ type: 'NAYTAOPPILAAT' })} style={{ color: '#fff' }} href="">{kayttaja === 1 ? 'OPPILAAT' : 'SUORITUKSET'}</Button></li>}
                    <li className='tietoa'><Button style={{ color: '#fff' }} href="https://www.youtube.com/watch?v=sAqnNWUD79Q">TIETOA SOVELLUKSESTA</Button></li>
                    {kirjauduttu && <li className='poistu'><Button onClick={handlePoistuClick} style={{ color: "#fff" }} href="">POISTU</Button></li>}
                </ul>
            </nav>
        </header >
    )
}

export default Header