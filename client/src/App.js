import React from 'react';
import './style/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Route,
  Switch,
  BrowserRouter
} from "react-router-dom";
import Homepage from './components/Homepage';
import NewInstance from './components/NewInstance';
import ViewPublic from './components/ViewPublic';
import ViewRi from './components/ViewRi';
import Edit from './components/Edit';
import EditionDeck from './components/EditionDeck';
import Create from './components/Create';
import WelcomeInstance from './components/WelcomeInstance';
import WelcomeModel from './components/WelcomeModel';
import CreationDeck from './components/CreationDeck';
import NewRole from './components/NewRole';
import Headers from './components/Header';


const App = () => (
  <BrowserRouter>
      <div className="sans-serif">
      <Headers/>
      <Route exact path="/" component={Homepage} />
      <Route exact path="/welcomeinstance" component={WelcomeInstance} />
      <Route exact path="/welcomemodel" component={WelcomeModel} />
      <Route exact path="/edit" component={Edit} />
      <Route exact path="/editing" component={EditionDeck} />
      <Route exact path="/create" component={Create} />
      <Route exact path="/new" component={NewInstance} />
      <Route exact path="/creation" component={CreationDeck} />
      <Route exact path="/newrole" component={NewRole} />
      <Switch>
          <Route 
          exact 
          path="/tenantInstance/:pid/:rid" 
          render={({ 
              location, 
              match 
          }) => (
              <ViewRi match={match} />
          )}           
          
         />
      </Switch>

      <Route exact path="/tenantInstance" component={ViewRi} />
      <Route exact path="/publicInstance" component={ViewPublic} />

    </div>
  </BrowserRouter>
);

//render(<App />, document.getElementById('root'));
//<Route exact path="/GraphPage" component={View} />
export default App;
