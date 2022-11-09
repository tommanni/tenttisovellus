import Button from '@mui/material/Button';
import Tentti from './Tentti'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext } from 'react';
import { TenttiContext } from '../App';
import axios from 'axios';

const Tentit = () => {
    const tenttiContext = useContext(TenttiContext)

    async function poistaTentti(nimi, tenttiId) {
        try {
            await axios.delete('http://localhost:8080/poista-tentti', { data: { tenttiId: tenttiId } })
            tenttiContext.dispatch({
                type: 'POISTA_TENTTI',
                payload: { nimi: nimi, tenttiId: tenttiId, setToValue: tenttiContext.setToValue }
            })
        } catch (err) {
            console.log(err)
        }
    }
    const lisaaTentti = async () => {
        try {
            await axios.post('http://localhost:8080/lisaa-tentti')
            tenttiContext.dispatch({
                type: 'LISAA_TENTTI'
            })
        } catch (err) {
            console.log(err)
        }
    }

    const lisaaKysymys = async () => {
        try {
            await axios.post('http://localhost:8080/lisaa-kysymys', { tenttiIndex: tenttiContext.value[0].id })
            tenttiContext.dispatch({
                type: 'LISAA_KYSYMYS',
                payload: tenttiContext.tentit.findIndex(tentti1 => tentti1.id === tenttiContext.value[0].id)
            })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='tentit'>
            {tenttiContext.tentit.map((tentti) =>
                <>
                    <Button style={{ color: '#fff' }} key={tentti.id}
                        onClick={() => tenttiContext.setToValue(tentti.id)}>{tentti.nimi}</Button>
                    {tenttiContext.kayttaja === 1 ? <input key={tentti.id} placeholder=' vaihda tentin nimi' type="text" onChange={(event) => {
                        const muutaTentinNimi = async (tenttiId, nimi) => {
                            try {
                                await axios.put('http://localhost:8080/tentin-nimi-muuttui', { tenttiId: tenttiId, nimi: nimi })
                                tenttiContext.dispatch({
                                    type: "TENTIN_NIMI_MUUTTUI",
                                    payload: {
                                        nimi: event.target.value,
                                        tentinIndex: tenttiContext.tentit.findIndex(tentti1 => tentti1.id === tentti.id),
                                        tentinId: tentti.id
                                    }
                                })
                            } catch (err) {
                                console.log(err)
                            }
                        }
                        muutaTentinNimi(tentti.id, event.target.value)

                    }} /> : ""}
                    {tenttiContext.kayttaja === 1 ? <Button key={tentti.id} style={{ color: '#fff' }} startIcon={<DeleteIcon />} onClick={() => poistaTentti(tentti.nimi, tentti.id)} /> : ""}
                </>
            )
            }
            {tenttiContext.kayttaja === 1 && <Button startIcon={<AddCircleIcon />} style={{ color: '#fff' }} onClick={() => lisaaTentti()}>LISÄÄ TENTTI</Button>}
            {Object.values(tenttiContext.value).length !== 0 ?

                tenttiContext.value.map(tentti => <Tentti
                    key={tentti.id}
                    tentti={tentti}
                    tenttiId={tentti.id}
                />)
                : ""}
            {tenttiContext.kayttaja === -1 ? <Button
                style={{ color: '#fff' }}
                onClick={tenttiContext.oikeatVastaukset}>NÄYTÄ VASTAUKSET
            </Button> : Object.values(tenttiContext.value).length !== 0 && <Button startIcon={<AddCircleIcon />} style={{ color: '#fff' }} onClick={() => lisaaKysymys()}>LISÄÄ KYSYMYS</Button>}
        </div>
    )
}

export default Tentit