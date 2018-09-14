import React, { Component } from 'react';
import { Table, Radio } from 'semantic-ui-react'

class ProviderList extends Component {
    
    constructor(props) {
        super(props);        
        this.state = {ethereumAddress: ''};
    }

    handleClick = (event, {value}) => {
        console.log("providerId with address  ", value)
        this.setState({ethereumAddress: value });

        this.props.callback(value);
      }

    renderRows () {
        const { providerList } = this.props;
        var providerRows = Array(providerList.length);
        
        for(var index = 0; index < providerList.length; index++) {
            const { organizationName, _id, type, contacts } = providerList[index];
            var contact = _.find(contacts, {type:'ethereum'});
            
            providerRows[index] = 
                <Table.Row id='row' key={index} >
                    <Table.Cell id={_id} value={_id} >
                        <Radio
                            onClick={this.handleClick.bind(this)} 
                            value={contact.ethereumAddress}
                            checked={this.state.ethereumAddress === contact.ethereumAddress}
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