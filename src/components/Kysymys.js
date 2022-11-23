import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useContext } from 'react';
import { TenttiContext } from '../App';
import axios from 'axios';

const Kysymys = ({ kysymys, kysymysNimi, tenttiId, kysymysIndex }) => {
    const { tenttiDatat, dispatch, tentit, kayttaja, vastaukset, kayttajaVastaukset } = useContext(TenttiContext)

    async function poistaKysymys() {
        try {
            await axios.delete('http://localhost:8080/kysymys/poista', { data: { tenttiId: tenttiId, kysymys: kysymys.kysymys, userId: tenttiDatat.kayttaja.id } })
            console.log(kysymys, tenttiId, tenttiDatat.kayttaja.id)
            dispatch({
                type: 'POISTA_KYSYMYS',
                payload: {
                    tenttiIndex: tentit.findIndex(tentti => tentti.id === tenttiId),
                    kysymys: kysymys.kysymys,
                    tenttiId: tenttiId
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    const poistaVastaus = async (vastaus) => {
        try {
            await axios.delete('http://localhost:8080/vastaus/poista', { data: { kysymysId: kysymys.id, vastaus: vastaus, userId: tenttiDatat.kayttaja.id } })
            dispatch({
                type: 'POISTA_VASTAUS',
                payload: {
                    tenttiIndex: tentit.findIndex(tentti => tentti.id === tenttiId),
                    tenttiId: tenttiId,
                    kysymysId: kysymys.id,
                    kysymysIndex: kysymysIndex,
                    vastaus: vastaus
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    const lisaaVastaus = async () => {
        try {
            await axios.post('http://localhost:8080/vastaus/lisaa', { kysymysId: kysymys.id })
            dispatch({
                type: 'LISAA_VASTAUS',
                payload: {
                    tenttiIndex: tentit.findIndex(tentti => tentti.id === tenttiId),
                    kysymysIndex: kysymysIndex,
                    kysymysId: kysymys.id,
                    id: kysymys.vastaukset.length + 1
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    const vaihdaOikein = async (vastausId, oikein, vastausIndex) => {
        try {
            await axios.put('http://localhost:8080/vastaus/oikein', { vastausId: vastausId, oikein: oikein, tenttiId: tenttiId })
            dispatch({
                type: 'KYSYMYS_OIKEIN',
                payload: {
                    tenttiIndex: tentit.findIndex(tentti => tentti.id === tenttiId),
                    vastausId: vastausId,
                    kysymysIndex: kysymysIndex,
                    vastausIndex: vastausIndex,
                    tenttiId: tenttiId
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    const asetaValinta = async (vastausId, index, valinta, kysymysId, tenttiId) => {
        const token = JSON.parse(localStorage.getItem(tenttiDatat.kayttaja.kayttajatunnus))
        try {
            axios({
                method: 'post',
                url: 'http://localhost:8080/kayttaja/aseta-valinta',
                headers: {
                    'Authorization': `Bearer ${token.token}`,
                    'content-type': 'application/json',
                    vastausId: vastausId,
                    valinta: valinta,
                    kayttajaId: tenttiDatat.kayttaja.id,
                    kysymysId: kysymys.id,
                    tenttiId: tenttiId
                },
                data: {

                }
            });
            dispatch({
                type: 'ASETA_VALINTA',
                payload: {
                    tenttiIndex: tentit.findIndex(tentti => tentti.id === tenttiId),
                    kysymysIndex: kysymysIndex,
                    vastausIndex: index,
                    kysymysId: kysymysId,
                    tenttiId: tenttiId,
                    kayttajaId: tenttiDatat.kayttaja.id,
                    valinta: valinta,
                    vastausId: vastausId
                }
            })
        } catch (err) {
            console.log(err)
            if (err.response.status === 403) {
                let tokens = JSON.parse(localStorage.getItem(tenttiDatat.kayttaja.kayttajatunnus))
                console.log(tokens)
                let newToken = await axios.post('http://localhost:8080/kayttaja/token', { token: tokens.refreshToken })
                localStorage.setItem(tenttiDatat.kayttaja.kayttajatunnus, JSON.stringify({ token: newToken.data.token, refreshToken: tokens.refreshToken }))
                axios({
                    method: 'post',
                    url: 'http://localhost:8080/kayttaja/token',
                    headers: {
                        'Authorization': `Bearer ${newToken.data.token}`,
                        'content-type': 'application/json'
                    },
                    data: {
                        vastausId: vastausId,
                        valinta: valinta,
                        kayttajaId: tenttiDatat.kayttaja.id,
                        kysymysId: kysymys.id,
                        tenttiId: tenttiId
                    }
                });
            }
        }
    }

    return (
        <div className='kysymys'>
            <p className='kysymysTeksti'><b>{kysymysNimi}</b>{kayttaja === 1 && <input type="text" placeholder=' vaihda kysymys' onChange={(event) => {
                try {
                    const muutaKysymyksenNimi = async (tenttiId, kysymysId, nimi) => {
                        await axios.put('http://localhost:8080/kysymys/nimi-muuttui', { tenttiId: tenttiId, kysymysId: kysymysId, nimi: nimi })
                        dispatch({
                            type: "KYSYMYKSEN_NIMI_MUUTTUI",
                            payload: {
                                nimi: event.target.value,
                                tenttiIndex: tentit.findIndex(tentti => tentti.id === tenttiId),
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
                {kayttaja === 1 && <Button style={{ color: '#fff' }} startIcon={<DeleteIcon />} className='poista-kysymys' onClick={() => poistaKysymys()} >

                </Button>}
            </p>
            {
                kysymys.vastaukset.map((vastaus, index) => {

                    return (<div key={vastaus.id} className='vastaus'>
                        {kayttaja === -1 && vastaukset === 1 ? <Checkbox color="default" checked={!vastaus.valinta} disableRipple /> : kayttaja === -1 && <Checkbox defaultChecked={kayttajaVastaukset.some(kVastaus => kVastaus.answer_id === vastaus.id && kVastaus.user_id === tenttiDatat.kayttaja.id)} color="default" onClick={() => asetaValinta(vastaus.id, index, vastaus.valinta, kysymys.id, tenttiId)} />}

                        {vastaukset === 1 && vastaus.oikein === true && kayttaja === -1 ? <Checkbox color="default" checked={true} disableRipple />
                            : vastaukset === 1 && vastaus.oikein === false && kayttaja === -1 ? <Checkbox checked={false} disableRipple color='success' />
                                : kayttaja === 1 ? <Checkbox color="default" defaultChecked={vastaus.oikein} onClick={() => vaihdaOikein(vastaus.id, vastaus.oikein, index)}
                                /> : ""}
                        {vastaus.vastaus}
                        {kayttaja === 1 && <input placeholder=' vaihda vastaus' onChange={(event) => {
                            try {
                                const muutaVastauksenNimi = async (kysymysId, vastausId, nimi) => {
                                    await axios.put('http://localhost:8080/vastaus/nimi-muuttui', { kysymysId: kysymysId, vastausId: vastausId, nimi: nimi })
                                    dispatch({
                                        type: "VASTAUKSEN_NIMI_MUUTTUI",
                                        payload: {
                                            nimi: event.target.value,
                                            tenttiIndex: tentit.findIndex(tentti => tentti.id === tenttiId),
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

                        {kayttaja === 1 && <Button style={{ color: '#fff' }} startIcon={<DeleteIcon />} className='poista-vastaus' onClick={() => poistaVastaus(vastaus.vastaus)} ></Button>}
                    </div>)
                }
                )
            }

            {
                kayttaja === 1 && <Button style={{ color: '#fff' }} startIcon={<AddCircleIcon />} className='lisaa-vastaus' onClick={() => lisaaVastaus()}>LISÄÄ VASTAUS</Button>
            }

        </div >

    )
}

export default Kysymys