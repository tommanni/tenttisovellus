import './App.css';
import Header from './components/Header'
import Tentit from './components/Tentit'
import Kirjaudu from './components/Kirjaudu';
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
        const result = await axios.get('http://localhost:8080');
        console.log(result.data)
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
          const lisaaVastaus = async (kysymysId) => {
            await axios.post('http://localhost:8080/lisaa-vastaus', { kysymysId: kysymysId })
          }
          lisaaVastaus(tenttiDatat.idList[0])
          break

        case 'VOikein':
          const vaihdaOikein = async (vastausId, oikein) => {
            await axios.put('http://localhost:8080/vastaus-oikein', { vastausId: vastausId, oikein: oikein })
          }
          vaihdaOikein(tenttiDatat.idList[0], tenttiDatat.idList[1])
          break

        default:
          break
      }
    }
    if (tenttiDatat.tallennetaanko === true) {
      saveData()
    }
  }, [tenttiDatat])

  const setToValue = (tenttiId) => {
    const muutaVoimassa = async () => {
      await axios.put('http://localhost:8080/muuta-voimassa', { tenttiId: tenttiId, vanhaTenttiId: Object.keys(value[0]).length !== 0 ? value[0].id : 0 })
    }
    muutaVoimassa()
    setValue([tenttiDatat.tentit.find(tentti => tentti.id === tenttiId)])
    setVastaukset(0)
  }

  const oikeatVastaukset = () => {
    setVastaukset(1)
  }

  return (
    < TenttiContext.Provider value={{
      tenttiDatat: tenttiDatat, dispatch: dispatch, kirjauduttu: tenttiDatat.kirjauduttu,
      tentit: tenttiDatat.tentit, value: value, setToValue: setToValue,
      setValue: setValue, oikeatVastaukset: oikeatVastaukset, kayttaja: Object.keys(tenttiDatat).length > 0 && tenttiDatat.kayttaja.admin,
      vastaukset: vastaukset, rekisteröidytään: tenttiDatat.rekisteröidytään
    }
    }>
      <div>
        {tenttiDatat.tietoAlustettu && <Header />}
        {tenttiDatat.tietoAlustettu && tenttiDatat.kirjauduttu && <Tentit />}
        <div className='kirjaudu'>
          {!tenttiDatat.kirjauduttu && <Kirjaudu />}
        </div>
      </div>
    </TenttiContext.Provider >
  );
}

export default App