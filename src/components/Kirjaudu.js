import { useState } from "react"

const Kirjaudu = ({ dispatch, rekisteröidytään }) => {
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
            <p className="otsikko">{rekisteröidytään ? "Rekisteröidy" : "Kirjaudu"}</p>
            <form>
                <label for='kayttajatunnus'>Käyttäjätunnus<br /></label>
                <input value={tunnus} onChange={handleTunnusChange} type='text' id="kayttajatunnus" /><br />
                <label for='salasana'>Salasana<br /></label>
                <input value={salasana} onChange={handleSalasanaChange} type='password' id="Salasana" /><br />
                <button onClick={() => dispatch({
                    type: rekisteröidytään ? 'LISAA_KAYTTAJA' : 'KIRJAUDU',
                    payload: { kayttajatunnus: tunnus, salasana: salasana, admin: -1 }
                })}>{rekisteröidytään ? "Rekisteröidy" : "Kirjaudu"}</button>
            </form>
            {!rekisteröidytään && <button onClick={() => (dispatch({ type: 'REKISTEROIDYTAAN' }))}>Rekisteröidy</button>}
        </div >
    )
}

export default Kirjaudu