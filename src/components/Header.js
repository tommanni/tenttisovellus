import Button from '@mui/material/Button';

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

export default Header