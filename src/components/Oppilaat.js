import Oppilas from "./Oppilas"

const Oppilaat = ({ oppilaat, onClick, setOppilaat, setFilter }) => {
    return (
        <div>
            {/* Näytetään tiedot filtteröityjen oppilaiden määrän perusteella */}
            {oppilaat.length > 10 ? 'Liikaa vaihtoehtoja, tarkenna hakua'
                : oppilaat.length > 1 ? oppilaat.map(oppilas => <p key={oppilas.kayttajatunnus}>{oppilas.kayttajatunnus}<button type='button' onClick={() => onClick(oppilas.kayttajatunnus)}>NÄYTÄ</button></p>)
                    : oppilaat.length === 1 ? <Oppilas setFilter={setFilter} setOppilaat={setOppilaat} oppilas={oppilaat[0]} /> : ''}
        </div>
    )
}

export default Oppilaat