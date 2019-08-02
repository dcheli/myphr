import React, { Component } from 'react';
import { Table, Checkbox } from 'semantic-ui-react'
import _ from 'lodash';

//var selectedShares = [];
class ProviderList extends Component {
    
    constructor(props) {
        super(props);        
        this.state = {
            ethereumAddress: '',
            shares: JSON.parse(this.props.shares)
        };
   
    }
    
    handleClick = (event,  {checked, value}) => {
        event.preventDefault();
        this.setState({ethereumAddress: value });
        this.props.callback(value, checked);
      }

    renderRows () {
        const { providerList } = this.props;
        var providerRows = Array(providerList.length);
        
        for(var index = 0; index < providerList.length; index++) {
            const { organizationName, _id, type, contacts } = providerList[index];
            var contact = _.find(contacts, {type:'ethereum'});

            let i  = _.findIndex(this.state.shares, {"ethereumAddress": contact.ethereumAddress})
            
            providerRows[index] = 
                <Table.Row id='row' key={index} >
                    <Table.Cell id={_id} value={_id} >
                        <Checkbox
                            onClick={this.handleClick.bind(this)} 
                            value={contact.ethereumAddress}
                            defaultChecked={( _.findIndex(this.state.shares, {"ethereumAddress": contact.ethereumAddress})> -1) ? true : false}
                        /></Table.Cell>
                    <Table.Cell value={_id} >{organizationName}</Table.Cell>
                    <Table.Cell value={_id} >{type}</Table.Cell>
                    <Table.Cell value={_id} >{contact.ethereumAddress}</Table.Cell>
                    
                </Table.Row>
            }
        return providerRows;
      }


    render() {
        const { Header, Row, HeaderCell, Body } = Table;    
        return (
            <Table striped color={'orange'} selectable id='providerTable'>
                <Header>
                    <Row>
                        <HeaderCell>
                            Select
                        </HeaderCell>
                        <HeaderCell>
                            Provider
                        </HeaderCell>
                        <HeaderCell>
                            Type
                        </HeaderCell>
                        <HeaderCell>
                            Ethereum Address
                        </HeaderCell>
                    </Row>
                </Header>
                <Body>{this.renderRows()}</Body>
            </Table>
        )
    }
}

export default ProviderList; 