import React from 'react'
import { Nav, Navbar, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NavBar = ({ user, handleLogout }) => (
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#">BLOGAPP</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="/users">
        <Link to='/users'>Users</Link>
      </Nav.Link>
      <Nav.Link href="#">
        <Link>Blogs</Link>
      </Nav.Link>
    </Nav>
    <Navbar.Text>
      { user } logged in
    </Navbar.Text>
     <Button variant="outline-info"onClick={handleLogout}>logout</Button>{' '}
  </Navbar>
  )

export default NavBar
