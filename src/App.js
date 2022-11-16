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
        const kayttaja = localStorage.getItem('kayttaja')
        console.log(JSON.parse(kayttaja))
        const result = await axios.get('http://localhost:8080/tentti', { params: { kayttaja: JSON.parse(kayttaja) } });
        console.log(result.data)
        dispatch({ type: "ALUSTA_DATA", payload: { data: result.data, setValue: setValue } })
      }
      getData()
    } catch (error) {
      console.log("virhetilanne:", error)
    }
  }, [])

  const setToValue = (tenttiId) => {
    console.log(tenttiDatat)
    const tentti = tenttiDatat.tentit.find(tentti => tentti.id === tenttiId)
    localStorage.setItem('tenttiId', tentti.id)
    setValue([tentti])
    console.log('hello', value)
    setVastaukset(0)
  }

  const oikeatVastaukset = async (tenttiId) => {
    console.log(tenttiDatat.kayttaja)
    setVastaukset(1)
    const tulos = await axios.get('http://localhost:8080/kayttaja/hae-tulos', { params: { tenttiId: tenttiId, kayttajaId: tenttiDatat.kayttaja.id } })
    alert(`Sait arvosanan ${tulos.data.arvosana < 5 ? 'hylätty' : tulos.data.arvosana} (${Number(tulos.data.valitutPisteet)}/${tulos.data.maxPisteet})`)
    setTimeout(() => dispatch({ type: 'POISTA_TENTTI', payload: { tenttiId: tenttiId, setToValue: setToValue } }), 10000);
  }

  return (
    < TenttiContext.Provider value={{
      tenttiDatat: tenttiDatat, dispatch: dispatch, kirjauduttu: tenttiDatat.kirjauduttu,
      tentit: tenttiDatat.tentit, value: value, setToValue: setToValue,
      setValue: setValue, oikeatVastaukset: oikeatVastaukset, kayttaja: tenttiDatat.kirjauduttu && tenttiDatat.kayttaja.admin,
      vastaukset: vastaukset, kayttajaVastaukset: tenttiDatat.kayttajaVastaukset,
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