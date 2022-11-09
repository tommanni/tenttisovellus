import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useContext } from 'react';
import { TenttiContext } from '../App';
import axios from 'axios';



const Kysymys = ({ kysymys, kysymysNimi, tenttiId, kysymysIndex }) => {
    const tenttiContext = useContext(TenttiContext)

    async function poistaKysymys() {
        try {
            await axios.delete('http://localhost:8080/poista-kysymys', { data: { tenttiId: tenttiId, kysymys: kysymys.kysymys, userId: tenttiContext.tenttiDatat.kayttaja.id } })
            console.log(kysymys, tenttiId, tenttiContext.tenttiDatat.kayttaja.id)
            tenttiContext.dispatch({
                type: 'POISTA_KYSYMYS',
                payload: {
                    tenttiIndex: tenttiContext.tentit.findIndex(tentti => tentti.id === tenttiId),
                    kysymys: kysymys.kysymys,
                    tenttiId: tenttiId
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    const poistaVastaus = async (vastaus) => {
        await axios.delete('http://localhost:8080/poista-vastaus', { data: { kysymysId: kysymys.id, vastaus: vastaus, userId: tenttiContext.tenttiDatat.kayttaja.id } })
        tenttiContext.dispatch({
            type: 'POISTA_VASTAUS',
            payload: {
                tenttiIndex: tenttiContext.tentit.findIndex(tentti => tentti.id === tenttiId),
                tenttiId: tenttiId,
                kysymysId: kysymys.id,
                kysymysIndex: kysymysIndex,
                vastaus: vastaus
            }
        })
    }

    const lisaaVastaus = async () => {
        await axios.post('http://localhost:8080/lisaa-vastaus', { kysymysId: kysymys.id })
        tenttiContext.dispatch({
            type: 'LISAA_VASTAUS',
            payload: {
                tenttiIndex: tenttiContext.tentit.findIndex(tentti => tentti.id === tenttiId),
                kysymysIndex: kysymysIndex,
                kysymysId: kysymys.id,
                id: kysymys.vastaukset.length + 1
            }
        })
    }

    const vaihdaOikein = async (vastausId, oikein, vastausIndex) => {
        await axios.put('http://localhost:8080/vastaus-oikein', { vastausId: vastausId, oikein: oikein })
        tenttiContext.dispatch({
            type: 'KYSYMYS_OIKEIN',
            payload: {
                tenttiIndex: tenttiContext.tentit.findIndex(tentti => tentti.id === tenttiId),
                vastausId: vastausId,
                kysymysIndex: kysymysIndex,
                vastausIndex: vastausIndex
            }
        })
    }

    return (
        <div className='kysymys'>
            <p className='kysymysTeksti'><b>{kysymysNimi}</b>{tenttiContext.kayttaja === 1 && <input type="text" placeholder=' vaihda kysymys' onChange={(event) => {
                try {
                    const muutaKysymyksenNimi = async (tenttiId, kysymysId, nimi) => {
                        await axios.put('http://localhost:8080/kysymyksen-nimi-muuttui', { tenttiId: tenttiId, kysymysId: kysymysId, nimi: nimi })
                        tenttiContext.dispatch({
                            type: "KYSYMYKSEN_NIMI_MUUTTUI",
                            payload: {
                                nimi: event.target.value,
                                tenttiIndex: tenttiContext.tentit.findIndex(tentti => tentti.id === tenttiId),
                                tenttiId: tenttiId,
                                kysymysIndex: kysymysIndex,
                                kysymysId: kysymys.id
                            }
                        })
                    }
                    muutaKysymyksenNimi(tenttiId, kysymys.id, event.target.value)
                } catch (err) {
                    console.log(err)
                }
            }} />}
                {tenttiContext.kayttaja === 1 && <Button style={{ color: '#fff' }} startIcon={<DeleteIcon />} className='poista-kysymys' onClick={() => poistaKysymys()} >

                </Button>}
            </p>
            {
                kysymys.vastaukset.map((vastaus, index) =>
                    <div key={vastaus.id} className='vastaus'>

                        {tenttiContext.kayttaja === -1 && tenttiContext.vastaukset === 1 ? <Checkbox color="default" checked={!vastaus.valinta} disableRipple /> : tenttiContext.kayttaja === -1 && <Checkbox color="default" onClick={() => tenttiContext.dispatch({
                            type: 'ASETA_VALINTA',
                            payload: {
                                tenttiIndex: tenttiContext.tentit.findIndex(tentti => tentti.id === tenttiId),
                                kysymysIndex: kysymysIndex,
                                vastausIndex: index
                            }
                        })} />}

                        {tenttiContext.vastaukset === 1 && vastaus.oikein === true && tenttiContext.kayttaja === -1 ? <Checkbox color="default" checked={true} disableRipple />
                            : tenttiContext.vastaukset === 1 && vastaus.oikein === false && tenttiContext.kayttaja === -1 ? <Checkbox checked={false} disableRipple color='success' />
                                : tenttiContext.kayttaja === 1 ? <Checkbox color="default" defaultChecked={vastaus.oikein} onClick={() => vaihdaOikein(vastaus.id, vastaus.oikein, index)}
                                /> : ""}
                        {vastaus.vastaus}
                        {tenttiContext.kayttaja === 1 && <input placeholder=' vaihda vastaus' onChange={(event) => {
                            try {
                                const muutaVastauksenNimi = async (kysymysId, vastausId, nimi) => {
                                    await axios.put('http://localhost:8080/vastauksen-nimi-muuttui', { kysymysId: kysymysId, vastausId: vastausId, nimi: nimi })
                                    tenttiContext.dispatch({
                                        type: "VASTAUKSEN_NIMI_MUUTTUI",
                                        payload: {
                                            nimi: event.target.value,
                                            tenttiIndex: tenttiContext.tentit.findIndex(tentti => tentti.id === tenttiId),
                                            kysymysIndex: kysymysIndex,
                                            vastausIndex: index,
                                            kysymysId: kysymys.id,
                                            vastausId: vastaus.id
                                        }
                                    })
                                }
                                muutaVastauksenNimi(kysymys.id, vastaus.id, event.target.value)
                            } catch (err) {
                                console.log(err)
                            }

                        }} />}

                        {tenttiContext.kayttaja === 1 && <Button style={{ color: '#fff' }} startIcon={<DeleteIcon />} className='poista-vastaus' onClick={() => poistaVastaus(vastaus.vastaus)} ></Button>}
                    </div>
                )
            }

            {
                tenttiContext.kayttaja === 1 && <Button style={{ color: '#fff' }} startIcon={<AddCircleIcon />} className='lisaa-vastaus' onClick={() => lisaaVastaus()}>LISÄÄ VASTAUS</Button>
            }

        </div >

    )
}

export default Kysymys