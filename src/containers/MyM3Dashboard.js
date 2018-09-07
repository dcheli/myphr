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


// this should come from Metamask I think
const ethAddr = '0x895aE68111DA9323632e783671b451C867378155'
const ScriptStatus = [ "Authorized", "Cancelled", "Claimed", "Countered", "Released", "Completed"];

class MyM3DashBoard extends Component {
    
    constructor(props){
        super(props);
        this.state = { 
            openCounterModal: false,
            openCancelConfirm: false,
            selectedScriptId: '', 
            counterOffers: '',
            popup: false,
            counterPrice: '',
            pharmacy: '',
            selectedScriptId:''
        };
    }

    componentDidMount() {
        this.props.fetchM3Prescriptions(ethAddr);
    }
 
    handleCancelButton = (event) => {
        this.setState({openCancelConfirm: true, selectedScriptId: event.target.value});
    }



    handleConfirmConfirm = () => {
        this.setState({openCancelConfirm: false});
        
        axios.put(Constants.ROOT_URL + '/api/m3/' + ethAddr +'/cancelscript',{
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
        this.setState({  openCounterModal: true });
    }

    handleCounterClose = () => {
          this.setState({ openCounterModal: false })};
    
    cancelConfirm = () => {
        this.setState({openCounterModal: false});
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
    }

    renderRows() {
        var index=0;
        const { mym3prescriptions } = this.props.mym3prescriptions;
        const { Row, Cell } = Table;

        return _.map(mym3prescriptions, prescription => {
            var priceInDollars = parseInt(prescription.price) /100
            var dateInMs = parseInt(prescription.dateAdded) * 1000;
            var d = new Date(dateInMs);
            var drugStrength = hex2ascii(prescription.drugStrength);
            var drugForm = hex2ascii(prescription.drugForm);
            var drugQuantity = hex2ascii(prescription.drugQuantity);
            return (
                <Row key={index++} >
                    <Cell>{prescription.drugName}</Cell>
                    <Cell>{drugForm}<Icon name='caret right' />{drugStrength}<Icon name='caret right' />{drugQuantity}</Cell>
                    <Cell>{d.toLocaleDateString()} {d.toLocaleTimeString()}</Cell>
                    <Cell>$ {priceInDollars.toFixed(2)}</Cell>
                    <Cell>{ScriptStatus[prescription.status]}</Cell>
                    <Cell>                  
                        {ScriptStatus[prescription.status] === 'Cancelled' ?
                            <Icon color='green' name='checkmark' size='big'/> :
                            <Button primary 
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
        if(this.props.mym3prescriptions === undefined ||
            _.isEmpty(this.props.mym3prescriptions))
            return(<div><Segment size='large'>
                    <h3>MyMedMarket</h3>
                        <Dimmer active inverted>
                            <Loader>Loading Prescriptions</Loader>
                        </Dimmer>
                        </Segment></div>);
        
        const { popup } = this.state
        return (
            <div>
                {(popup) ?
                <Message 
                    success
                    icon
                    onDismiss={this.handlePopupDismiss}>
                    <Icon name='check' />
                    Your prescription has been removed to MyMedMarket.
                </Message>
                : ""}
            <Table>
            <Table.Header>
                 <Table.Row>
                     <Table.HeaderCell colSpan='6'>MyMedMarket Prescriptions</Table.HeaderCell>
                 </Table.Row>
             </Table.Header>
             <Table.Body>
                 <Table.Row>
                     <Table.Cell><b>Drug Name</b></Table.Cell>
                     <Table.Cell><b>Form/Strength/Qty</b></Table.Cell>
                     <Table.Cell><b>Date Added</b></Table.Cell>
                     <Table.Cell><b>Price</b></Table.Cell>
                     <Table.Cell><b>Status</b></Table.Cell>
                     <Table.Cell ><b>Action(s)</b></Table.Cell>

               </Table.Row>
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



        <Modal size='large' open={this.state.openCounterModal} onClose={this.closeCounterModal}>
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

function mapStateToProps({mym3prescriptions={}, isLoading=false}) {
    return{
        mym3prescriptions: mym3prescriptions
    }
}

export default connect(mapStateToProps, actions)(MyM3DashBoard);
