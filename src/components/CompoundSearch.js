import React, { Component } from 'react';
import { Label, Dropdown, Segment, Button, Table, Modal } from 'semantic-ui-react';
import PriceList from './PriceList';


const tClasses = [
    { key: '0', text: 'Anti-Fungal', value: 'af' },
    { key: '1', text: 'Colorectal', value: 'co' },
    { key: '2', text: 'Foot Care', value: 'fc' },
    { key: '3', text: 'Hormone Replacement', value: 'hr' },
    { key: '4', text: 'Low Dose Naltrexone (LDN)', value: 'ldn' },
    { key: '5', text: 'Topical Pain', value: 'tp' },
    { key: '6', text: 'Wound & Circulation', value: 'wc' },
];

const formulas = {
     'fc':[
        {key: 0, text: 'Anti-Fungal Medication', value:0},
        {key: 1, text: 'Keratolytic agents', value:1},
        {key: 2, text: 'Nail Fungus', value:2},
        {key: 3, text: 'Plantar Fasciitis', value:3},
       ],
    'hrt':[
        {key: 0, text: 'Estradiol', value:0},
        {key: 1, text: 'Estriol', value:1},
        {key: 2, text: 'Estradiol / Estriol', value:2},
       ],

    'tp':[
        {key: 0, text: 'Muscle Relaxant', value:1},
        {key: 1, text: 'Nerve Agent', value:2},
       ],
    'sc':[
            {key: 0, text: 'Acne', value:0},
          ],
};
const forms = {
     'fc':[
        {key: 0, text: 'Cream', value:'0'},
       ],
    'hrt':[
        {key: 0, text: 'Cream', value:'0'},
       ],
     'tp':[
        {key: 0, text: 'Cream', value:'0'},
       ],
    'sc':[
        {key: 0, text: 'Cream', value:'0'},
        ],    
}

const daySupply = {
    'fc':{
            '0':  [
                    {key: 0, text: '30 Days', value: 0, price: '24.13'},
                    {key: 1, text: '60 Days', value: 1, price: '37.00'},
                    {key: 2, text: '90 Days', value: 2, price: '43.10'},
                ],
            '1':[
                    {key: 0, text: '30 Days', value: 0, price: '27.33'},
                    {key: 1, text: '60 Days', value: 1, price: '41.35'},
                    {key: 2, text: '90 Days', value: 2, price: '52.00'},
                ],
            '2':[
                    {key: 0, text: '30 Days', value: 0, price: '32.10'},
                    {key: 1, text: '60 Days', value: 1, price: '44.50'},
                    {key: 2, text: '90 Days', value: 2, price: '58.00'},
            ],
            '3':[
                    {key: 0, text: '30 Days', value: 0, price: '44.60'},
                    {key: 1, text: '60 Days', value: 1, price: '53.21'},
                    {key: 2, text: '90 Days', value: 2, price: '64.00'},
            ],                                
            },
    'hrt':{
          '0':  [
                    {key: 0, text: '30 Days', value: 0, price: '50.00'},
                    {key: 1, text: '60 Days', value: 1, price: '65.00'},
                    {key: 2, text: '90 Days', value: 2, price: '70.00'},
                ],
            '1':[
                    {key: 0, text: '30 Days', value: 0, price: '47.35'},
                    {key: 1, text: '60 Days', value: 1, price: '51.30'},
                    {key: 2, text: '90 Days', value: 2, price: '62.12'},
                ],
           '2': [
                    {key: 0, text: '30 Days', value: 0, price: '32.10'},
                    {key: 1, text: '60 Days', value: 1, price: '44.50'},
                    {key: 2, text: '90 Days', value: 2, price: '50.65'},
                ],
        },
    'sc':{
        '0':  [
                {key: 0, text: '30 Days', value: 0, price: '50.00'},
                {key: 1, text: '60 Days', value: 1, price: '65.00'},
                {key: 2, text: '90 Days', value: 2, price: '70.00'},
            ],
 
         },
    'tp':{
        '0':  [
                {key: 0, text: '30 Days', value: 0, price: '50.00'},
                {key: 1, text: '60 Days', value: 1, price: '65.00'},
                {key: 2, text: '90 Days', value: 2, price: '70.00'},
            ],
        '1':[
                {key: 0, text: '30 Days', value: 0, price: '47.35'},
                {key: 1, text: '60 Days', value: 1, price: '51.30'},
                {key: 2, text: '90 Days', value: 2, price: '62.12'},
            ],
         },
}

const dropDownText = {
    backgroundColor: 'white',
    color: '#0049db',
    fontSize: '16px',
    fontWeight: '500',
    borderRight: '5px',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'    
}

const dsLabel = {
    border: '1px solid  grey',
    margin: '0',
    borderRadius: '0px',
    backgroundColor: 'white',
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '20px',
    paddingRight: '20px',
}
  

const displayText = {
    backgroundColor: 'white',
    color: '#0049db',
    fontSize: '24px',
    fontWeight: '500',
    borderRight: '5px',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'    
}

const smallText = {
    backgroundColor: 'white',
    color: 'black',
    fontSize: '14px',
    fontWeight: '500',
    borderRight: '5px',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'    
}

const priceText = {
    backgroundColor: 'white',
    color: 'black',
    fontSize: '24px',
    fontWeight: '500',
    borderRight: '5px',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'    
}

const tcText = {
    backgroundColor: 'white',
    color: 'black',
    fontSize: '24px',
    fontWeight: '500',
    borderRight: '5px',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'    
}

const settingsText = {
    color: 'white',
    margin: '0',
    borderRadius: '0px',
    backgroundColor: '#0049db',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontSize: '16px',
    fontWeight: '500',
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
  const modalNButton = {
      backgroundColor:'transparent',
      float: 'left',
      border: '0',
      color: '#0049db',
      fontSize: '14px',
      fontWeight: '500',
      borderRight: '5px',
      fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'    
  }

  const actionStyle = {
      backgroundColor: '#f0f3f5'
  }

class CompoundSearch extends Component {

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

    componentDidMount(){
        if(this.props.location.state !== undefined) {
            const { tcCode, tcName } = this.props.location.state;
            this.setState({ 
                tcCode: tcCode,
                tcName: tcName,
                ds: daySupply[tcCode],
                dsValue:   daySupply[tcCode][0][0].value,
                daySupply: daySupply[tcCode][0][0].text
            });
            console.log("ds is ", daySupply[tcCode])
        };
    };

    handleChange = (e, { value }) => { 
        const { ds } = this.state;
        this.setState({ dsValue: value,
                daySupply:  ds[0][value].text
            });
    }

    handleOrderNow = (e, {formula, form, daysupply, tcname}) => {
        console.log("Price List Select ",  formula, form, daysupply, tcname)
        this.setState({
            openPriceListModal: true,
            formula, form, daySupply: daysupply, tcName: tcname})
    }

    closePriceListSelect = () => {
        this.setState({openPriceListModal: false});
    }

    cancelPriceListConfirm = () => {
        this.setState({openPriceListModal: false});
    }

    renderRows() {
        if(this.state.tcCode != '') {
            const { dsValue, tcCode } = this.state;
            var formulaRows = Array(formulas[tcCode].length);
            for(let index = 0; index < formulas[tcCode].length; index++){
                formulaRows[index] = <Table.Row key={index} style={displayText}>
                        <Table.Cell width={5}>{formulas[tcCode][index].text}</Table.Cell>
                        <Table.Cell width={3}>{forms[tcCode][0].text}</Table.Cell>        
                        <Table.Cell width={2}>{daySupply[tcCode][index][dsValue].text}</Table.Cell>
                        <Table.Cell width={3} style={priceText}>
                            $ {daySupply[tcCode][index][dsValue].price}
                            <br />
                            <font style={smallText}>Most popular price</font>
                        </Table.Cell>
                        <Table.Cell>
                            <Button style={buttonText}
                                tcname={this.state.tcName}
                                price={daySupply[tcCode][index][dsValue].price}
                                daysupply={this.state.daySupply}
                                formula={formulas[tcCode][index].text}
                                form={forms[tcCode][0].text}
                                onClick={this.handleOrderNow}
                            >Order Now</Button>
                        </Table.Cell>
                    </Table.Row>        
            }
            return formulaRows;
        }
    }

    render() {
 
        if((this.state.tcCode === undefined ||
            this.state.tcCode === '' ) ||
            this.state.dsValue === undefined) {
            return(<div>Still loading</div>);
        }
        console.log("tcName ", this.state.tcName, " daySupply ", this.state.daySupply)
        return(
            <div>
            <Segment.Group>
                <Segment>
                    <Label style={settingsText}>Prescription Settings</Label>
                    <Label style={dsLabel}>
                    <Dropdown
                        placeholder='Day Supply'
                        style={dropDownText}                   
                        options={daySupply[this.state.tcCode][0]}
                        onChange={this.handleChange}
                    />
                    </Label>
                </Segment>
                <Segment style={tcText}>{this.state.tcName}</Segment>
                <Segment>
                    <Table >
                        <Table.Body>
                        {this.renderRows()}
                        </Table.Body> 
                    </Table>
                </Segment>
            </Segment.Group>
                     
            <Modal size='large' 
                style={{padding: '10px', backgroundColor: '#f0f3f5'}}
                open={this.state.openPriceListModal} onClose={this.closePriceListModal}>                  
                <Modal.Header  style={{backgroundColor: '#ffee66'}}> Select Pharmacy to Order From</Modal.Header>
                <Modal.Content style={{backgroundColor: '#fff9c3'}}>
                    <PriceList 
                        tcName={this.state.tcName}
                        daySupply={this.state.daySupply}
                        formula={this.state.formula}
                        form={this.state.form}
                    />
                </Modal.Content>
        
                <Modal.Actions style={actionStyle}>
                    <Button 
                        style={modalNButton}
                        onClick={this.cancelPriceListConfirm}>
                        Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
                     
            </div>
        );
    }
}

export default CompoundSearch;
