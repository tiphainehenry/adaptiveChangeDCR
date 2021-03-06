import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import '../style/boosted.min.css';
import Authentification from './Authentification';
import {createBrowserHistory} from 'history'

import { User, Bell} from 'react-feather';

/**
 * Component ...
 */

const history = createBrowserHistory({ forceRefresh: true });
class Header extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      auth: {},
      AdminOnly: [
        '/createL',
        '/createG',
        '/newrole',
        '/welcomemodel',
      ],
      path: ''
    }
    this.childElement = React.createRef()
    this.getStatus = this.getStatus.bind(this)
  }

  componentDidMount() {
    const path = window.location.pathname
    this.setState({ path: path });
  }
  getStatus = auth => {
    this.setState({ auth })
    if ((!this.state.auth.isRole && window.location.pathname !== '/') ||
      (!this.state.auth.isAdmin && this.state.AdminOnly.find(elem => elem === this.state.path) !== undefined)) {
      history.push("/")
    }
  }

  render() {
    let links = []
    if (this.state.auth.isAdmin) {
      links.push(<Nav.Link key='welcomeInstance' href="/welcomeInstance" className="nav-item" style={{ color: "white" }}> My Running Instances (admin view)</Nav.Link>)
      links.push(<Nav.Link key='welcomemodel' href="/welcomemodel" className="nav-item" style={{ color: "white" }}>My Process Models (admin view) </Nav.Link>)
    }
    return <div>
      <Authentification status={this.getStatus} />
      <Navbar style={{ 'position': 'fixed', 'width': '100%' }} collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top" className="navbar navbar-expand-md navbar-dark bg-dark fixed-top flex-md-nowrap">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/" className="nav-item" style={{ color: "white" }}>Homepage</Nav.Link>
            {links}
          </Nav>

          <Nav >
          <Nav.Link href="/mynotifications" className="nav-item" style={{ color: "white" }}> <Bell />
 Change requests</Nav.Link>

            {this.state.auth.isRole ?
              <NavDropdown title={<>
                <User />
                <span>Hello <span className="text-primary">{this.state.auth.name}</span></span></>
              } id="collasible-nav-dropdown">
                <NavDropdown.Item style={{ "fontSize": '16px' }}><p>Admin : {this.state.auth.isAdmin ? "true" : "false"}</p>
                  <p>Account : {this.state.auth.isRole ? "true" : "false"}</p>
                  <p>Roles : {this.state.auth.isRole ? this.state.auth.myRoles.join(', ') : "false"}</p>

                </NavDropdown.Item>

              </NavDropdown>

              : null}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

    </div>
      ;
  }
}

export default Header

