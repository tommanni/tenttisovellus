import Button from '@mui/material/Button';
import Tentti from './Tentti'

const Tentit = ({ tentit, value, setToValue, dispatch, vastaukset, onClick, kayttaja }) => {
    return (
        <div className='tentit'>
            {tentit.map((tentti) => <Button key={tentti.id}
                onClick={() => setToValue([tentti])}>{tentti.nimi}
                {kayttaja === 1 ? <input key={tentti.id} placeholder='vaihda tentin nimi' type="text" onChange={(event) => {
                    dispatch({
                        type: "TENTIN_NIMI_MUUTTUI",
                        payload: {
                            nimi: event.target.value,
                            tentinIndex: tentti.id - 1,
                        }
                    })
                }} /> : ""}</Button>)
            }
            {value.map(tentti => <Tentti
                key={tentti.id}
                tentti={tentti}
                dispatch={dispatch}
                tenttiId={tentti.id}
                vastaukset={vastaukset}
                kayttaja={kayttaja}
            />)
            }
            {kayttaja === -1 ? <Button
                variant="contained"
                onClick={onClick}>NÄYTÄ VASTAUKSET
            </Button> : <Button onClick={() => dispatch({
                type: 'LISAA_KYSYMYS',
                payload: value[0].id - 1
            })}>LISÄÄ KYSYMYS</Button>}
        </div>
    )
}

export default Tentit