import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button';


const Kysymys = ({ kysymys, kysymysNimi, dispatch, tenttiId, vastaukset, kayttaja, kysymysIndex }) => {
    return (
        <div className='kysymys'>
            <p><b>{kysymysNimi}</b>{kayttaja === 1 && <input type="text" placeholder='vaihda kysymys' onChange={(event) => {
                dispatch({
                    type: "KYSYMYKSEN_NIMI_MUUTTUI",
                    payload: {
                        nimi: event.target.value,
                        tenttiIndex: tenttiId - 1,
                        kysymysIndex: kysymysIndex
                    }
                })
            }} />}
                {kayttaja === 1 && <Button className='poista-kysymys' onClick={() => dispatch({
                    type: 'POISTA_KYSYMYS',
                    payload: {
                        tenttiIndex: tenttiId - 1,
                        kysymys: kysymys.kysymys,
                    }
                })} >
                    Poista kysymys
                </Button>}
            </p>
            {kysymys.vastaukset.map((vastaus, index) =>
                <div
                    key={index}
                    className='vastaus'>{kayttaja === -1 && <Checkbox />}
                    {vastaukset === 1 && vastaus.oikein === true && kayttaja === -1 ? <Checkbox defaultChecked color='success' />
                        : vastaukset === 1 && vastaus.oikein === false && kayttaja === -1 ? <Checkbox color='success' />
                            : kayttaja === 1 ? <Checkbox onClick={() => dispatch({
                                type: 'KYSYMYS_OIKEIN',
                                payload: {
                                    tenttiIndex: tenttiId - 1,
                                    kysymysIndex: kysymysIndex,
                                    vastausIndex: index
                                }
                            })}
                            /> : ""}
                    {vastaus.vastaus}
                    {kayttaja === 1 && <input placeholder='vaihda vastaus' onChange={(event) => {
                        dispatch({
                            type: "VASTAUKSEN_NIMI_MUUTTUI",
                            payload: {
                                nimi: event.target.value,
                                tenttiIndex: tenttiId - 1,
                                kysymysIndex: kysymysIndex,
                                vastausIndex: index
                            }
                        })
                    }} />}

                    {kayttaja === 1 && <Button className='poista-vastaus' onClick={() => dispatch({
                        type: 'POISTA_VASTAUS',
                        payload: {
                            tenttiIndex: tenttiId - 1,
                            kysymysIndex: kysymysIndex,
                            vastausID: vastaus.id
                        }
                    })} >Poista vastaus</Button>}
                </div>
            )}

            {kayttaja === 1 && <Button className='lisaa-vastaus' onClick={() => dispatch({
                type: 'LISAA_VASTAUS',
                payload: {
                    tenttiIndex: tenttiId - 1,
                    kysymysIndex: kysymysIndex,
                    id: kysymys.vastaukset.length + 1
                }
            })}>LISÄÄ VASTAUS</Button>}

        </div>

    )
}

export default Kysymys