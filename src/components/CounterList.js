import React, { Component } from 'react';
import { Table, Radio } from 'semantic-ui-react'

class CounterList extends Component {
    
    constructor(props) {
        super(props);        
        this.state = {counterPrice: ''};
    }

    handleClick = (event, {value, pharmacy, rxid}) => {
        this.setState({counterPrice: value });
                        
        console.log("In CounterList, handleClick with event ", value, 
            " pharmacy ", pharmacy, 
            " rxid ", rxid);
        this.props.callback(value, pharmacy, rxid);

      } 

    renderRows () {
        var counterRows = Array(this.props.counterOffers.length);
        
        for(var index = 0; index < this.props.counterOffers.length; index++) {
            console.log("Counter Offers ", this.props.counterOffers[index]);
            console.log ("Counter price is ", parseInt(this.props.counterOffers[index].price._hex, 16));
            console.log ("Counter date is ",  parseInt(this.props.counterOffers[index].expireTime._hex, 16));
            const pharmacy = this.props.counterOffers[index].pharmacy;
            const rxPrice = 
               parseInt(this.props.counterOffers[index].price._hex, 16) /100; // convert to pennies
            const estimatedPrice = rxPrice;
            var d = new Date(parseInt(this.props.counterOffers[index].expireTime._hex, 16) * 1000);
            const scriptId = this.props.counterOffers[index].scriptId;

            counterRows[index] = 
                <Table.Row id='row' key={index} >
                    <Table.Cell id='_scriptId' value={scriptId}>
                        <Radio
                            rxid={scriptId}
                            pharmacy={pharmacy}
                            onClick={this.handleClick.bind(this)} 
                            checked={this.state.counterPrice === (estimatedPrice).toFixed(2)}
                            value={(estimatedPrice).toFixed(2)}
                        /></Table.Cell>
                    <Table.Cell id='_price' value={(estimatedPrice).toFixed(2)} >$ {(estimatedPrice).toFixed(2)}</Table.Cell>
                    <Table.Cell >{d.toLocaleDateString()} at {d.toLocaleTimeString()} </Table.Cell>
                </Table.Row>;
        }
        return counterRows;
    }

    render() {
        const { Header, Row, HeaderCell, Body, Cell } = Table;
        const { counterOffers, active, scriptId } = this.props;

        return (
            <Table striped color={'orange'} selectable id='counterTable'>
                <Header>
                    <Row>
                        <HeaderCell>
                            Select
                        </HeaderCell>
                        <HeaderCell>
                            Counter
                        </HeaderCell>
                        <HeaderCell>
                            Expires On
                        </HeaderCell>
                    </Row>
                </Header>
                <Body>{this.renderRows()}</Body>
            </Table>
        )
    }
}

export default CounterList; 