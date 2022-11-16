import { useState } from "react"
import { useContext } from 'react';
import { TenttiContext } from '../App';
import axios from "axios";

const Kirjaudu = () => {
    const { dispatch, tenttiDatat, setValue } = useContext(TenttiContext)
    const [tunnus, setTunnus] = useState("")
    const [salasana, setSalasana] = useState("")

    async function lisaaKayttaja(e) {
        e.preventDefault()
        const isFound = tenttiDatat?.kayttajat?.some(kayttaja => {
            if (kayttaja.kayttajatunnus === tunnus) {
                return true
            }
            return false
        })
        if (!isFound && tenttiDatat.rekisteröidytään) {
            let data = await axios.post('http://localhost:8080/kayttaja/lisaa', { kayttajatunnus: tunnus, salasana: salasana })
            console.log(data.data.data.token)
            localStorage.setItem(tunnus, data.data.data.token)
            dispatch({
                type: 'LISAA_KAYTTAJA',
                payload: { kayttajatunnus: tunnus, salasana: salasana, admin: -1 }
            })
        } else if (isFound && tenttiDatat.rekisteröidytään) {
            alert('Käyttäjätunnus on varattu')
        }
        else {
            let token = localStorage.getItem(tunnus)
            console.log(token)
            let kayttaja = await axios.get('http://localhost:8080/kayttaja/hae', { params: { kayttajatunnus: tunnus } })
            console.log(kayttaja)
            kayttaja = kayttaja.data.kayttaja
            if (kayttaja === undefined) {
                alert('Käyttäjätunnus tai salasana on väärin')
                return
            }
            kayttaja.kirjauduttu = true
            kayttaja.salasana = salasana
            localStorage.setItem('kayttaja', JSON.stringify(kayttaja))
            await axios.post('http://localhost:8080/kayttaja/kirjaudu', { kayttaja: kayttaja })
            const result = await axios.get('http://localhost:8080/tentti', { params: { kayttaja: kayttaja } });
            dispatch({ type: "ALUSTA_DATA", payload: { data: result.data, setValue: setValue, kayttaja: kayttaja } })
            dispatch({
                type: 'KIRJAUDU',
                payload: { kayttaja: kayttaja, kayttajatunnus: tunnus, salasana: salasana, admin: -1, setValue: setValue }
            })
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
            <p className="otsikko">{tenttiDatat.rekisteröidytään ? "Rekisteröidy" : "Kirjaudu"}</p>
            <form>
                <label for='kayttajatunnus'>Käyttäjätunnus<br /></label>
                <input value={tunnus} onChange={handleTunnusChange} type='text' id="kayttajatunnus" /><br />
                <label for='salasana'>Salasana<br /></label>
                <input value={salasana} onChange={handleSalasanaChange} type='password' id="Salasana" /><br />
                <button onClick={(e) => { lisaaKayttaja(e) }}>{tenttiDatat.rekisteröidytään ? "Rekisteröidy" : "Kirjaudu"}</button>
            </form>
            {!tenttiDatat.rekisteröidytään && <button onClick={() => dispatch({ type: 'REKISTEROIDYTAAN' })}>Rekisteröidy</button>}
        </div >
    )
}

export default Kirjaudu