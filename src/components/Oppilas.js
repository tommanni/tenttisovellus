import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext } from 'react';
import { TenttiContext } from '../App';
import axios from 'axios';

const Oppilas = ({ oppilas, setOppilaat, setFilter }) => {
    const { dispatch } = useContext(TenttiContext)

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

    //todo:
    //-oppilaan poistaminen
    //-oppilaan suoritukset
    return (
        <div>
            {/* //yksittäisen oppilaan tiedot */}
            <h1>{oppilas.kayttajatunnus}<Button style={{ color: '#fff' }} startIcon={<DeleteIcon />} className='poista-oppilas' onClick={() => poistaOppilas()} ></Button></h1>
            <ol>
            </ol>
        </div>
    )
}

export default Oppilas