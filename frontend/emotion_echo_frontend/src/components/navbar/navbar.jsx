import React, {useState, useEffect} from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './navbar.css'

const navbar = () => {

    const [name, setName] = useState("Unknown");

    useEffect(() => {
        const name = localStorage.getItem('name');

        if (name) {
            setName(name)
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
      };

  return (
    <Navbar className="navbar_color">
      <Container>
        <Navbar.Brand>Emotion Echo</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
            <NavDropdown title={name} className='text-dark'>
                <NavDropdown.Item className='text-danger' onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default navbar