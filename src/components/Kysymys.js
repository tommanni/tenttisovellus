import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useContext } from 'react';
import { TenttiContext } from '../App';



const Kysymys = ({ kysymys, kysymysNimi, tenttiId, kysymysIndex }) => {
    const tenttiContext = useContext(TenttiContext)

    return (
        <div className='kysymys'>
            <p className='kysymysTeksti'><b>{kysymysNimi}</b>{tenttiContext.kayttaja === 1 && <input type="text" placeholder=' vaihda kysymys' onChange={(event) => {
                tenttiContext.dispatch({
                    type: "KYSYMYKSEN_NIMI_MUUTTUI",
                    payload: {
                        nimi: event.target.value,
                        tenttiIndex: tenttiContext.tentit.findIndex(tentti => tentti.id === tenttiId),
                        tenttiId: tenttiId,
                        kysymysIndex: kysymysIndex,
                        kysymysId: kysymys.id
                    }
                })
            }} />}
                {tenttiContext.kayttaja === 1 && <Button style={{ color: '#fff' }} startIcon={<DeleteIcon />} className='poista-kysymys' onClick={() => tenttiContext.dispatch({
                    type: 'POISTA_KYSYMYS',
                    payload: {
                        tenttiIndex: tenttiContext.tentit.findIndex(tentti => tentti.id === tenttiId),
                        kysymys: kysymys.kysymys,
                        tenttiId: tenttiId
                    }
                })} >

                </Button>}
            </p>
            {kysymys.vastaukset.map((vastaus, index) =>
                <div key={vastaus.id} className='vastaus'>

                    {tenttiContext.kayttaja === -1 && tenttiContext.vastaukset === 1 ? <Checkbox color="default" checked={!vastaus.valinta} disableRipple /> : tenttiContext.kayttaja === -1 && <Checkbox color="default" onClick={() => tenttiContext.dispatch({
                        type: 'ASETA_VALINTA',
                        payload: {
                            tenttiIndex: tenttiContext.tentit.findIndex(tentti => tentti.id === tenttiId),
                            kysymysIndex: kysymysIndex,
                            vastausIndex: index
                        }
                    })} />}

                    {tenttiContext.vastaukset === 1 && vastaus.oikein === true && tenttiContext.kayttaja === -1 ? <Checkbox color="default" checked={true} disableRipple />
                        : tenttiContext.vastaukset === 1 && vastaus.oikein === false && tenttiContext.kayttaja === -1 ? <Checkbox checked={false} disableRipple color='success' />
                            : tenttiContext.kayttaja === 1 ? <Checkbox color="default" defaultChecked={vastaus.oikein} onClick={() => tenttiContext.dispatch({
                                type: 'KYSYMYS_OIKEIN',
                                payload: {
                                    tenttiIndex: tenttiContext.tentit.findIndex(tentti => tentti.id === tenttiId),
                                    vastausId: vastaus.id,
                                    kysymysIndex: kysymysIndex,
                                    vastausIndex: index
                                }
                            })}
                            /> : ""}
                    {vastaus.vastaus}
                    {tenttiContext.kayttaja === 1 && <input placeholder=' vaihda vastaus' onChange={(event) => {
                        tenttiContext.dispatch({
                            type: "VASTAUKSEN_NIMI_MUUTTUI",
                            payload: {
                                nimi: event.target.value,
                                tenttiIndex: tenttiContext.tentit.findIndex(tentti => tentti.id === tenttiId),
                                kysymysIndex: kysymysIndex,
                                vastausIndex: index,
                                kysymysId: kysymys.id,
                                vastausId: vastaus.id
                            }
                        })
                    }} />}

                    {tenttiContext.kayttaja === 1 && <Button style={{ color: '#fff' }} startIcon={<DeleteIcon />} className='poista-vastaus' onClick={() => tenttiContext.dispatch({
                        type: 'POISTA_VASTAUS',
                        payload: {
                            tenttiIndex: tenttiContext.tentit.findIndex(tentti => tentti.id === tenttiId),
                            tenttiId: tenttiId,
                            kysymysId: kysymys.id,
                            kysymysIndex: kysymysIndex,
                            vastaus: vastaus.vastaus
                        }
                    })} ></Button>}
                </div>
            )}

            {tenttiContext.kayttaja === 1 && <Button style={{ color: '#fff' }} startIcon={<AddCircleIcon />} className='lisaa-vastaus' onClick={() => tenttiContext.dispatch({
                type: 'LISAA_VASTAUS',
                payload: {
                    tenttiIndex: tenttiContext.tentit.findIndex(tentti => tentti.id === tenttiId),
                    kysymysIndex: kysymysIndex,
                    kysymysId: kysymys.id,
                    id: kysymys.vastaukset.length + 1
                }
            })}>LISÄÄ VASTAUS</Button>}

        </div>

    )
}

export default Kysymys