import './App.css';
import tenttiData from './components/TenttiData'
import Header from './components/Header'
import Tentit from './components/Tentit'
import { useState, useReducer, useEffect } from 'react'

function reducer(state, action) {

  switch (action.type) {

    case "TENTIN_NIMI_MUUTTUI":
      let tentit1 = { ...state, tallennetaanko: true }
      tentit1.tentit[action.payload.tentinIndex].nimi = action.payload.nimi
      return tentit1

    case "KYSYMYKSEN_NIMI_MUUTTUI":
      let tentit2 = { ...state, tallennetaanko: true }
      tentit2.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].kysymys = action.payload.nimi
      return tentit2

    case "VASTAUKSEN_NIMI_MUUTTUI":
      let tentit3 = { ...state, tallennetaanko: true }
      tentit3.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].vastaus = action.payload.nimi
      return tentit3
    //Poistetaan kysymys filtteröimällä se pois
    case 'POISTA_KYSYMYS':
      let tentit4 = { ...state, tallennetaanko: true }
      tentit4.tentit[action.payload.tenttiIndex].kysymykset = tentit4.tentit[action.payload.tenttiIndex].kysymykset.filter(kysymys => kysymys.kysymys !== action.payload.kysymys)
      return tentit4
    //Poistetaan vastaus filtteröimällä se pois
    case 'POISTA_VASTAUS':
      let tentit5 = { ...state, tallennetaanko: true }
      tentit5.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset = tentit5.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset.filter(vastaus => vastaus.vastaus !== action.payload.vastaus)
      return tentit5

    case 'LISAA_TENTTI':
      let tentit10 = { ...state, tallennetaanko: true }
      tentit10.tentit.push({ nimi: 'UUSI TENTTI', id: tentit10.tentit.length + 1, kysymykset: [] })
      return tentit10

    case 'POISTA_TENTTI':
      let tentit11 = { ...state, tallennetaanko: true }
      tentit11.tentit = tentit11.tentit.filter(tentti => tentti.nimi !== action.payload)
      return tentit11

    case 'LISAA_KYSYMYS':
      let tentit6 = { ...state, tallennetaanko: true }
      tentit6.tentit[action.payload].kysymykset.push({ kysymys: "", id: tentit6.tentit[action.payload].kysymykset.length + 1, vastaukset: [] })
      return tentit6

    case 'LISAA_VASTAUS':
      let tentit7 = { ...state, tallennetaanko: true }
      tentit7.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset.push({ id: action.payload.id, vastaus: "", oikein: false, valinta: false })
      return tentit7

    case 'KYSYMYS_OIKEIN':
      let tentit8 = { ...state, tallennetaanko: true }
      tentit8.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].oikein = !tentit8.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].oikein
      return tentit8

    case 'ASETA_VALINTA':
      let tentit9 = { ...state, tallennetaanko: true }
      tentit9.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].valinta = true
      return tentit9

    case 'ALUSTA_DATA':
      return { ...action.payload, tietoAlustettu: true }

    case 'PAIVITA_TALLENNUSTILA':
      return { ...state, tallennetaanko: action.payload }

    case 'PAIVITA_KAYTTAJA':
      return { ...state, kayttaja: action.payload, tallennetaanko: true }

    case 'PAIVITA_VASTAUKSET':
      return { ...state, naytaVastaukset: action.payload, tallennetaanko: true }

    default:
      throw new Error("Learn to code noob")
  }
}

const App = () => {
  const [tenttiDatat, dispatch] = useReducer(reducer, tenttiData)
  const [value, setValue] = useState([tenttiDatat.tentit[0]])
  const [vastaukset, setVastaukset] = useState(0)
  //window.localStorage.clear();

  useEffect(() => {
    let tenttejä = localStorage.getItem('tenttidata')

    if (tenttejä === null) {
      localStorage.setItem('tenttidata', JSON.stringify(tenttiData))
      dispatch({ type: 'ALUSTA_DATA', payload: tenttiData })
      console.log('data luettiin vakiosta')
      setValue([tenttiData.tentit[0]])
    } else {
      dispatch({ type: 'ALUSTA_DATA', payload: JSON.parse(tenttejä) })
      console.log('data luettiin local storagesta')
      setValue([JSON.parse(tenttejä).tentit[0]])
    }
  }, [])

  useEffect(() => {
    if (tenttiDatat.tallennetaanko === true) {
      localStorage.setItem('tenttidata', JSON.stringify(tenttiDatat))
      dispatch({ type: 'PAIVITA_TALLENNUSTILA', payload: false })
    }
  }, [tenttiDatat])

  const setToValue = (newValue) => {
    setValue(newValue)
    setVastaukset(0)
  }

  const oikeatVastaukset = () => {
    setVastaukset(1)
  }

  const kayttajaVaihto = () => {
    dispatch({ type: 'PAIVITA_KAYTTAJA', payload: tenttiDatat.kayttaja * -1 })
  }

  return (
    <div>
      {tenttiDatat.tietoAlustettu && <Header kayttajaVaihto={kayttajaVaihto} tenttiDatat={tenttiDatat} />}
      {tenttiDatat.tietoAlustettu && <Tentit
        tentit={tenttiDatat.tentit}
        value={value}
        setToValue={setToValue}
        dispatch={dispatch}
        onClick={oikeatVastaukset}
        vastaukset={vastaukset}
        kayttaja={tenttiDatat.kayttaja}
      />}
    </div>
  );
}

export default App