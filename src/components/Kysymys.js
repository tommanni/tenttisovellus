import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import React, { useContext, useCallback, useState, useEffect } from 'react';
import { TenttiContext } from '../App';
import axios from 'axios';
import ShowImage from './ShowImage';
import DropBox from './DropBox';
import Vastaus from './Vastaus';

const Kysymys = ({ kysymys, kysymysNimi, tenttiId, kysymysIndex }) => {
    const { tenttiDatat, dispatch, tentit, kayttaja, value } = useContext(TenttiContext)
    const [images, setImages] = useState([]);

    /*    useEffect(() => {
           const i = async () => {
               let imageData = await axios.get("http://localhost:8080/kysymys/hae-kuva", { params: { tenttiId: value[0].id } });
               imageData = imageData.data
               console.log(imageData)
               dispatch({
                   type: 'LATAA_KUVAT',
                   payload: imageData
               })
           }
           i()
       }, [value])
    */
    async function poistaKysymys() {
        try {
            await axios.delete('http://localhost:8080/kysymys/poista', { data: { tenttiId: tenttiId, kysymys: kysymys.kysymys, userId: tenttiDatat.kayttaja.id } })
            console.log(kysymys, tenttiId, tenttiDatat.kayttaja.id)
            dispatch({
                type: 'POISTA_KYSYMYS',
                payload: {
                    tenttiIndex: tentit.findIndex(tentti => tentti.id === tenttiId),
                    kysymys: kysymys.kysymys,
                    tenttiId: tenttiId
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    const poistaKuva = async () => {
        await axios.delete('http://localhost:8080/kysymys/poista-kuva', { data: { kysymysId: kysymys.id } })
        dispatch({
            type: 'POISTA_KUVA',
            payload: kysymys.id
        })
    }

    const lisaaVastaus = async () => {
        try {
            await axios.post('http://localhost:8080/vastaus/lisaa', { kysymysId: kysymys.id })
            dispatch({
                type: 'LISAA_VASTAUS',
                payload: {
                    tenttiIndex: tentit.findIndex(tentti => tentti.id === tenttiId),
                    kysymysIndex: kysymysIndex,
                    kysymysId: kysymys.id,
                    id: kysymys.vastaukset.length + 1
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    const onDrop = useCallback(async (acceptedFiles) => {
        const formData = new FormData()
        formData.append('image', acceptedFiles[0])
        console.log('hello')
        await axios.post('http://localhost:8080/kysymys/lisaa-kuva', formData, { headers: { kysymysid: kysymys.id } })
        console.log('hello')
        acceptedFiles.map((file, index) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                setImages((prevState) => [
                    ...prevState,
                    { id: index, src: e.target.result },
                ]);
            };
            reader.readAsDataURL(file);
            return file;
        });
    }, []);

    return (
        <div className='kysymys'>
            <p className='kysymysTeksti'><b>{kysymysNimi}</b>{kayttaja === 1 && <input type="text" placeholder=' vaihda kysymys' onChange={(event) => {
                try {
                    const muutaKysymyksenNimi = async (tenttiId, kysymysId, nimi) => {
                        await axios.put('http://localhost:8080/kysymys/nimi-muuttui', { tenttiId: tenttiId, kysymysId: kysymysId, nimi: nimi })
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
                    }
                    muutaKysymyksenNimi(tenttiId, kysymys.id, event.target.value)
                } catch (err) {
                    console.log(err)
                }
            }} />}
                {kayttaja === 1 && <Button style={{ color: '#fff' }} startIcon={<DeleteIcon />} className='poista-kysymys' onClick={() => poistaKysymys()} ></Button>}
            </p>
            {kayttaja === 1 && <DropBox onDrop={onDrop} />}
            <div className='container'>
                <ShowImage images={images} />
                {tenttiDatat?.kuvat?.filter(img => Object.keys(img).includes(kysymys.id)).length > 0 && <img src={tenttiDatat?.kuvat?.find(img => Object.keys(img).includes(kysymys.id))[kysymys.id]} className='img' alt='kuva' />}
            </div>
            {kayttaja === 1 && (tenttiDatat?.kuvat?.filter(img => Object.keys(img).includes(kysymys.id)).length > 0 || images.length > 0) && <Button style={{ color: '#fff' }} startIcon={<DeleteIcon />} onClick={() => poistaKuva()} />}
            {
                kysymys.vastaukset.map((vastaus, index) => <Vastaus kysymysIndex={kysymysIndex} tenttiId={tenttiId} kysymys={kysymys} vastaus={vastaus} index={index} />)
            }
            {
                kayttaja === 1 && <Button style={{ color: '#fff' }} startIcon={<AddCircleIcon />} className='lisaa-vastaus' onClick={() => lisaaVastaus()}>LISÄÄ VASTAUS</Button>
            }
        </div >

    )
}

export default Kysymys