import './App.css';
import tenttiData from './components/TenttiData'
import Header from './components/Header'
import Tentit from './components/Tentit'
import { useState, useReducer } from 'react'

function reducer(state, action) {

  switch (action.type) {

    case "TENTIN_NIMI_MUUTTUI":
      let nimiTentit = [...state]
      nimiTentit[action.payload.tentinIndex].nimi = action.payload.nimi
      return nimiTentit

    case "KYSYMYKSEN_NIMI_MUUTTUI":
      console.log("Reduceria kutsuttiin", action)
      let kysymysTentit = [...state]
      kysymysTentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].kysymys = action.payload.nimi
      return kysymysTentit

    default:
      throw new Error("Epic fail")
  }
}

const App = () => {
  const [tentit, dispatch] = useReducer(reducer, tenttiData)
  const [value, setValue] = useState([tenttiData[0]])
  const [vastaukset, setVastaukset] = useState(0)

  const setToValue = (newValue) => {
    setValue(newValue)
    setVastaukset(0)
  }

  const oikeatVastaukset = () => {
    setVastaukset(1)
  }

  return (
    <div>
      <Header />
      <Tentit tentit={tentit} value={value} setToValue={setToValue} dispatch={dispatch} onClick={oikeatVastaukset} vastaukset={vastaukset} />
    </div>
  );
}

export default App