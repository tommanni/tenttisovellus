import { useState } from "react"
import { useContext } from 'react';
import { TenttiContext } from '../App';
import axios from "axios";

const Kirjaudu = () => {
    const { rekisteröidytään, dispatch } = useContext(TenttiContext)
    const [tunnus, setTunnus] = useState("")
    const [salasana, setSalasana] = useState("")

    async function lisaaKayttaja() {
        try {
            await axios.post('http://localhost:8080/lisaa-kayttaja', { kayttajatunnus: tunnus, salasana: salasana })
            dispatch({
                type: rekisteröidytään ? 'LISAA_KAYTTAJA' : 'KIRJAUDU',
                payload: { kayttajatunnus: tunnus, salasana: salasana, admin: -1 }
            })
        } catch (err) {
            console.log(err)
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
            <p className="otsikko">{rekisteröidytään ? "Rekisteröidy" : "Kirjaudu"}</p>
            <form>
                <label for='kayttajatunnus'>Käyttäjätunnus<br /></label>
                <input value={tunnus} onChange={handleTunnusChange} type='text' id="kayttajatunnus" /><br />
                <label for='salasana'>Salasana<br /></label>
                <input value={salasana} onChange={handleSalasanaChange} type='password' id="Salasana" /><br />
                <button onClick={() => lisaaKayttaja()}>{rekisteröidytään ? "Rekisteröidy" : "Kirjaudu"}</button>
            </form>
            {!rekisteröidytään && <button onClick={() => (dispatch({ type: 'REKISTEROIDYTAAN' }))}>Rekisteröidy</button>}
        </div >
    )
}

export default Kirjaudu