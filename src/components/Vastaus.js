import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useContext } from 'react';
import { TenttiContext } from '../App';
import axios from 'axios';


const Vastaus = ({ kysymysIndex, tenttiId, kysymys, vastaus, index }) => {
    const { tenttiDatat, dispatch, tentit, kayttaja, vastaukset, kayttajaVastaukset } = useContext(TenttiContext)

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
        <div className='vastaus'>
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
        </div>
    )
}

export default Vastaus