import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Table, Button, Loader, Segment, Dimmer } from 'semantic-ui-react';
import _ from 'lodash';
import * as actions  from '../actions';
// this should come from Metamask I think
const ethAddr = '0x895aE68111DA9323632e783671b451C867378155'
const ScriptStatus = [ "Authorized", "Cancelled", "Claimed", "Countered", "Released", "Completed"];

class MyM3DashBoard extends Component {

    componentDidMount() {
        this.props.fetchM3Prescriptions(ethAddr);
    }
 

    renderRows() {
        var index=0;
        const { mym3prescriptions } = this.props.mym3prescriptions;
        const { Row, Cell } = Table;
        
        return _.map(mym3prescriptions, prescription => {
            var priceInDollars = parseInt(prescription.price) /100
            return (
                <Row key={index++} >
                    <Cell>{prescription.drugName}</Cell>
                    <Cell>Date Goes Here</Cell>
                    <Cell>$ {priceInDollars}</Cell>
                    <Cell>{ScriptStatus[prescription.status]}</Cell>
                    <Cell><Button primary>Cancel Prescription</Button></Cell>
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

        return (
            <Table>
            <Table.Header>
                 <Table.Row>
                     <Table.HeaderCell colSpan='5'>MyMedMarket Prescriptions</Table.HeaderCell>
                 </Table.Row>
             </Table.Header>
             <Table.Body>
                 <Table.Row>
                     <Table.Cell><b>Drug Name</b></Table.Cell>
                     <Table.Cell><b>Date Added</b></Table.Cell>
                     <Table.Cell><b>Price</b></Table.Cell>
                     <Table.Cell><b>Status</b></Table.Cell>
                     <Table.Cell ><b>Action</b></Table.Cell>

               </Table.Row>
                 {this.renderRows()}
             </Table.Body>
 
             </Table>
        );
    }
};

function mapStateToProps({mym3prescriptions={}, isLoading=false}) {
    return{
        mym3prescriptions: mym3prescriptions
    }
}

export default connect(mapStateToProps, actions)(MyM3DashBoard);
