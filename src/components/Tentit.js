import Button from '@mui/material/Button';
import Tentti from './Tentti'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

const Tentit = ({ tentit, value, setToValue, dispatch, vastaukset, onClick, kayttaja }) => {
    return (
        <div className='tentit'>
            {tentit.map((tentti) =>
                <>
                    <Button style={{ color: '#fff' }} key={tentti.id}
                        onClick={() => setToValue([tentti])}>{tentti.nimi}</Button>
                    {kayttaja === 1 ? <input key={tentti.id} placeholder=' vaihda tentin nimi' type="text" onChange={(event) => {
                        dispatch({
                            type: "TENTIN_NIMI_MUUTTUI",
                            payload: {
                                nimi: event.target.value,
                                tentinIndex: tentti.id - 1,
                            }
                        })
                    }} /> : ""}
                    {kayttaja === 1 ? <Button style={{ color: '#fff' }} startIcon={<DeleteIcon />} onClick={() => dispatch({
                        type: 'POISTA_TENTTI',
                        payload: tentti.nimi
                    })} /> : ""}
                </>
            )
            }
            {kayttaja === 1 && <Button startIcon={<AddCircleIcon />} style={{ color: '#fff' }} onClick={() => dispatch({
                type: 'LISAA_TENTTI'
            })}>LISÄÄ TENTTI</Button>}
            {value.map(tentti => <Tentti
                key={tentti.id}
                tentti={tentti}
                dispatch={dispatch}
                tenttiId={tentti.id}
                vastaukset={vastaukset}
                kayttaja={kayttaja}
                tentit={tentit}
            />)
            }
            {kayttaja === -1 ? <Button
                style={{ color: '#fff' }}
                onClick={onClick}>NÄYTÄ VASTAUKSET
            </Button> : <Button startIcon={<AddCircleIcon />} style={{ color: '#fff' }} onClick={() => dispatch({
                type: 'LISAA_KYSYMYS',
                payload: value[0].id - 1
            })}>LISÄÄ KYSYMYS</Button>}
        </div>
    )
}

export default Tentit