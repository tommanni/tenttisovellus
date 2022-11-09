import { useState } from "react"
import { useContext } from 'react';
import { TenttiContext } from '../App';

const Kirjaudu = () => {
    const tenttiContext = useContext(TenttiContext)
    const [tunnus, setTunnus] = useState("")
    const [salasana, setSalasana] = useState("")

    const handleTunnusChange = (e) => {
        setTunnus(e.target.value)
    }
    const handleSalasanaChange = (e) => {
        setSalasana(e.target.value)
    }

    return (
        <div>
            <p className="otsikko">{tenttiContext.rekisteröidytään ? "Rekisteröidy" : "Kirjaudu"}</p>
            <form>
                <label for='kayttajatunnus'>Käyttäjätunnus<br /></label>
                <input value={tunnus} onChange={handleTunnusChange} type='text' id="kayttajatunnus" /><br />
                <label for='salasana'>Salasana<br /></label>
                <input value={salasana} onChange={handleSalasanaChange} type='password' id="Salasana" /><br />
                <button onClick={() => tenttiContext.dispatch({
                    type: tenttiContext.rekisteröidytään ? 'LISAA_KAYTTAJA' : 'KIRJAUDU',
                    payload: { kayttajatunnus: tunnus, salasana: salasana, admin: -1 }
                })}>{tenttiContext.rekisteröidytään ? "Rekisteröidy" : "Kirjaudu"}</button>
            </form>
            {!tenttiContext.rekisteröidytään && <button onClick={() => (tenttiContext.dispatch({ type: 'REKISTEROIDYTAAN' }))}>Rekisteröidy</button>}
        </div >
    )
}

export default Kirjaudu