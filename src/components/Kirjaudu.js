import { useState } from "react"
import { useContext } from 'react';
import { TenttiContext } from '../App';
import axios from "axios";

const Kirjaudu = () => {
    const { dispatch, tenttiDatat, setValue } = useContext(TenttiContext)
    const [tunnus, setTunnus] = useState("")
    const [salasana, setSalasana] = useState("")

    async function kirjaudu(e) {
        e.preventDefault()
        let token = localStorage.getItem(tunnus)
        let kayttaja = await axios.get('http://localhost:8080/kayttaja/hae', { params: { kayttajatunnus: tunnus, salasana: salasana } })
        kayttaja = kayttaja.data.kayttaja
        if (kayttaja === undefined) {
            alert('Käyttäjätunnus tai salasana on väärin')
            return
        }
        kayttaja.kirjauduttu = true
        kayttaja.salasana = salasana
        localStorage.setItem('kayttaja', JSON.stringify(kayttaja))
        let data = await axios.post('http://localhost:8080/kayttaja/kirjaudu', { kayttaja: kayttaja })
        localStorage.setItem(tunnus, JSON.stringify({ token: data.data.data.token, refreshToken: data.data.data.refreshToken }))
        let result;
        try {
            result = await axios.get('http://localhost:8080/tentti', {
                headers: {
                    'Authorization': `Bearer ${token?.token}`,
                    'content-type': 'application/json',
                    kayttaja: kayttaja
                }
            }, { params: { kayttaja: kayttaja } });
            dispatch({ type: "ALUSTA_DATA", payload: { data: result.data, setValue: setValue, kayttaja: kayttaja } })
            dispatch({
                type: 'KIRJAUDU',
                payload: { kayttaja: kayttaja, kayttajatunnus: tunnus, salasana: salasana, admin: -1, setValue: setValue }
            })
        } catch (err) {
            if (err.response?.status === 403) {
                let tokens = JSON.parse(localStorage.getItem(tenttiDatat.kayttaja.kayttajatunnus))
                let newToken = await axios.post('http://localhost:8080/kayttaja/token',
                    { token: tokens.refreshToken }
                )
                localStorage.setItem(
                    tenttiDatat.kayttaja.kayttajatunnus,
                    { token: newToken.data.token, refreshToken: tokens.refreshToken }
                )
                result = await axios.get('http://localhost:8080/tentti', {
                    headers: {
                        'Authorization': `Bearer ${newToken.data.token}`,
                        'content-type': 'application/json',
                        kayttaja: kayttaja
                    }
                }, { params: { kayttaja: kayttaja } });
                dispatch({ type: "ALUSTA_DATA", payload: { data: result.data, setValue: setValue, kayttaja: kayttaja } })
                dispatch({
                    type: 'KIRJAUDU',
                    payload: { kayttaja: kayttaja, kayttajatunnus: tunnus, salasana: salasana, admin: -1, setValue: setValue }
                })
            } else {
                console.log('error:', err)
            }
        }
    }

    const handleTunnusChange = (e) => {
        setTunnus(e.target.value)
    }
    const handleSalasanaChange = (e) => {
        setSalasana(e.target.value)
    }

    return (
        <div>
            <p className="otsikko">Kirjaudu</p>
            <form>
                <label for='kayttajatunnus'>Käyttäjätunnus<br /></label>
                <input value={tunnus} onChange={handleTunnusChange} type='text' id="kayttajatunnus" /><br />
                <label for='salasana'>Salasana<br /></label>
                <input value={salasana} onChange={handleSalasanaChange} type='password' id="Salasana" /><br />
                <button onClick={(e) => { kirjaudu(e) }}>Kirjaudu</button>
            </form>
            <button onClick={() => dispatch({ type: 'REKISTEROIDYTAAN' })}>Rekisteröidy</button>
        </div >
    )
}

export default Kirjaudu