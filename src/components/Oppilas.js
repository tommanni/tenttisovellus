import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext, useEffect, useState } from 'react';
import { TenttiContext } from '../App';
import axios from 'axios';

const Oppilas = ({ oppilas, setOppilaat, setFilter }) => {
    const { dispatch, tenttiDatat } = useContext(TenttiContext)
    const [suoritukset, setSuoritukset] = useState([])

    const poistaOppilas = async () => {
        if (window.confirm(`Poista ${oppilas.kayttajatunnus}?`)) {
            let token = JSON.parse(localStorage.getItem(tenttiDatat.kayttaja.kayttajatunnus))
            console.log('token', token)

            try {
                await axios.delete('http://localhost:8080/kayttaja/poista', { "headers": { 'Authorization': `Bearer ${token.token}`, 'content-type': 'application/json' }, data: { kayttajaId: oppilas.id } })
            } catch (err) {
                if (err.response.status === 403) {
                    let tokens = JSON.parse(localStorage.getItem(tenttiDatat.kayttaja.kayttajatunnus))
                    let newToken = await axios.post('http://localhost:8080/kayttaja/token', { token: tokens.refreshToken })
                    console.log(newToken.data.token)
                    localStorage.setItem(tenttiDatat.kayttaja.kayttajatunnus, JSON.stringify({ token: newToken.data.token, refreshToken: tokens.refreshToken }))
                    await axios.delete('http://localhost:8080/kayttaja/poista', { "headers": { 'Authorization': `Bearer ${newToken.data.token}`, 'content-type': 'application/json' }, "data": { "kayttajaId": oppilas.id } })
                }
            }
            localStorage.removeItem(oppilas.kayttajatunnus)
            dispatch({
                type: 'POISTA_KAYTTAJA',
                payload: { id: oppilas.id, setOppilaat: setOppilaat }
            })
            setFilter("")
        }
    }

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem(tenttiDatat.kayttaja.kayttajatunnus))
        const haeSuoritukset = async () => {
            try {
                let suoritukset = await axios.get('http://localhost:8080/kayttaja/hae-suoritus', {
                    "headers": {
                        'Authorization': `Bearer ${token.token}`,
                        'content-type': 'application/json',
                        kayttajaId: oppilas.id
                    },
                    data: {
                        kayttajaId: oppilas.id
                    }
                })
                setSuoritukset(suoritukset.data)
            } catch (err) {
                if (err.response.status === 403) {
                    let tokens = JSON.parse(localStorage.getItem(tenttiDatat.kayttaja.kayttajatunnus))
                    let newToken = await axios.post('http://localhost:8080/kayttaja/token', { token: tokens.refreshToken })
                    localStorage.setItem(tenttiDatat.kayttaja.kayttajatunnus, JSON.stringify({ token: newToken.data.token, refreshToken: tokens.refreshToken }))
                    let suoritukset = await axios.get('http://localhost:8080/kayttaja/hae-suoritus', {
                        "headers": {
                            'Authorization': `Bearer ${newToken.token}`,
                            'content-type': 'application/json',
                            kayttajaId: oppilas.id
                        },
                        data: {
                            kayttajaId: oppilas.id
                        }
                    })
                    setSuoritukset(suoritukset.data)
                    console.log(suoritukset.data)
                }
                console.log('hello')
            }
        }
        haeSuoritukset()
    }, [oppilas])

    return (
        <div>
            {/* //yksittäisen oppilaan tiedot */}
            <h1>{oppilas.kayttajatunnus}<Button style={{ color: '#fff' }} startIcon={<DeleteIcon />} className='poista-oppilas' onClick={() => poistaOppilas()} ></Button></h1>
            <h2>{'Suoritetut tentit'}</h2>
            <ol>
                {suoritukset?.suoritetut?.length > 0 ? suoritukset.suoritetut.map(suoritus => <li key={suoritus.nimi} style={{ border: 'none' }}><div>{suoritus.nimi} {suoritus.grade > 4 ? suoritus.grade : 'Hylätty'}</div></li>) : 'Ei suoritettuja tenttejä'}
            </ol>
            <h2>{'Suorittamattomat tentit'}</h2>
            <ol>
                {suoritukset?.suorittamattomat?.length > 0 ? suoritukset.suorittamattomat.map(suoritus => <li key={suoritus.nimi} style={{ border: 'none' }}><div>{suoritus.nimi}</div></li>) : 'Ei suorittamattomia tenttejä'}
            </ol>
        </div>
    )
}

export default Oppilas