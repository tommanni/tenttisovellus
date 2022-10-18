import Button from '@mui/material/Button';
import Tentti from './Tentti'

const Tentit = ({ tentit, value, setToValue, dispatch, vastaukset, onClick }) => {
    return (
        <div className='tentit'>
            {tentit.map((tentti) => <Button key={tentti.id}
                onClick={() => setToValue([tentti])}>{tentti.nimi}
                <input type="text" onChange={(event) => {
                    dispatch({
                        type: "TENTIN_NIMI_MUUTTUI",
                        payload: {
                            nimi: event.target.value,
                            tentinIndex: tentti.id - 1
                        }
                    })
                }} /></Button>)
            }
            {value.map(tentti => <Tentti
                key={tentti.id}
                tentti={tentti}
                dispatch={dispatch}
                tenttiId={tentti.id}
                vastaukset={vastaukset} />)
            }
            <Button
                variant="contained"
                onClick={onClick}>NÄYTÄ VASTAUKSET
            </Button>
        </div>
    )
}

export default Tentit