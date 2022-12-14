import Button from '@mui/material/Button';
import Tentti from './Tentti'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext } from 'react';
import { TenttiContext } from '../App';
import axios from 'axios';

const Tentit = () => {
    const { dispatch, setToValue, value, tentit, kayttaja, oikeatVastaukset } = useContext(TenttiContext)

    async function poistaTentti(nimi, tenttiId) {
        try {
            await axios.delete('http://localhost:8080/tentti/poista', { data: { tenttiId: tenttiId } })
            dispatch({
                type: 'POISTA_TENTTI',
                payload: { nimi: nimi, tenttiId: tenttiId, setToValue: setToValue }
            })
        } catch (err) {
            console.log(err)
        }
    }
    const lisaaTentti = async () => {
        try {
            await axios.post('http://localhost:8080/tentti/lisaa')
            dispatch({
                type: 'LISAA_TENTTI'
            })
        } catch (err) {
            console.log(err)
        }
    }

    const lisaaKysymys = async () => {
        try {
            await axios.post('http://localhost:8080/kysymys/lisaa', { tenttiIndex: value[0].id })
            dispatch({
                type: 'LISAA_KYSYMYS',
                payload: tentit.findIndex(tentti => tentti.id === value[0].id)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const otaTenttiKayttoon = async () => {
        try {
            const result = await axios.get('http://localhost:8080/vastaus/laske-oikein', { params: { tenttiId: value[0].id } })
            if (result.data.maara > 0) {
                await axios.put('http://localhost:8080/tentti/kayttoon', { kaytossa: !value[0].kaytossa, tenttiId: value[0].id })
                dispatch({
                    type: 'OTA_TENTTI_KAYTTOON',
                    payload: tentit.findIndex(tentti => tentti.id === value[0].id)
                })
            } else {
                alert('Aseta v??hint????n yksi vastaus oikein')
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='tentit'>
            {tentit.map((tentti) =>
                <div className='tentti'>
                    <Button style={{ color: '#fff' }} key={tentti.id}
                        onClick={() => setToValue(tentti.id)}>{tentti.nimi}</Button>
                    {kayttaja === 1 ? <input key={tentti.id + 10000} placeholder=' vaihda tentin nimi' type="text" onChange={async (event) => {
                        try {
                            await axios.put('http://localhost:8080/tentti/nimi-muuttui', { tenttiId: tentti.id, nimi: event.target.value })
                            dispatch({
                                type: "TENTIN_NIMI_MUUTTUI",
                                payload: {
                                    nimi: event.target.value,
                                    tentinIndex: tentit.findIndex(tentti1 => tentti1.id === tentti.id),
                                    tentinId: tentti.id
                                }
                            })
                        } catch (err) {
                            console.log(err)
                        }
                    }} /> : ""}
                    {kayttaja === 1 ? <Button key={tentti.id + 100} style={{ color: '#fff' }} startIcon={<DeleteIcon />} onClick={() => poistaTentti(tentti.nimi, tentti.id)} /> : ""}
                </div>
            )
            }
            {kayttaja === 1 && <Button startIcon={<AddCircleIcon />} style={{ color: '#fff' }} onClick={() => lisaaTentti()}>LIS???? TENTTI</Button>}
            {Object.values(value).length !== 0 ?
                value?.map(tentti => <Tentti
                    key={tentti.id + 1000}
                    tentti={tentti}
                    tenttiId={tentti.id}
                />)
                : ""}
            {kayttaja === -1 && tentit.length > 0 ? <Button
                style={{ color: '#fff' }}
                onClick={() => oikeatVastaukset(value[0].id)}>N??YT?? VASTAUKSET
            </Button> : kayttaja === -1 && <p>Kaikki tentit tehty ????</p>}
            {kayttaja === 1 && Object.values(value).length !== 0 && <Button startIcon={<AddCircleIcon />} style={{ color: '#fff' }} onClick={() => lisaaKysymys()}>LIS???? KYSYMYS</Button>}
            {kayttaja === 1 && <Button
                style={{ color: '#fff' }}
                onClick={() => otaTenttiKayttoon()}>{value[0].kaytossa ? 'K??YT??SS??' : 'POIS K??YT??ST??'}
            </Button>}
        </div>
    )
}

export default Tentit