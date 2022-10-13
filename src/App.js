import './App.css';
import Button from '@mui/material/Button';
import tentit from './TenttiData'
import Checkbox from '@mui/material/Checkbox'
import { useState } from 'react'



const App = () => {

  const [value, setValue] = useState([tentit[0]])

  const setToValue = (newValue) => {
    setValue(newValue)
  }

  return (
    <div>
      <Header />
      <Tentit tentit={tentit} value={value} setToValue={setToValue} />
    </div>
  );
}

const Header = () => {
  return (
    <header>
      <nav className='nav'>
        <ul className='nav-items'>
          <li><Button style={{ color: '#fff' }} variant='outlined' href="">TENTIT</Button></li>
          <li><Button style={{ color: '#fff' }} variant='outlined' href="https://www.youtube.com/watch?v=sAqnNWUD79Q">TIETOA SOVELLUKSESTA</Button></li>
          <li className='poistu'><Button style={{ color: "#fff" }} variant='outlined' href="">POISTU</Button></li>
        </ul>
      </nav>
    </header >
  )
}

const Tentit = ({ tentit, value, setToValue }) => {
  return (
    <div className='tentit'>
      {tentit.map(tentti => <Button key={tentti.id} onClick={() => setToValue([tentti])}>{tentti.nimi}</Button>)}
      {value.map(tentti => <Tentti key={tentti.id} tentti={tentti} />)}
      <Button variant="contained">NÄYTÄ VASTAUKSET</Button>
    </div>
  )
}

const Tentti = ({ tentti }) => {
  return (
    <div>
      {tentti.kysymykset.map(kysymys => <Kysymys key={kysymys.id} kysymysNimi={kysymys.kysymys} kysymys={kysymys} />)}
    </div>

  );
}

const Kysymys = (props) => {
  return (
    <div className='kysymys'>
      <p><b>{props.kysymysNimi}</b></p>
      {props.kysymys.vastaukset.map(vastaus => <div key={props.kysymys.vastaukset.indexOf(vastaus)} className='vastaus'><Checkbox />{vastaus}</div>)}
    </div>

  )
}

export default App
