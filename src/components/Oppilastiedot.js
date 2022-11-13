import { useContext, useState } from 'react';
import { TenttiContext } from '../App';
import Filter from './Filter';
import Oppilaat from './Oppilaat';

const Oppilastiedot = () => {
    const { kayttajat } = useContext(TenttiContext)

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
            <Filter
                value={filterNimi}
                onChange={handleFilterNimiChange}
            />
            <Oppilaat oppilaat={filteroidytOppilaat} onClick={clickHandler} setOppilaat={setOppilaat} setFilter={setFilterNimi} />
        </div>
    )
}

export default Oppilastiedot