import React, { Component } from 'react';
import { Form, Select, Input, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

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
    'af':[
         {key: 0, text: 'Miconazole 10% / Recura™', value: 0},
         {key: 1, text: 'Fluconazole 10% / Recura™', value: 1},
         {key: 2, text: 'Miconazole 5% / Fluconazole 5% / Recura™', value: 2},
        ],
    'co':[
        {key: 0, text: 'Diltiazem 2%', value:0},
        {key: 1, text: 'Diltiazem 2% / Lidocaine 1.5%', value:1},
        {key: 2, text: 'Nifedipine 0.3%', value:2},
        {key: 3, text: 'Nifedipine 0.3% / Lidocaine 1.5%', value:3},
        ],
    'fc':[
        {key: 0, text: 'Lactic Acid 10% / Urea 40%', value:0},
        {key: 1, text: 'Lactic Acid 8% / Urea 40% / Salicylic Acid 1%', value:1}
       ],
    'hr':[
        {key: 0, text: 'Estradiol', value:0},
        {key: 1, text: 'Estriol', value:1},
        {key: 2, text: 'Estradiol / Estriol', value:2},
       ],
    'ldn':[
        {key: 0, text: 'Naltrexone 1.5 mg', value:0},
        {key: 1, text: 'Naltrexone 3 mg', value:1},
        {key: 2, text: 'Naltrexone 4.5 mg', value:2},
       ],
    'tp':[
        {key: 0, text: 'Gabapentin 5% / Amitriptyline 2% / Lidocaine 5% / Clonidine 0.2% / Ketamine 10%', value:0},
        {key: 1, text: 'Diclofenac Sodium 3% / Gabapentin 5% / Amitriptyline 2% / Lidocaine 2% / Clonidine 0.2% / Amantadine 8%', value:1},
        {key: 2, text: 'Diclofenac Sodium 3% / Baclofen 2% / Lidocaine 5%', value:2},
       ],
    'wc':[
        {key: 0, text: 'Nifedipine 6% / Pentoxifylline 6%', value:0},
        {key: 1, text: 'Misoprostol 0.0024% / Phenytoin 5% / Gentamicin 0.2%', value:1},
        {key: 2, text: 'Misoprostol 0.0024% / Phenytoin 5% / Gentamicin 0.2% / Metronidazole 2%', value:2},
        {key: 3, text: 'Misoprostol 0.0024% / Phenytoin 5% / Gentamicin 0.2% / Metronidazole 2% / Vancomycin 0.5%', value:3},
        ],
};
const forms = {
    'af': [
        {key: 0, text: 'Cream', value:'0', price: 'Cream'},
    ],
    'co':[
        {key: 0, text: 'Ointment', value:'0', price: 'Ointment'},
        ],
    'fc':[
        {key: 0, text: 'Cream', value:'0', price: 'Cream'},

       ],
    'hr':[
        {key: 0, text: 'Cream', value:'0', price: 'Cream'},
       ],
    'ldn':[
        {key: 0, text: 'Capsule', value:'0', price: 'Capsule'},
       ],
    'tp':[
        {key: 0, text: 'Cream', value:'0', price: 'Cream'},
       ],
    'wc':[
        {key: 0, text: 'Gel', value:'0', price: 'Gel'},
        ],    
}

const quantities = {
    'af': [
        {key: 0, text: '15 gm', value:'0', price: '65.00'},
        {key: 1, text: '30 gm', value:'1', price: '80.00'},
    ],
    'co':[
        {key: 0, text: '30 gm', value:'0', price: '40.00'},
        {key: 1, text: '60 gm', value:'1', price: '60.00'},
        ],
    'fc':[
        {key: 0, text: '30 gm', value:'0', price: '40.00'},
        {key: 1, text: '60 gm', value:'1', price: '50.00'},
       ],
    'hr':[
        {key: 0, text: '30 Days', value:'0', price: '60.00'},
        {key: 1, text: '60 Days', value:'1', price: '75.00'},
       ],
    'ldn':[ // this is a prob because of strenths
        {key: 0, text: '30 Capsules', value:'0', price: '45.00'},
        {key: 1, text: '60 Capsules', value:'1', price: '60.00'},
       ],
    'tp':[
        {key: 0, text: '30 gm', value:'0', price: '75.00'},
        {key: 1, text: '60 gm', value:'1', price: '90.00'},
       ],
    'wc':[
        {key: 0, text: '30 gm', value:'0', price: '60.00'},
        {key: 1, text: '60 gm', value:'1', price: '70.00'},
        ],
}



class CompoundSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            therapyClass: '',
            tClasses: tClasses,
            formula: '',
            formulas: [],
            formulaDisabled: true,
            formulaKey: '',
            form: '',
            forms:[],
            formsDisabled: true,
            quantity: '',
            quantities: [],
            quantitiesDisabled: true,
            estPriceDisabled: true,
            estPrice: '',
        };
    }

    handleTClass = (e, {value}) => {
        this.setState({
            therapyClass: value, 
            tClassName: tClasses[value],
            formulas: formulas[value], 
            formulaDisabled: false,
            estPriceDisabled: true,
            quantitiesDisabled: true});
    };

    handleFormula = (e, {value}) => {
        this.setState({
            formula: this.state.formulas[value].text,
            formsDisabled: false,
            forms: forms[this.state.therapyClass],
      //      quantitiesDisabled: false,
      //      quantities:  quantities[this.state.therapyClass],
            formulaKey: value
        });
    };
    handleForm = (e, {value}) => {
        this.setState({
            form: this.state.forms[value].text,
            quantitiesDisabled: false,
            quantities:  quantities[this.state.therapyClass]
        })
    };

    handleQuantity = (e, {value}) => {        
        this.setState({
            estPriceDisabled: false,
            quantity: this.state.quantities[value].text,
            estPrice: '$ ' + this.state.quantities[value].price
        });
    }

    render() {
        return(
            <Form>
                <Form.Field label='Select Therapuetic Class:'  
                    control={Select}
                    options={tClasses} 
                    onChange={this.handleTClass} />
                <Form.Field label='Select Best Matched Formula:' 
                    control={Select}
                    options={this.state.formulas}
                    onChange={this.handleFormula}
                    disabled={this.state.formulaDisabled}  />
                <Form.Field label='Select Form:' 
                    control={Select} 
                    options={this.state.forms} 
                    onChange={this.handleForm}
                    disabled={this.state.formsDisabled} />
                <Form.Field label='Select Quantity:' 
                    control={Select} 
                    options={this.state.quantities} 
                    onChange={this.handleQuantity}
                    disabled={this.state.quantitiesDisabled} />
                <Form.Field label='Estimated Price on MyMedMarket' 
                    control={Input} 
                    readOnly
                    value={this.state.estPrice}
                    disabled = {this.state.estPriceDisabled}                    
                    />
                <NavLink to={
                            {
                                pathname: '/myhealthrecord',
                                state: { 
                                    isPrescription: true,
                                    therapyClass: this.state.therapyClass,
                                    isCompound: true,
                                    form: this.state.form,
                                    formula: this.state.formula,
                                    quantity: this.state.quantity,
                                    estPrice: this.state.estPrice
                                }
                            }
                        } activeClassName="active">
                
                    <Form.Button  floated='right' primary icon labelPosition='right'>
                    Continue to MyMedMarket
                        <Icon name='right arrow' />
                    </Form.Button>
                </NavLink>


            </Form>
        );
    }
}

export default CompoundSearch;
