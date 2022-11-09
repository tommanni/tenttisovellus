import Button from '@mui/material/Button';
import Tentti from './Tentti'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext } from 'react';
import { TenttiContext } from '../App';

const Tentit = () => {
    const tenttiContext = useContext(TenttiContext)

    return (
        <div className='tentit'>
            {tenttiContext.tentit.map((tentti) =>
                <>
                    <Button style={{ color: '#fff' }} key={tentti.id}
                        onClick={() => tenttiContext.setToValue(tentti.id)}>{tentti.nimi}</Button>
                    {tenttiContext.kayttaja === 1 ? <input key={tentti.id} placeholder=' vaihda tentin nimi' type="text" onChange={(event) => {
                        tenttiContext.dispatch({
                            type: "TENTIN_NIMI_MUUTTUI",
                            payload: {
                                nimi: event.target.value,
                                tentinIndex: tenttiContext.tentit.findIndex(tentti1 => tentti1.id === tentti.id),
                                tentinId: tentti.id
                            }
                        })
                    }} /> : ""}
                    {tenttiContext.kayttaja === 1 ? <Button key={tentti.id} style={{ color: '#fff' }} startIcon={<DeleteIcon />} onClick={() => tenttiContext.dispatch({
                        type: 'POISTA_TENTTI',
                        payload: { nimi: tentti.nimi, tenttiId: tentti.id, setValue: tenttiContext.setValue }
                    })} /> : ""}
                </>
            )
            }
            {tenttiContext.kayttaja === 1 && <Button startIcon={<AddCircleIcon />} style={{ color: '#fff' }} onClick={() => tenttiContext.dispatch({
                type: 'LISAA_TENTTI'
            })}>LISÄÄ TENTTI</Button>}
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
            </Button> : Object.values(tenttiContext.value).length !== 0 && <Button startIcon={<AddCircleIcon />} style={{ color: '#fff' }} onClick={() => tenttiContext.dispatch({
                type: 'LISAA_KYSYMYS',
                payload: tenttiContext.tentit.findIndex(tentti1 => tentti1.id === tenttiContext.value[0].id)
            })}>LISÄÄ KYSYMYS</Button>}
        </div>
    )
}

export default Tentit