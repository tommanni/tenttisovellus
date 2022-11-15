import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext, useEffect, useState } from 'react';
import { TenttiContext } from '../App';
import axios from 'axios';

const Oppilas = ({ oppilas, setOppilaat, setFilter }) => {
    const { dispatch } = useContext(TenttiContext)
    const [suoritukset, setSuoritukset] = useState([])

    const poistaOppilas = async () => {
        if (window.confirm(`Poista ${oppilas.kayttajatunnus}?`)) {
            console.log(oppilas.id)
            await axios.delete('http://localhost:8080/kayttaja/poista', { data: { kayttajaId: oppilas.id } })
            dispatch({
                type: 'POISTA_KAYTTAJA',
                payload: { id: oppilas.id, setOppilaat: setOppilaat }
            })
            setFilter("")
        }
    }

    useEffect(() => {
        const haeSuoritukset = async () => {
            const suoritukset = await axios.get('http://localhost:8080/kayttaja/hae-suoritus', { params: { kayttajaId: oppilas.id } })
            console.log(suoritukset.data)
            setSuoritukset(suoritukset.data)
        }
        haeSuoritukset()
    }, [oppilas])

    //todo:
    //-oppilaan poistaminen
    //-oppilaan suoritukset
    return (
        <div>
            {/* //yksittäisen oppilaan tiedot */}
            <h1>{oppilas.kayttajatunnus}<Button style={{ color: '#fff' }} startIcon={<DeleteIcon />} className='poista-oppilas' onClick={() => poistaOppilas()} ></Button></h1>
            <h2>{'Suoritetut tentit'}</h2>
            <ol>
                {suoritukset?.suoritetut?.length > 0 ? suoritukset.suoritetut.map(suoritus => <li style={{ border: 'none' }}><div>{suoritus.nimi} {suoritus.grade > 4 ? suoritus.grade : 'Hylätty'}</div></li>) : 'Ei suoritettuja tenttejä'}
            </ol>
            <h2>{'Suorittamattomat tentit'}</h2>
            <ol>
                {suoritukset?.suorittamattomat?.length > 0 ? suoritukset.suorittamattomat.map(suoritus => <li style={{ border: 'none' }}><div>{suoritus.nimi}</div></li>) : 'Ei suorittamattomia tenttejä'}
            </ol>
        </div>
    )
}

export default Oppilas