import { Cpu } from "react-feather";

const dcrHelpers = {

  /**
  * handle activity update
  * @param e: click event
  */
  computeRoles: function (roles) {
    var roleMaps = []
    var tmpRoles = []
    var tmpAddress = []

    roles.forEach(line => {
      var r = line.split('///')[0];
      var a = line.split('///')[1];
      tmpRoles.push(r);
      tmpAddress.push(a);
      roleMaps.push({'role':r, 'address':a});

    });

    this.setState({
      roles: tmpRoles,
      addresses: tmpAddress,
      roleMaps:roleMaps
    })
  },



  cmpAccountRoles: function(roles) {
    var roleMaps = []
    var tmpRoles = []
    var tmpAddress = []

    console.log(roles);

    roles.forEach(line => {
      var r = line.split('///')[0].replace('///', '');
      var a = line.split('///')[1];

      if ((r !== '') && (!tmpRoles.includes(r))) {
        tmpRoles.push(r);
        tmpAddress.push(a);
        roleMaps.push({'role':r, 'address':a});
      };
  
    })

    this.setState({ 
        roles: tmpRoles, 
        addresses: tmpAddress, 
        roleMaps:roleMaps,
      })

      console.log(tmpRoles);
    },

    //////////  LISTENERS /////////////////

  /**
   * Listeners to monitor node click events.
   */
   setUpNodeListeners: function () {

    this.cy.on('click', 'node', (event, data) => {
      //getClikedNode
      if ((!event.target['_private']['classes'].has('selected')) && (this.state.numSelected < 2)) {
        console.log(event.target['_private']['data']['id'] + ' clicked');
        console.log(event.target['_private']['classes']);
        

        var type = '';
        if (event.target['_private']['classes'].has('subgraph')) {
          type = 'subgraph';
        }

        /// monitor clicked elements
        switch (this.state.numSelected) {
          case 0:
            console.log('source');
            this.setState({
              source: {
                ID: event.target['_private']['data']['id'],
                type: type
              }
            });
            break;
          case 1:
            console.log('target');
            this.setState({
              target: {
                ID: event.target['_private']['data']['id'],
                type: type
              }
            });
            break;
          default: console.log('num selected nodes: ' + this.state.numSelected);
        }

        // update states
        this.cy.getElementById(event.target['_private']['data']['id']).addClass('selected');

        var isChoreo=false;
        var activityName = ''
        if((event.target['_private']['classes'].has("type_projChoreo"))){
          isChoreo=true;
          console.log('ischoreo:', isChoreo);
          activityName = event.target['_private']['data']['name'].split('(')[1].split(',')[0];
        }
        else if((event.target['_private']['classes'].has("type_choreography"))){
          isChoreo=true;
          activityName = event.target['_private']['data']['name'].split('\n')[1];
        }
        else{
          activityName=event.target['_private']['data']['name'].split(' ')[1];
        }
        this.setState({
          elemClicked: {
            id: event.target['_private']['data']['id'],
            activityName: activityName,
            raw_activityName:event.target['_private']['data']['name'],
            classes: event.target['_private']['classes'],
            type: event.target['_private']['group'],
            isChoreo: isChoreo
          },
          numSelected: this.state.numSelected + 1
        });
      }

      else if (event.target['_private']['classes'].has('selected')) {
        this.cy.getElementById(event.target['_private']['data']['id']).removeClass('selected');

        if (this.state.numSelected !== 1) {
          this.setState({ numSelected: this.state.numSelected - 1 });
        }

      }
      else {
        console.log('two elements already selected');
      }
    });

  },

  /**
   * Listeners to monitor edge/relations click events.
   */
  setUpEdgeListeners: function () {
    this.cy.on('click', 'edge', (event, data) => {
      console.log(event.target['_private']['data']['id'] + ' clicked');
      var idSelected = event.target['_private']['data']['id'];
      var elemType = event.target['_private']['group'];

      this.setState({
        elemClicked: {
          id: idSelected,
          activityName: '',
          classes: '',
          type: elemType
        }
      })
    })
  },


  switchDest: function() {
    const tmp = this.state.choreographyNames.sender
    this.setState({
      choreographyNames: {
        sender: this.state.choreographyNames.receiver,
        receiver: tmp
      }
    })
  }



}
 
export default dcrHelpers;