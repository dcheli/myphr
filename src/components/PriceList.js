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

const priceList = [
    {pharmacy: 'Billingsley Rx', pharmacyEthAddress: '0x1daa654cfbc28f375e0f08f329de219fff50c765', price: '42.14', fillRate: '42', defaultRating: '4' },
    {pharmacy: 'AAA Pharmacy',  pharmacyEthAddress: '0x00D1AE0A6fC13B9ecdefA118B94cF95ac16D4ab0', price: '39.10', fillRate: '3', defaultRating: '2' },
    {pharmacy: 'The BEST Pharmacy',  pharmacyEthAddress: '0x895aE68111DA9323632e783671b451C867378155' ,price: '45.00', fillRate: '10', defaultRating: '3' }
]

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
        
        for(let index = 0; index < priceList.length; index++) {
            priceRows[index] = <Table.Row style={rowText} key={index}>
                <Table.Cell>You Pay Only</Table.Cell>
                <Table.Cell>$ {priceList[index].price}</Table.Cell>
                <Table.Cell style={{textAlign: 'center'}}>
                    <Rating icon='star' defaultRating={priceList[index].defaultRating} maxRating={4} />100</Table.Cell>
                <Table.Cell>
                    <NavLink to={{
                        pathname:'/myhealthrecord',
                        state: {
                            isPrescription: true,
                            therapyClass: tcName,
                            isCompound: true,
                            form: form,
                            formula: formula,
                            daySupply: daySupply,
                            pharmacyEthAddress: priceList[index].pharmacyEthAddress,
                            estPrice: priceList[index].price
                        }
                        }}>
                        <Button style={buttonText}
                        onClick={this.handleClick}>Select Price</Button>
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
                        <Table.HeaderCell width={3} style={headerText}></Table.HeaderCell>
                        <Table.HeaderCell width={3} style={headerText}>Price</Table.HeaderCell>
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