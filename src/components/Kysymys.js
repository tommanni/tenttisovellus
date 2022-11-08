import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';



const Kysymys = ({ kysymys, kysymysNimi, dispatch, tenttiId, vastaukset, kayttaja, kysymysIndex, tentit }) => {
    return (
        <div className='kysymys'>
            <p className='kysymysTeksti'><b>{kysymysNimi}</b>{kayttaja === 1 && <input type="text" placeholder=' vaihda kysymys' onChange={(event) => {
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
            }} />}
                {kayttaja === 1 && <Button style={{ color: '#fff' }} startIcon={<DeleteIcon />} className='poista-kysymys' onClick={() => dispatch({
                    type: 'POISTA_KYSYMYS',
                    payload: {
                        tenttiIndex: tentit.findIndex(tentti => tentti.id === tenttiId),
                        kysymys: kysymys.kysymys,
                        tenttiId: tenttiId
                    }
                })} >

                </Button>}
            </p>
            {kysymys.vastaukset.map((vastaus, index) =>
                <div key={index} className='vastaus'>

                    {kayttaja === -1 && vastaukset === 1 ? <Checkbox color="default" checked={!vastaus.valinta} disableRipple /> : kayttaja === -1 && <Checkbox color="default" onClick={() => dispatch({
                        type: 'ASETA_VALINTA',
                        payload: {
                            tenttiIndex: tentit.findIndex(tentti => tentti.id === tenttiId),
                            kysymysIndex: kysymysIndex,
                            vastausIndex: index
                        }
                    })} />}

                    {vastaukset === 1 && vastaus.oikein === true && kayttaja === -1 ? <Checkbox color="default" checked={true} disableRipple />
                        : vastaukset === 1 && vastaus.oikein === false && kayttaja === -1 ? <Checkbox checked={false} disableRipple color='success' />
                            : kayttaja === 1 ? <Checkbox color="default" defaultChecked={vastaus.oikein} onClick={() => dispatch({
                                type: 'KYSYMYS_OIKEIN',
                                payload: {
                                    tenttiIndex: tentit.findIndex(tentti => tentti.id === tenttiId),
                                    kysymysIndex: kysymysIndex,
                                    vastausIndex: index
                                }
                            })}
                            /> : ""}
                    {vastaus.vastaus}
                    {kayttaja === 1 && <input placeholder=' vaihda vastaus' onChange={(event) => {
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
                    }} />}

                    {kayttaja === 1 && <Button style={{ color: '#fff' }} startIcon={<DeleteIcon />} className='poista-vastaus' onClick={() => dispatch({
                        type: 'POISTA_VASTAUS',
                        payload: {
                            tenttiIndex: tentit.findIndex(tentti => tentti.id === tenttiId),
                            tenttiId: tenttiId,
                            kysymysId: kysymys.id,
                            kysymysIndex: kysymysIndex,
                            vastaus: vastaus.vastaus
                        }
                    })} ></Button>}
                </div>
            )}

            {kayttaja === 1 && <Button style={{ color: '#fff' }} startIcon={<AddCircleIcon />} className='lisaa-vastaus' onClick={() => dispatch({
                type: 'LISAA_VASTAUS',
                payload: {
                    tenttiIndex: tentit.findIndex(tentti => tentti.id === tenttiId),
                    kysymysIndex: kysymysIndex,
                    id: kysymys.vastaukset.length + 1
                }
            })}>LISÄÄ VASTAUS</Button>}

        </div>

    )
}

export default Kysymys