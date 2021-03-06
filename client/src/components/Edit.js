import React from 'react';

import Header from './Header';

import { Row, Container, Nav, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import SidebarModel from './SidebarModel';


var ProcessDB = require('../projections/DCR_Projections.json');

/**
 * Component displaying all possible projections to update
 */
class Edit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      roleLength: '',
      roles: [],
      tree: [],


      elemClicked: {
        id: '',
        activityName: '',
        classes: '',
        type: ''
      },

      numSelected: 0,

      tenantName: '',

      choreographyNames: {
        sender: '',
        receiver: '',
      },

      markings: {
        included: 0,
        executed: 0,
        pending: 0
      },

      newActivityCnt: 0,

      source: { ID: '', type: '' },
      target: { ID: '', type: '' }
    };

  }

  /**
   * Lists all processes and their role projections, and stores it into the tree state variable
   */
  componentDidMount = async () => {
    var numProcess = Object.keys(ProcessDB).length;

    var tree = [];

    for (var j = 0; j < numProcess; j++) {

      var dcrText = ProcessDB[Object.keys(ProcessDB)[j]]['TextExtraction']
      var name = ProcessDB[Object.keys(ProcessDB)[j]]['id']

      var roleLength = dcrText['roleMapping'].length;

      var i;
      var roles = [];
      for (i = 1; i <= roleLength; i++) {
        var role = [];
        var r = 'r' + i;
        role.push(r);
        role.push(dcrText[r]['role'])
        roles.push(role)
      }
      this.setState({
        roleLength: roleLength,
        roles: roles
      });

      var process = [];
      process.push('process ' + name);
      process.push(roles);
      tree.push(process);

    }

    this.setState({ 'tree': tree });

  };

  render() {


    return <>
      <div>
        
        <Header />
        <Row>
                <SidebarModel />

                <div class="bg-green col-md-9 ml-sm-auto col-lg-10 px-md-4">
                    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 ">
                        <Container flex>

                            <div className='container'>
                  <h2>Edit Graph</h2>

                  <div className="well">Choose the process projection to edit:</div>

                  <div className="bg-green">
                    <Nav >
                      {this.state.tree.map((process, i) => {
                        console.log(process);
                        return <Nav key={i} title={process[0]} className='sidebarLink'>
                          <div style={{ 'padding-right': '10%', 'width': '20vw' }}>
                            <ListGroup>
                              <ListGroup.Item className='processHeader'>
                                {process[0]}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                {process[1].map(item =>
                                  <ul>
                                    <Nav.Item >
                                      <Nav.Link as={Link}
                                        to={{
                                          pathname: './editing',
                                          state: {
                                            currentProcess: process[0].split(' '),
                                            currentInstance: item[0]
                                          }
                                        }}
                                      >
                                        Proj {item[1]}
                                      </Nav.Link>
                                    </Nav.Item>
                                  </ul>

                                )}

                              </ListGroup.Item>
                            </ListGroup>
                          </div>

                        </Nav>
                      }
                      )
                      }


                    </Nav>
                    </div>

                  </div>
                      </Container>
                    </div>
                </div>

            </Row>
        </div>    
        </>

  }
}

export default Edit
