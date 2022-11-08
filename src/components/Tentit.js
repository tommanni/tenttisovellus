import Button from '@mui/material/Button';
import Tentti from './Tentti'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

const Tentit = ({ tentit, value, setToValue, dispatch, vastaukset, onClick, kayttaja, setValue }) => {
    return (
        <div className='tentit'>
            {tentit.map((tentti) =>
                <>
                    <Button style={{ color: '#fff' }} key={tentti.id}
                        onClick={() => setToValue(tentti.id)}>{tentti.nimi}</Button>
                    {kayttaja === 1 ? <input key={tentti.id} placeholder=' vaihda tentin nimi' type="text" onChange={(event) => {
                        dispatch({
                            type: "TENTIN_NIMI_MUUTTUI",
                            payload: {
                                nimi: event.target.value,
                                tentinIndex: tentit.findIndex(tentti1 => tentti1.id === tentti.id),
                                tentinId: tentti.id
                            }
                        })
                    }} /> : ""}
                    {kayttaja === 1 ? <Button key={tentti.id} style={{ color: '#fff' }} startIcon={<DeleteIcon />} onClick={() => dispatch({
                        type: 'POISTA_TENTTI',
                        payload: { nimi: tentti.nimi, tenttiId: tentti.id, setValue: setValue }
                    })} /> : ""}
                </>
            )
            }
            {kayttaja === 1 && <Button startIcon={<AddCircleIcon />} style={{ color: '#fff' }} onClick={() => dispatch({
                type: 'LISAA_TENTTI'
            })}>LISÄÄ TENTTI</Button>}
            {Object.values(value).length !== 0 ?

                value.map(tentti => <Tentti
                    key={tentti.id}
                    tentti={tentti}
                    dispatch={dispatch}
                    tenttiId={tentti.id}
                    vastaukset={vastaukset}
                    kayttaja={kayttaja}
                    tentit={tentit}
                />)
                : ""}
            {kayttaja === -1 ? <Button
                style={{ color: '#fff' }}
                onClick={onClick}>NÄYTÄ VASTAUKSET
            </Button> : Object.values(value).length !== 0 && <Button startIcon={<AddCircleIcon />} style={{ color: '#fff' }} onClick={() => dispatch({
                type: 'LISAA_KYSYMYS',
                payload: tentit.findIndex(tentti1 => tentti1.id === value[0].id)
            })}>LISÄÄ KYSYMYS</Button>}
        </div>
    )
}

export default Tentit