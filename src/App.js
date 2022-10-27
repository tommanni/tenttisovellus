import './App.css';
//import tenttiData from './components/TenttiData'
import Header from './components/Header'
import Tentit from './components/Tentit'
import Kirjaudu from './components/Kirjaudu';
import { useState, useReducer, useEffect } from 'react'
import axios from 'axios'

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

    case 'LISAA_KAYTTAJA':
      let tentit12 = { ...state, tallennetaanko: true, rekisteröidytään: false }
      const isFound = tentit12.kayttajat.some(kayttaja => {
        if (kayttaja.kayttajatunnus === action.payload.kayttajatunnus) {
          return true
        }
        return false
      })
      if (isFound) {
        alert('Käyttäjätunnus on varattu')
        return { ...state, tallennetaanko: true }
      }
      tentit12.kayttajat.push({ kayttajatunnus: action.payload.kayttajatunnus, salasana: action.payload.salasana, admin: action.payload.admin })
      return tentit12

    case 'KIRJAUDU':
      console.log('oafiejasfie')
      let kayttaja = state.kayttajat.filter(kayttaja => kayttaja.kayttajatunnus === action.payload.kayttajatunnus && kayttaja.salasana === action.payload.salasana)
      if (kayttaja.length === 0) {
        console.log('sdfsadfsaf')
        return { ...state, tallennetaanko: true }
      }
      let tentit13 = { ...state, kayttaja: kayttaja[0], kirjauduttu: true, tallennetaanko: true }
      return tentit13

    case 'REKISTEROIDYTAAN':
      let tentit14 = { ...state, rekisteröidytään: true }
      return tentit14

    case 'POISTU':
      let tentit15 = { ...state, kirjauduttu: false, tallennetaanko: true }
      return tentit15

    case 'ALUSTA_DATA':
      action.payload.setValue(action.payload.data.tentit)
      return { ...action.payload.data, tietoAlustettu: true }

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
  const [tenttiDatat, dispatch] = useReducer(reducer, {})
  const [value, setValue] = useState({})
  const [vastaukset, setVastaukset] = useState(0)
  //window.localStorage.clear();

  useEffect(() => {
    try {
      const getData = async () => {
        const result = await axios.get('http://localhost:8080');
        //console.log('data', result.data.data.tentit)
        dispatch({ type: "ALUSTA_DATA", payload: { data: result.data.data, setValue: setValue } })
      }
      getData()
    } catch (error) {
      console.log("virhetilanne:", error)
    }

  }, [])

  useEffect(() => {

    const saveData = async () => {

      try {
        await axios.post('http://localhost:8080', {
          data: tenttiDatat
        })
        dispatch({ type: 'PAIVITA_TALLENNUSTILA', payload: false })
      } catch (error) {
        console.log("virhetilanne:", error)
      }
    }
    if (tenttiDatat.tallennetaanko === true) {
      saveData()
    }
  }, [tenttiDatat])

  const setToValue = (newValue) => {
    setValue(newValue)
    setVastaukset(0)
  }

  const oikeatVastaukset = () => {
    setVastaukset(1)
  }

  return (
    <div>
      {tenttiDatat.tietoAlustettu && <Header dispatch={dispatch} kirjauduttu={tenttiDatat.kirjauduttu} />}
      {tenttiDatat.tietoAlustettu && tenttiDatat.kirjauduttu && <Tentit
        tentit={tenttiDatat.tentit}
        value={value}
        setToValue={setToValue}
        dispatch={dispatch}
        onClick={oikeatVastaukset}
        vastaukset={vastaukset}
        kayttaja={tenttiDatat.kayttaja.admin}
      />}
      <div className='kirjaudu'>
        {!tenttiDatat.kirjauduttu && <Kirjaudu dispatch={dispatch} rekisteröidytään={tenttiDatat.rekisteröidytään} />}
      </div>
    </div>
  );
}

export default App