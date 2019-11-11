import React, { Component } from 'react';
import { Table, Rating, Button } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';


const headerText = {
    color: 'black',
    fontSize: '20px',
    fontWeight: '500',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'    
}

const rowText = {
    color: '#0049db',
    fontSize: '18px',
    fontWeight: '500',
    borderRight: '5px',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'    
}

const cellText = {
    color: 'black',
    fontSize: '18px',
    fontWeight: '500',
    borderRight: '5px',
    textAlign: 'center',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'    
}

const buttonText = {
    color: 'white',
    backgroundColor: '#026119',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'
  }



class PriceList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tcCode: '',
            tcName: '',
            daySupply: '',
            dsValue: 0,
            formulaCode: 0,
            ds:[],
            formula: '',
            form: '',
            openPriceListModal: false
        };
    };

 
    renderRows() {
        var priceRows = Array(2);
        // connect to datasouce and store data in each buttons NavLink state
        const { tcName, daySupply, form, formula, price} = this.props;
        console.log("PriceList now has the following ", tcName, daySupply, formula, form)
        
        for(let index = 0; index < 2; index++) {
            priceRows[index] = <Table.Row style={rowText} key={index}>
                <Table.Cell>$34.12</Table.Cell>
                <Table.Cell>MyPharmacy RX</Table.Cell>
                <Table.Cell style={{textAlign: 'center'}}><Rating icon='star' defaultRating={3} maxRating={4} />100</Table.Cell>
                <Table.Cell>
                    <NavLink to={{
                        pathname:'/myhealthrecord',
                        state: {
                            isPrescription: true,
                            therapyClass: tcName,
                            isCompound: true,
                            form: form,
                            formula: formula,
                            quantity: daySupply,
                            estPrice: '$ 32.12'
                        }
                        }}>
                        <Button style={buttonText}>Select Price</Button>
                    </NavLink>
                </Table.Cell>
                    
            </Table.Row>
        }
        return priceRows;
    }  
    render() { 

        return (
            <Table>
                <Table.Header>
                    <Table.Row style={headerText}>
                        <Table.HeaderCell width={3} style={headerText}>Price</Table.HeaderCell>
                        <Table.HeaderCell width={4} style={headerText}>Pharmacy</Table.HeaderCell>
                        <Table.HeaderCell width={6} style={cellText}>Pharmacy Rating<br />Fill Rate</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                {this.renderRows()}
                </Table.Body>
            </Table>
        )
    };
}

export default PriceList; 