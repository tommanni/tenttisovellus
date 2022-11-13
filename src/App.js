import './App.css';
import Header from './components/Header'
import Tentit from './components/Tentit'
import Kirjaudu from './components/Kirjaudu';
import Oppilastiedot from './components/Oppilastiedot';
import { useState, useReducer, useEffect, createContext } from 'react'
import axios from 'axios'
import { reducer } from './reducer'

export const TenttiContext = createContext()

const App = () => {
  const [tenttiDatat, dispatch] = useReducer(reducer, {})
  const [value, setValue] = useState({})
  const [vastaukset, setVastaukset] = useState(0)

  useEffect(() => {
    try {
      const getData = async () => {
        const result = await axios.get('http://localhost:8080/tentti');
        console.log(result.data)
        dispatch({ type: "ALUSTA_DATA", payload: { data: result.data, setValue: setValue } })
      }
      getData()
    } catch (error) {
      console.log("virhetilanne:", error)
    }
  }, [])

  const setToValue = (tenttiId) => {
    const muutaVoimassa = async () => {
      await axios.put('http://localhost:8080/muuta-voimassa', { tenttiId: tenttiId, vanhaTenttiId: Object.keys(value[0]).length !== 0 ? value[0].id : 0 })
    }
    muutaVoimassa()
    console.log(tenttiDatat.kayttaja.id)
    setValue([tenttiDatat.tentit.find(tentti => tentti.id === tenttiId)])
    console.log('hello', value)
    setVastaukset(0)
  }

  const oikeatVastaukset = (tenttiId) => {
    console.log(tenttiDatat.kayttaja)
    const haeTulos = async () => {
      const tulos = await axios.get('http://localhost:8080/kayttaja/hae-tulos', { params: { tenttiId: tenttiId, kayttajaId: tenttiDatat.kayttaja.id } })
      alert(`Sait ${Number(tulos.data.valitutPisteet)}/${tulos.data.maxPisteet} pistettä!`)
    }
    haeTulos()
    setVastaukset(1)
  }

  return (
    < TenttiContext.Provider value={{
      tenttiDatat: tenttiDatat, dispatch: dispatch, kirjauduttu: tenttiDatat.kirjauduttu,
      tentit: tenttiDatat.tentit, value: value, setToValue: setToValue,
      setValue: setValue, oikeatVastaukset: oikeatVastaukset, kayttaja: Object.keys(tenttiDatat).length > 0 && tenttiDatat.kayttaja.admin,
      vastaukset: vastaukset, rekisteröidytään: tenttiDatat.rekisteröidytään, kayttajaVastaukset: tenttiDatat.kayttajaVastaukset,
      kayttajat: tenttiDatat.kayttajat
    }
    }>
      <div>
        {tenttiDatat.tietoAlustettu && <Header />}
        {tenttiDatat.naytaOppilaat && tenttiDatat.kirjauduttu && <Oppilastiedot />}
        {tenttiDatat.tietoAlustettu && tenttiDatat.kirjauduttu && !tenttiDatat.naytaOppilaat && <Tentit />}
        <div className='kirjaudu'>
          {!tenttiDatat.kirjauduttu && <Kirjaudu />}
        </div>
      </div>
    </TenttiContext.Provider >
  );
}

export default App