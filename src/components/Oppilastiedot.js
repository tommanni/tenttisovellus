import { useContext, useState } from 'react';
import { TenttiContext } from '../App';
import Filter from './Filter';
import Oppilaat from './Oppilaat';
import Oppilas from './Oppilas';

const Oppilastiedot = () => {
    const { kayttajat, tenttiDatat, kayttaja } = useContext(TenttiContext)

    const [oppilaat, setOppilaat] = useState(kayttajat.filter(kayttaja => Number(kayttaja.admin) !== 1))
    const [filterNimi, setFilterNimi] = useState('')

    const filteroidytOppilaat = oppilaat.filter(oppilas => oppilas.kayttajatunnus.toLowerCase().includes(filterNimi.toLowerCase()))

    const handleFilterNimiChange = (event) => {
        setFilterNimi(event.target.value)
    }

    const clickHandler = (value) => {
        setFilterNimi(value)
    }

    return (
        <div className='oppilaat'>
            {kayttaja === 1 && <Filter
                value={filterNimi}
                onChange={handleFilterNimiChange}
            />}
            {kayttaja === 1 ? <Oppilaat oppilaat={filteroidytOppilaat} onClick={clickHandler} setOppilaat={setOppilaat} setFilter={setFilterNimi} /> : <Oppilas oppilas={tenttiDatat.kayttaja} />}
        </div>
    )
}

export default Oppilastiedot