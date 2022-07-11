import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import PublicDCRManager from "../contracts/PublicDCRManager.json";
import AccessMatrix from '../contracts/Access_matrix.json';
import getWeb3 from "../getWeb3";

import { Button, Table } from 'react-bootstrap';
import { Info } from 'react-feather';

var node_style = require('../style/nodeStyle.json')
var edge_style = require('../style/edgeStyle.json')
var cyto_style = require('../style/cytoStyle.json')['dcr']


var ProcessDB = require('../projections/DCR_Projections.json');

/**
 * Component uploading a new public instance into the smart contract graph manager
 */
class LoadToBCL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      data: '',
      lenDataDB: 0,
      wkState: '... waiting for Smart Contract instanciation ...',
      rolesWithAddresses: props.rolesWithAddresses,

      addresses: [],
      access_matrix: null,
      includedStates: '',
      executedStates: '',
      pendingStates: '',
      includesTo: '',
      excludesTo: '',
      responsesTo: '',
      conditionsFrom: '',
      milestonesFrom: '',
      publicData: '',
      ethAddress: ''
    };
    this.handleCreateWkf = this.handleCreateWkf.bind(this);
    this.connectToWeb3 = this.connectToWeb3.bind(this);
    this.getWKCreationReceipt = this.getWKCreationReceipt.bind(this);
    this.fetchWKData = this.fetchWKData.bind(this);
  }

  /**
   * checks whether any process instance has been uploaded.
   */
  componentDidMount() {
    this.setState({ lenDataDB: Object.keys(ProcessDB).length });
  }

  /**
   * uploads the public view stored locally after having generated the projection and connects to web3.
   */
  componentWillMount() {

    var lenDataDB = Object.keys(ProcessDB).length;

    try {
      if (lenDataDB > 0) {
        // connect list of activities to corresponding role first, and then to the right role address
        var wkData = this.fetchWKData(Object.keys(ProcessDB)[1]);
        this.setState({
          lenDataDB: lenDataDB,
          data: wkData[0],
          processName: wkData[1],

          activityNames: wkData[2],
          includedStates: wkData[3],
          executedStates: wkData[4],
          pendingStates: wkData[5],
          includesTo: wkData[6],
          excludesTo: wkData[7],
          responsesTo: wkData[8],
          conditionsFrom: wkData[9],
          milestonesFrom: wkData[10],
          addresses: wkData[11],
          approvalList: wkData[12],
          publicData: wkData[13]
        });
      }

    }
    catch {
      console.log('initialization of the db')
    }
    this.connectToWeb3()

  }
  /**
   * connects to web3.js
   */
  async connectToWeb3() {

    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PublicDCRManager.networks[networkId];
      const instance = new web3.eth.Contract(
        PublicDCRManager.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ contract: instance });




      // Checking if contract already populated
      //this.setState({ wkState: '2./ Uploaded' })

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. 
          Check console for details.
          Tip: Webpage should be connected to the Ropsten network via Metamask (https://metamask.io/).`,
      );
      console.error(error);
    };
  }

  fetchWKData(pid) {

    //Object.keys(ProcessDB).forEach(k => {console.log(k)});
    // console.log(ProcessDB[pid]);

    var activities = ProcessDB[pid]['TextExtraction']['public']['privateEvents'];



    var orderedPk = []
    var orderedNames = ProcessDB[pid]['Public']['vect']['activityNames']['default'];

    for (let i in orderedNames) {
      let matchingPk = ''
      Object.keys(activities).forEach(k => {
        if (activities[k].eventName === orderedNames[i]) {
          //console.log("Match between " + orderedNames[i]+"and"+activities[k].eventName);
          matchingPk = activities[k].address;
        }
      });
      if (matchingPk !== '') {
        orderedPk.push(matchingPk);
      }
    }
    let approvalList = [...new Set(orderedPk)];

    var PubVec = ProcessDB[pid]['Public']['vect'];
    return [ProcessDB[pid]['Global']['data'],
      pid,
    PubVec['activityNames']['default'],
    PubVec['fullMarkings']['included'],
    PubVec['fullMarkings']['executed'],
    PubVec['fullMarkings']['pending'],
    PubVec['fullRelations']['include'],
    PubVec['fullRelations']['exclude'],
    PubVec['fullRelations']['response'],
    PubVec['fullRelations']['condition'],
    PubVec['fullRelations']['milestone'],
      orderedPk,
      approvalList,
    ProcessDB[pid]['variables']
      //PubVec['publicData'].toString()
    ]


  }
  /**
   * Get workflow creation receipt.
   */

  getWKCreationReceipt = async () => {

    try {
      this.setState({ blockNumber: "waiting.." });
      this.setState({ gasUsed: "waiting..." });

      // get Transaction Receipt in console on click
      // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
      await this.state.web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt) => {
        console.log(err, txReceipt);
        this.setState({ txReceipt });
        console.log('tx receip null');
      }); //await for getTransactionReceipt

      await this.setState({ blockNumber: this.state.txReceipt.blockNumber });
      await this.setState({ gasUsed: this.state.txReceipt.gasUsed });
    } //try
    catch (error) {
      console.log('getWKCreationReceipt error');

      console.log(error);
    } //catch
  } //getWKCreationReceipt

  setAccessMatrix = (p) => {
    this.setState({ rolesWithAddresses: p });
  }


  /**
   * launches a transaction to the smart contract workflow manager to create a new workflow.
   */
  handleCreateWkf = async (event) => {
    alert('Save public view onchain');
    event.preventDefault();
    const { accounts, contract } = this.state;


    // try {
    // connect list of activities to corresponding role first, and then to the right role address

    alert(this.props.processID);
    console.log("addresses = ", this.props.rolesWithAddresses);
    var wkData = this.fetchWKData(this.props.processID);
    console.log(wkData);

    var data = wkData[0];
    var processName = wkData[1];

    var activityNames = wkData[2];
    var includedStates = wkData[3];
    var executedStates = wkData[4];
    var pendingStates = wkData[5];
    var includesTo = wkData[6];
    var excludesTo = wkData[7];
    var responsesTo = wkData[8];
    var conditionsFrom = wkData[9];
    var milestonesFrom = wkData[10];
    var addresses = wkData[11];
    var approvalList = wkData[12];
    var matrix = wkData[13];
    //        var publicData = wkData[13];
    var access_matrix_raw = [];
    console.log("matrix to upload to access contract", matrix)
    for (let k = 0; k < matrix.length; k++) {
      console.log(matrix[k].matrix)
      for (const [key, value] of Object.entries(matrix[k].matrix)) {
        console.log(key, value)
        let m = value.matrix;
        for (let j = 0; j < value.length; j++) {
          let m = value[j].matrix;
          let number_to_push = m[3] * 8 + m[2] * 4 + m[1] * 2 + m[0] * 1;
          console.log(number_to_push);
          access_matrix_raw.push(number_to_push);
        }
        console.log(m)
        // let m = matrix[k].matrix[j].matrix;

      }
    }

    console.log(access_matrix_raw);

    this.setState({
      data,
      processName,

      activityNames,
      includedStates,
      executedStates,
      pendingStates,
      includesTo,
      excludesTo,
      responsesTo,
      conditionsFrom,
      milestonesFrom,
      addresses,
      approvalList
      //          publicData
    });

    if (includedStates.length === 0) {
      alert("oops -didnt have time to update freshly updated db [to be implemented]");
    }
    else {
      console.log('passed the if statement');

      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      // const deployedNetwork = PublicDCRManager.networks[networkId];
      var relations = [includesTo,
        excludesTo,
        responsesTo,
        conditionsFrom,
        milestonesFrom]

      let addressOfAccessMatrix = ""

      let r = await contract.methods.uploadPublicView(
        [includedStates, executedStates, pendingStates], //marking
        this.props.ipfsHash,
        addresses,
        approvalList,
        activityNames,
        processName,
        relations
      ).send({ from: accounts[0] }); //storehash
      let transactionHash = r.transactionHash;

      let getAccessMatrixaddress = await contract.methods.getVariableAddress(
        this.props.ipfsHash
      ).call();
      console.log(getAccessMatrixaddress);

      const matrixInstance = new web3.eth.Contract(
        AccessMatrix.abi,
        getAccessMatrixaddress
      );
      try {

        console.log(matrix);
        for (let k = 0; k < matrix.length; k++) {
          let activities_ = [];
          let roles_ = [];
          let vals_ = [];
          for (const [key, value] of Object.entries(matrix[k].matrix)) {
            let m = value.matrix;
            for (let j = 0; j < value.length; j++) {
              let m = value[j].matrix;
              let number_to_push = m[3] * 8 + m[2] * 4 + m[1] * 2 + m[0] * 1; // On construit le nombre 
              activities_.push(value[j].name);
              roles_.push(accounts[0]);
              vals_.push(number_to_push);
            }
          }
          // let name = this.props.ipfsHash + 
          let upload = await matrixInstance.methods.uploadMatrix(this.props.ipfsHash, matrix[k].name, activities_, roles_, vals_, vals_.length).send({ from: accounts[0] });
          console.log(upload);
        }
        // let upload = await matrixInstance.methods.uploadMatrix()
        // let setname = await matrixInstance.methods.setVariableName(matrix[0].name).send({from : accounts[0]}); 
        // let checkAccess = await matrixInstance.methods.updateMultipleMatrix(activities_, roles_, vals_, vals_.length).send({ from: accounts[0] });
      } catch (error) {
        console.log(error);
      }

      this.setState({ transactionHash, ethAddress: contract.options.address });


      //axios.post(`http://localhost:5000/reinit`, 
      //{
      //  processID:this.state.processName 
      //},
      //{"headers" : {"Access-Control-Allow-Origin": "*"}}
      //);
      // window.location.reload(false);

    }
    // }
    // catch (err) {
    //   window.alert('test' + err);

    //   this.setState({ wkState: '2/. Save public view onchain' });
    // }

  }


  render() {
    const layout = cyto_style['layoutCose'];
    const style = cyto_style['style'];
    const stylesheet = node_style.concat(edge_style)
    if (window.location.href.indexOf("creation"))
      return (<>

        <div className="form-group my-3" >
          <button onClick={this.handleCreateWkf} className="btn btn-secondary">
            {this.props.stage === "templateInstance" ? "3. " : "4. "} Instantiate view in smart contract
          </button>
        </div>

        <br />
        <br />
        {this.props.src === 'creation-deck' ? <></> : <>
          <Button onClick={this.getWKCreationReceipt} variant='info'> <span><Info /> <span>Get Transaction Receipt</span> </span></Button>


          <Table id="myTable" className="table tablesorter table-responsive">
            <thead className="cf">
              <tr>
                <th className="header" scope="col">Tx Receipt Category</th>
                <th className="header" scope="col">Values</th>
              </tr>
            </thead>
            <tbody>

              <tr>
                <td className="align-middle">IPFS Hash # stored on Eth Contract
                </td>
                <td className="align-middle">{this.props.ipfsHash}</td>

              </tr>

              <tr>
                <td className="align-middle">Ethereum Contract Address
                </td>
                <td className="align-middle">{this.state.ethAddress}</td>

              </tr>


              <tr>
                <td className="align-middle">Tx Hash # </td>
                <td className="align-middle">{this.state.transactionHash}</td>
              </tr>

              <tr>
                <td className="align-middle">Block Number # </td>
                <td className="align-middle">{this.state.blockNumber}</td>
              </tr>

              <tr>
                <td className="align-middle">Gas Used</td>
                <td className="align-middle">{this.state.gasUsed}</td>
              </tr>


            </tbody>
          </Table></>}</>

      )
    return <>
      {this.state.lenDataDB > 0 ?
        <CytoscapeComponent elements={this.state.data}
          stylesheet={stylesheet}
          layout={layout}
          style={style}
          cy={(cy) => { this.cy = cy }}
          boxSelectionEnabled={false}
        />
        :
        <></>
      }

    </>;
  }
}

export default LoadToBCL
