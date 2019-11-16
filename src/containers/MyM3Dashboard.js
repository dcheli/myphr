import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Table, Button, Label, Loader, 
    Segment, Dimmer, Confirm, Icon,
    Message, Modal } from 'semantic-ui-react';
import _ from 'lodash';
import * as actions  from '../actions';
import hex2ascii from 'hex2ascii';
import axios from 'axios';
import Constants from '../constants';
import CounterList from '../components/CounterList';


const ScriptStatus = [ "Authorized", "Cancelled", "Received By Pharmacy", "Countered", "Released", "Mailed"];

const buttonText = {
    color: 'white',
    backgroundColor: '#026119',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'
  }

class MyM3DashBoard extends Component {
    
    constructor(props){
        console.log("MyM3DashBoard constuctor()")
        super(props);
        this.state = { 
            openAuthorizeModal: false,
            openCancelConfirm: false,
            selectedScriptId: '', 
            counterOffers: '',
            popup: false,
            counterPrice: '',
            pharmacy: '',
            selectedScriptId:'',
            column: null,
            data: this.props.mym3prescriptions,
            direction: null
        };
    }

    componentDidMount() {
        console.log("Calling componentDidMount()")
        this.props.fetchM3Prescriptions(Constants.MY_ETH_ADDR);
     }

    static getDerivedStateFromProps(props, state) {
        console.log("Calling getDerivedStateFromProps()")
        if(state.data && state.data.length == 0) {
            return {data: props.data };
        }
        return null;
    }
 
    handleCancelButton = (event) => {
        this.setState({openCancelConfirm: true, selectedScriptId: event.target.value});
    }

    handleConfirmConfirm = () => {
        this.setState({openCancelConfirm: false});
        
        axios.put(Constants.ROOT_URL + '/api/m3/' + Constants.MY_ETH_ADDR +'/cancelscript',{
            scriptId: this.state.selectedScriptId
        })
        .then((response) => {
            this.setState({popup: true});
        })
            .catch(function (error) {
            console.log(error);
        });
    }
    
    handleConfirmCancel = () => {
        this.setState({openCancelConfirm: false});
    }
    handlePopupDismiss = () => {
        this.setState({ popup: false })  
    }

    handleCounterButton = (event) => {
        console.log("Counter button hit with size  for ", event.target.value);
        
        axios.get(Constants.ROOT_URL + '/api/m3/' + event.target.value +'/counteroffers')
        .then((response) => {
            this.setState({ counterOffers: response.data});
        })
            .catch(function (error) {
            console.log(error);
        });
        this.setState({  openAuthorizeModal: true });
    }

    closeAuthorizeModal = () => {
          this.setState({ openAuthorizeModal: false })};
    
    cancelConfirm = () => {
        this.setState({openAuthorizeModal: false});
    }

    handleSort = (clickedColumn) => () => {

        const {column, data, direction } = this.state; 

        if (column !== clickedColumn) {
            this.setState({
              column: clickedColumn,
              data: _.orderBy(data, [clickedColumn], ['asc']),
              direction: 'ascending',
            })
            return
        }        
        this.setState({
            column: null,
            data: _.orderBy(data, [clickedColumn], ['desc']),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }

    getWinningCounter = (counterPrice, pharmacy, scriptId) => {
        console.log ("the winning price is ", counterPrice)
        this.setState({ counterPrice: counterPrice,
                        pharmacy: pharmacy,
                        selectedScriptId: scriptId});                                
    }
    authorizeScript = () => {
        // check that a price is selected
        console.log ("Calling authorizeScript with scriptId ", 
            this.state.selectedScriptId, " for pharmacy ",
            this.state.pharmacy, " for this price ",
            this.state.counterPrice);
            
        axios.put(Constants.ROOT_URL + '/api/m3/approvecounter', {
            scriptId: this.state.selectedScriptId,
            pharmacy: this.state.pharmacy
        })
        .then((response) => {
            this.setState({ counterOffers: response.data});
        })
        .catch(function (error) {
            console.log(error);
        });
        this.setState({openAuthorizeModal: false});
    }

    renderRows() {
        var index=0;
       // const { mym3prescriptions } = this.props.mym3prescriptions;
        const {data } = this.state;
        console.log("Data is ", data)
        const { Row, Cell } = Table;
        return _.map(data, prescription => {
            return (
                <Row key={index++} >
                    <Cell>{prescription.formula}</Cell>
                    <Cell>{prescription.form}<Icon name='caret right' />{prescription.daySupply}</Cell>
                    <Cell>{prescription.dateAdded.toLocaleDateString()} {prescription.dateAdded.toLocaleTimeString()}</Cell>
                    <Cell>$ {prescription.price}</Cell>
                    <Cell style={{textAlign: 'center'}}>{ScriptStatus[prescription.status]}</Cell>
                    <Cell style={{textAlign: 'center'}}>                  
                        {(ScriptStatus[prescription.status] === 'Cancelled' ||
                            //ScriptStatus[prescription.status] === 'Claimed' ||
                            ScriptStatus[prescription.status] === 'Completed')?
                            <Icon color='green' name='checkmark' size='big'/> :
                            <Button
                                style={buttonText}
                                onClick={this.handleCancelButton}
                                value={prescription.scriptId}>Cancel
                            </Button>}
                        {ScriptStatus[prescription.status] === 'Countered' ?     
                            <Button as='div' labelPosition='right'>
                                <Button primary
                                    onClick={this.handleCounterButton} 
                                    value={prescription.scriptId}
                                    >Counter Offers
                                </Button>
                            <Label as='a' basic pointing='left'>
                                    {prescription.priceCounterOffersCount}
                            </Label>
                        </Button>
                        : ""
                    }</Cell>
                </Row>
            );
        });

    }
    render() {
        if(this.props.mym3prescriptions === undefined)
            return(<div><Segment size='large'>
                    <h3>MyMedMarket</h3>
                        <Dimmer active inverted>
                            <Loader>Loading Prescriptions</Loader>
                        </Dimmer>
                        </Segment></div>);

        const { popup, column, direction } = this.state
        return (
            <div>
                {(popup) ?
                <Message 
                    success
                    icon
                    onDismiss={this.handlePopupDismiss}>
                    <Icon name='check' />
                    Your prescription has been removed from MyMedMarket.
                </Message>
                : ""}
                <Segment style={{ backgroundColor : '#cfebfd' }}>
                <h3>MyMedMarket Prescriptions</h3></Segment>
            <Table sortable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell
                            width={5}
                            sorted={column === 'formula' ? direction : null}
                            onClick={this.handleSort('formula')}
                        ><b>Formula</b></Table.HeaderCell>
                        <Table.HeaderCell
                            width={2}
                            sorted={column === 'form/daysupply' ? direction : null}
                            onClick={this.handleSort('form/daysupply')}                    
                        ><b>Form/Day Supply</b></Table.HeaderCell>
                        <Table.HeaderCell
                            width={2}
                            sorted={column === 'dateAdded' ? direction : null}
                            onClick={this.handleSort('dateAdded')}
                        ><b>Date Sent</b></Table.HeaderCell>
                        <Table.HeaderCell
                            width={1}
                            sorted={column === 'price' ? direction : null}
                            onClick={this.handleSort('price')}
                        ><b>Price</b></Table.HeaderCell>
                        <Table.HeaderCell
                            style={{textAlign: 'center'}}
                            width={2}
                            sorted={column === 'status' ? direction : null}
                            onClick={this.handleSort('status')}                        
                        ><b>Status</b></Table.HeaderCell>
                        <Table.HeaderCell style={{textAlign: 'center'}} ><b>Action(s)</b></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                 {this.renderRows()}
                </Table.Body>
            </Table>

            <Confirm 
                open={this.state.openCancelConfirm}                    
                onConfirm={this.handleConfirmConfirm}
                header='Cancelling Header'
                content='Some cancel stuff'
                confirmButton='I Agree'
                onCancel={this.handleConfirmCancel}
            />


        <Modal size='large' open={this.state.openAuthorizeModal} onClose={this.closeAuthorizeModal}>
            <Modal.Header> Authorize Prescription Request </Modal.Header>
            <Modal.Content>
                <CounterList 
                counterOffers={this.state.counterOffers}
                callback={this.getWinningCounter}
                />
            </Modal.Content>

            <Modal.Actions>
                <Button negative
                    onClick={this.cancelConfirm}>
                    Cancel
                </Button>
            <Button positive 
                onClick={this.authorizeScript}
                loading={this.state.loading}
                icon='checkmark' labelPosition='right' content='Authorize Prescription' />
          </Modal.Actions>
          </Modal>
            </div>
        );
    }
};

// the first argument, mym3prescriptions,  is the redux store state
function mapStateToProps({mym3prescriptions={}}) {
    var displayData = [];
   
    if(mym3prescriptions) {
        _.forEach(mym3prescriptions.mym3prescriptions, function(record) 
        {   let r = {};
            r.formula = record.formula;
            r.form = hex2ascii(record.form);
            r.quantity = hex2ascii(record.quantity);
            r.daySupply = hex2ascii(record.daySupply);
            let dateInMs = parseInt(record.dateAdded._hex, 16) * 1000;
            r.dateAdded= new Date(dateInMs);
            r.status = record.status;
            let price = parseInt(record.price._hex, 16) / 100;
            r.price = price.toFixed(2);
            r.priceCounterOffersCount = record.priceCounterOffersCount;
            r.scriptId = record.scriptId;
            displayData.push(r);
        });
    }
    console.log("calling mapStateToProps()")
    
    return{
        mym3prescriptions: displayData,
        data: displayData
    }
}

export default connect(mapStateToProps, actions)(MyM3DashBoard);
