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
      let tentit1 = { ...state, tallennetaanko: true, method: "TNMuuttui", idList: [action.payload.tentinId, action.payload.nimi] }
      tentit1.tentit[action.payload.tentinIndex].nimi = action.payload.nimi
      return tentit1

    case "KYSYMYKSEN_NIMI_MUUTTUI":
      let tentit2 = { ...state, tallennetaanko: true, method: "KNMuuttui", idList: [action.payload.tenttiId, action.payload.kysymysId, action.payload.nimi] }
      tentit2.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].kysymys = action.payload.nimi
      return tentit2

    case "VASTAUKSEN_NIMI_MUUTTUI":
      let tentit3 = { ...state, tallennetaanko: true, method: "VNMuuttui", idList: [action.payload.kysymysId, action.payload.vastausId, action.payload.nimi] }
      tentit3.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].vastaus = action.payload.nimi
      return tentit3
    //Poistetaan kysymys filtteröimällä se pois
    case 'POISTA_KYSYMYS':
      let tentit4 = { ...state, tallennetaanko: true, method: 'PKysymys', idList: [action.payload.tenttiId, action.payload.kysymys, state.kayttaja.id] }
      tentit4.tentit[action.payload.tenttiIndex].kysymykset = tentit4.tentit[action.payload.tenttiIndex].kysymykset.filter(kysymys => kysymys.kysymys !== action.payload.kysymys)
      return tentit4
    //Poistetaan vastaus filtteröimällä se pois
    case 'POISTA_VASTAUS':
      let tentit5 = { ...state, tallennetaanko: true, method: 'PVastaus', idList: [action.payload.kysymysId, action.payload.vastaus, state.kayttaja.id] }
      tentit5.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset = tentit5.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastaukset.filter(vastaus => vastaus.vastaus !== action.payload.vastaus)
      return tentit5

    case 'LISAA_TENTTI':
      let tentit10 = { ...state, tallennetaanko: true, method: 'LTentti' }
      let idList = tentit10.tentit.map(tentti => tentti.id)
      tentit10.tentit.push({ nimi: 'UUSI TENTTI', id: Math.max(idList) + 1, kysymykset: [] })
      return tentit10

    case 'POISTA_TENTTI':
      let tentit11 = { ...state, tallennetaanko: true, method: 'PTentti', idList: [action.payload.tenttiId] }
      tentit11.tentit = tentit11.tentit.filter(tentti => tentti.id !== action.payload.tenttiId)
      return tentit11

    case 'LISAA_KYSYMYS':
      let tentit6 = { ...state, tallennetaanko: true, method: 'LKysymys', idList: [state.tentit[action.payload].id] }
      let idList2 = tentit6.tentit[action.payload].kysymykset.map(kysymys => kysymys.id)
      tentit6.tentit[action.payload].kysymykset.push({ kysymys: "", id: Math.max(idList2) + 1, vastaukset: [] })
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
      axios.post('http://localhost:8080/rekisteroidytaan', { data: false })
      return tentit12

    case 'KIRJAUDU':
      let kayttaja = state.kayttajat.filter(kayttaja => kayttaja.kayttajatunnus === action.payload.kayttajatunnus && kayttaja.salasana === action.payload.salasana)
      if (kayttaja.length === 0) {
        alert('Nimessä tai salasanassa on virhe')
        return { ...state, tallennetaanko: true }
      }
      axios.post('http://localhost:8080/kirjaudu', { data: kayttaja[0] })
      let tentit13 = { ...state, kayttaja: kayttaja[0], kirjauduttu: true, tallennetaanko: true }
      return tentit13

    case 'REKISTEROIDYTAAN':
      let tentit14 = { ...state, rekisteröidytään: true }
      axios.post('http://localhost:8080/rekisteroidytaan', { data: true })
      return tentit14

    case 'POISTU':
      let tentit15 = { ...state, kirjauduttu: false, tallennetaanko: true }
      axios.post('http://localhost:8080/poistu')
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
        console.log(result.data)
        //console.log('data', result.data.data.tentit)
        dispatch({ type: "ALUSTA_DATA", payload: { data: result.data, setValue: setValue } })
      }
      getData()
    } catch (error) {
      console.log("virhetilanne:", error)
    }

  }, [])

  useEffect(() => {

    const saveData = async () => {
      switch (tenttiDatat.method) {
        case 'TNMuuttui':
          const muutaTentinNimi = async (tenttiId, nimi) => {
            await axios.put('http://localhost:8080/tentin-nimi-muuttui', { tenttiId: tenttiId, nimi: nimi })
          }
          muutaTentinNimi(tenttiDatat.idList[0], tenttiDatat.idList[1])
          break

        case 'KNMuuttui':
          const muutaKysymyksenNimi = async (tenttiId, kysymysId, nimi) => {
            await axios.put('http://localhost:8080/kysymyksen-nimi-muuttui', { tenttiId: tenttiId, kysymysId: kysymysId, nimi: nimi })
          }
          muutaKysymyksenNimi(tenttiDatat.idList[0], tenttiDatat.idList[1], tenttiDatat.idList[2])
          break

        case 'VNMuuttui':
          const muutaVastauksenNimi = async (kysymysId, vastausId, nimi) => {
            await axios.put('http://localhost:8080/vastauksen-nimi-muuttui', { kysymysId: kysymysId, vastausId: vastausId, nimi: nimi })
          }
          muutaVastauksenNimi(tenttiDatat.idList[0], tenttiDatat.idList[1], tenttiDatat.idList[2])
          break

        case 'PTentti':
          const poistaTentti = async (tenttiId) => {
            await axios.delete('http://localhost:8080/poista-tentti', { data: { tenttiId: tenttiId } })
          }
          poistaTentti(tenttiDatat.idList[0])
          break

        case 'PKysymys':
          const poistaKysymys = async (tenttiId, kysymys, userId) => {
            await axios.delete('http://localhost:8080/poista-kysymys', { data: { tenttiId: tenttiId, kysymys: kysymys, userId: userId } })
          }
          poistaKysymys(tenttiDatat.idList[0], tenttiDatat.idList[1], tenttiDatat.idList[2])
          break

        case 'PVastaus':
          const poistaVastaus = async (kysymysId, vastaus, userId) => {
            await axios.delete('http://localhost:8080/poista-vastaus', { data: { kysymysId: kysymysId, vastaus: vastaus, userId: userId } })
          }
          poistaVastaus(tenttiDatat.idList[0], tenttiDatat.idList[1], tenttiDatat.idList[2])
          break

        case 'LTentti':
          const lisaaTentti = async () => {
            await axios.post('http://localhost:8080/lisaa-tentti')
          }
          lisaaTentti()
          break

        case 'LKysymys':
          const lisaaKysymys = async (tenttiIndex) => {
            await axios.post('http://localhost:8080/lisaa-kysymys', { tenttiIndex: tenttiIndex })
          }
          lisaaKysymys(tenttiDatat.idList[0])
          break

        case 'LVastaus':


        default:
          break
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



/* try {
  await axios.post('http://localhost:8080', {
    data: tenttiDatat
  })
  dispatch({ type: 'PAIVITA_TALLENNUSTILA', payload: false })
} catch (error) {
  console.log("virhetilanne:", error)
} */