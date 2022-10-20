import Button from '@mui/material/Button';

const Header = ({ kayttajaVaihto, tenttiDatat }) => {
    return (
        <header>
            <nav className='nav'>
                <ul className='nav-items'>
                    <li className='tentteja'><Button style={{ color: '#fff' }} href="">TENTIT</Button></li>
                    <li className='tietoa'><Button style={{ color: '#fff' }} href="https://www.youtube.com/watch?v=sAqnNWUD79Q">TIETOA SOVELLUKSESTA</Button></li>
                    <li className='vaihda'><Button style={{ color: "#fff" }} onClick={kayttajaVaihto}>{tenttiDatat.kayttaja === -1 ? 'OPETTAJA' : 'OPPILAS'}</Button></li>
                    <li className='poistu'><Button style={{ color: "#fff" }} href="">POISTU</Button></li>
                </ul>
            </nav>
        </header >
    )
}

export default Header