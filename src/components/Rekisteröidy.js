import { useState } from "react"
import { useContext } from 'react';
import { TenttiContext } from '../App';
import axios from "axios";

const Rekisteröidy = () => {
    const { dispatch, tenttiDatat, setValue } = useContext(TenttiContext)
    const [tunnus, setTunnus] = useState("")
    const [salasana, setSalasana] = useState("")

    async function rekisteröidy(e) {
        e.preventDefault()
        const isFound = tenttiDatat?.kayttajat?.some(kayttaja => {
            if (kayttaja.kayttajatunnus === tunnus) {
                return true
            }
            return false
        })
        if (!isFound) {
            await axios.post('http://localhost:8080/kayttaja/lisaa', { kayttajatunnus: tunnus, salasana: salasana })
            dispatch({
                type: 'LISAA_KAYTTAJA',
                payload: { kayttajatunnus: tunnus, salasana: salasana, admin: -1 }
            })
        } else {
            alert('Käyttäjätunnus on varattu')
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
            <p className="otsikko">Rekisteröidy</p>
            <form>
                <label for='kayttajatunnus'>Käyttäjätunnus<br /></label>
                <input value={tunnus} onChange={handleTunnusChange} type='text' id="kayttajatunnus" /><br />
                <label for='salasana'>Salasana<br /></label>
                <input value={salasana} onChange={handleSalasanaChange} type='password' id="Salasana" /><br />
                <button onClick={(e) => { rekisteröidy(e) }}>Rekisteröidy</button>
            </form>
            <button onClick={() => dispatch({ type: 'REKISTEROIDYTAAN' })}>Kirjaudu</button>
        </div >
    )
}

export default Rekisteröidy