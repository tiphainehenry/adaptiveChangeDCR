import React from 'react';
import '../style/boosted.min.css';
import Header from './Header';
import Authentification from './Authentification'

/**
 * Component ...
 */
class Homepage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      auth: [],
      registered: false,
      username: '',
      isAdmin: false,
      childState: null,
      once: true

    }
    this.childElement = React.createRef()
    this.getStatus = this.getStatus.bind(this)
  }

  getStatus = auth => this.setState({ auth })

  render() {

    var content = []
    if (this.state.auth[0] !== "Not registered") {
      return <div>
        <Header />
        <Authentification status={this.getStatus} />
        <div className="bg-green pt-5 pb-3">
          <div className='container'>
            <section className="jumbotron text-center">
              <div className="container">
                <h1>DCR projecion tool</h1>
                <p className="lead text-muted">Welcome to the experimental platform.</p>
              </div>
              <br />
              <br />
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-4">
                    <div className="card" style={{ width: 18 + 'rem' }}>
                      <img className="card-img-top" src="API-S_RGB-5.png" alt="Card cap"></img>
                      <div className="card-body">
                        <h5 className="card-title">Monitor deployed instances</h5>
                        <p className="card-text">access all the inter-organizational process instances currently running, and execute role activities on the dedicated projections.</p>
                        <a href="/welcomeinstance" className="btn btn-secondary my-2">Go to my instances</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="card" style={{ width: 18 + 'rem' }}>
                      <img className="card-img-top" src="API-S2_RGB-5.png" alt="Card cap"></img>
                      <div className="card-body">
                        <h5 className="card-title">Create new models</h5>
                        <p className="card-text">access the template libraries, or create a new inter-organizational process model from scratch, and deploy it.</p>
                        <a href="/welcomemodel" className="btn btn-secondary my-2">Go to my process models</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    } else {
      return (
        <div className="bg-green pt-5 pb-3">
          <div className='container'>
            <section className="jumbotron text-center">
              <div className="container">
                <h1>DCR projecion tool</h1>
                <p className="lead text-muted">Welcome to the experimental platform.</p>
              </div>
              <br />
              <br />
              <p style={{ color: 'Red' }}>Your Account isn't curently registered. Please contact admins</p>
            </section>
          </div>
        </div>)
    }
  }
}

export default Homepage
