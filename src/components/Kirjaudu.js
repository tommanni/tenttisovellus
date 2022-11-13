import { useState } from "react"
import { useContext } from 'react';
import { TenttiContext } from '../App';
import axios from "axios";

const Kirjaudu = () => {
    const { rekisteröidytään, dispatch, tenttiDatat } = useContext(TenttiContext)
    const [tunnus, setTunnus] = useState("")
    const [salasana, setSalasana] = useState("")

    async function lisaaKayttaja() {
        const isFound = tenttiDatat.kayttajat.some(kayttaja => {
            if (kayttaja.kayttajatunnus === tunnus) {
                return true
            }
            return false
        })
        if (!isFound && rekisteröidytään) {
            await axios.post('http://localhost:8080/kayttaja/lisaa', { kayttajatunnus: tunnus, salasana: salasana })
            await axios.post('http://localhost:8080/kayttaja/rekisteroidytaan', { data: false })
            dispatch({
                type: 'LISAA_KAYTTAJA',
                payload: { kayttajatunnus: tunnus, salasana: salasana, admin: -1 }
            })
        } else if (isFound && rekisteröidytään) {
            alert('Käyttäjätunnus on varattu')
        }
        else {
            let kayttaja = tenttiDatat.kayttajat.filter(kayttaja => kayttaja.kayttajatunnus === tunnus && kayttaja.salasana === salasana)
            if (kayttaja.length === 0) {
                alert('Käyttäjätunnus tai salasana on väärin')
                return
            }
            await axios.post('http://localhost:8080/kayttaja/kirjaudu', { kayttaja: kayttaja[0] })
            dispatch({
                type: 'KIRJAUDU',
                payload: { kayttajatunnus: tunnus, salasana: salasana, admin: -1 }
            })
        }
    }

    const handleRekisteroidytaan = async () => {
        await axios.put('http://localhost:8080/kayttaja/rekisteroidytaan', { data: true })
        dispatch({ type: 'REKISTEROIDYTAAN' })
    }


    const handleTunnusChange = (e) => {
        setTunnus(e.target.value)
    }
    const handleSalasanaChange = (e) => {
        setSalasana(e.target.value)
    }

    return (
        <div>
            <p className="otsikko">{rekisteröidytään ? "Rekisteröidy" : "Kirjaudu"}</p>
            <form>
                <label for='kayttajatunnus'>Käyttäjätunnus<br /></label>
                <input value={tunnus} onChange={handleTunnusChange} type='text' id="kayttajatunnus" /><br />
                <label for='salasana'>Salasana<br /></label>
                <input value={salasana} onChange={handleSalasanaChange} type='password' id="Salasana" /><br />
                <button onClick={() => lisaaKayttaja()}>{rekisteröidytään ? "Rekisteröidy" : "Kirjaudu"}</button>
            </form>
            {!rekisteröidytään && <button onClick={() => handleRekisteroidytaan()}>Rekisteröidy</button>}
        </div >
    )
}

export default Kirjaudu