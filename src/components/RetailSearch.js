import React, { Component } from 'react';
import { Form, Select, Input, Search, Icon } from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';
import { NavLink } from 'react-router-dom';

const ROOT_URL = 'http://localhost:5000';

class RetailSearch extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            isLoading: false, 
            results: [], 
            value: '',
            drugForm:'',
            estPrice: '',
            drugFormDisabled: true,
            drugStrengthDisabled: true,
            drugQuantityDisabled: true,
            drugFormOptions:[],
            drugStrengthOptions:[],
            drugQuantityOptions:[],
            drugProfiles:[],
            awpList:[],
            isGeneric: true
        };
    }

    componentWillMount() {
        
        this.resetComponent()
    }

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' });
    
    handleClick = (event) => {
        event.preventDefault();
    }


    handleResultSelect = (e, { result }) => {
        this.setState({ isLoading: true, value: result.title, drugName: result.title });
        const searchUrl = (this.state.isGeneric) ? 
            '/api/retailsearch/generic/' + result.title + '/profile' :
            '/api/retailsearch/brand/' + result.title + '/profile';

        axios.get(ROOT_URL + searchUrl)
            .then((response) => {

                var drugForms = _.map(response.data.profiles,(value, key) =>{
                    return {
                        key:key,
                        text: value.form,
                        value: key
                    }
                })

            // pick the profile based on the first profile
            var profile = response.data.profiles[0];
    
            var strengthsList = _.map(profile.strengths, (value, key) => {
                return{
                    key: key,
                    text: value,
                    value: key
                }
            });
            var quantitiesList = _.map(profile.quantities, (value, key) => {
                return{
                    key: key,
                    text: value,
                    value: key
                }
            });
            
            var awpList  = profile.awps;
            var defaultPrice = _.find(awpList, {strength:strengthsList[0].text});
            var defaultEstPrice = (parseFloat(defaultPrice.awp) * 
                    parseInt(quantitiesList[0].text) *.75).toFixed(2);
                        
            //this.calculateEstPrice(strengthsList[0].text, quantitiesList[0].text);
            
            this.setState({
                isLoading: false,
                drugForm: drugForms[0].text,
                drugStrength: 0,
                drugQuantity : 0,
                drugQuantityLabel:'',
                drugFormDisabled: false,
                drugStrengthDisabled: false,
                drugQuantityDisabled: false,
                drugFormOptions: drugForms,
                drugProfiles: response.data.profiles,
                drugStrengthOptions:strengthsList,
                drugQuantityOptions: quantitiesList,
                awpList: awpList,
                estPrice: '$ ' + defaultEstPrice
            });
        }).catch(function (error) {
            // handle error
            console.log(error);
        });
    };

    handleSearchChange =  (e, { value }) => {
        this.setState({ isLoading: true, value });

        const searchUrl = (this.state.isGeneric) ? 
            '/api/retailsearch/generic/' + value :
            '/api/retailsearch/brand/' + value;

        axios.get(ROOT_URL + searchUrl)
        .then((response) => {
            var newList =  _.map(response.data, (value, key) => {
                return {
                    title: value.name,
                    key: value._id
                  };
                });
            this.setState({
                isLoading: false,
                results: newList
            });
        });
    };

    handleGeneric = () => {this.setState({
            isGeneric : true,
            results: [], 
            value: '',
            drugForm:'',
            estPrice: '',
            drugFormDisabled: true,
            drugStrengthDisabled: true,
            drugQuantityDisabled: true,
            drugFormOptions:[],
            drugStrengthOptions:[],
            drugQuantityOptions:[],
            drugProfiles:[],
            awpList:[],
            estPrice: ''

    })};
    handleBrand   = () => {
        this.setState({isGeneric : false,
            results: [], 
            value: '',
            drugForm:'',
            estPrice: '',
            drugFormDisabled: true,
            drugStrengthDisabled: true,
            drugQuantityDisabled: true,
            drugFormOptions:[],
            drugStrengthOptions:[],
            drugQuantityOptions:[],
            drugProfiles:[],
            awpList:[],
            estPrice: ''

        })};
    handleStrengthChange = (event, {value, options}) => {
        this.calculateEstPrice(value, this.state.drugQuantity);
        this.setState({drugStrength: value})
       
    };
    handleQuantityChange = (event, {value, options}) => {
        this.calculateEstPrice(this.state.drugStrength, value);
        this.setState({drugQuantity: value })
    };
    
    calculateEstPrice = (strength, quantity) => {
        console.log("awpPrice list is ", this.state.awpList);
        var awpPrice = _.find(this.state.awpList, {strength:  this.state.drugStrengthOptions[strength].text});
        var qty = this.state.drugQuantityOptions[quantity].text;

        var estPrice = 
            (parseFloat(awpPrice.awp) * parseInt(qty) *.75).toFixed(2);
        this.setState({estPrice: '$ ' + estPrice});
    
    }

    handleDrugFormChange = (e, { value, options }) => {

        var profile = _.filter(this.state.drugProfiles, function(profile) { 
            return profile.form === options[value].text; });

        var strengthsList = _.map(profile[0].strengths, (value, key) => {
            return{
                key: key,
                text: value,
                value: key
            }
        });
        var quantitiesList = _.map(profile[0].quantities, (value, key) => {
            return{
                key: key,
                text: value,
                value: key
            }
        });
        var awpList = profile[0].awps;

        var defaultStrength = strengthsList[0].value;      
        var defaultQuantity = quantitiesList[0].value;
        var defaultAwp = awpList[0].awp;

        // TODO: Would be good to refactor this, as well as calculatePrice function
        var estPrice = 
            (parseFloat(defaultAwp) * parseInt(quantitiesList[0].text) *.75).toFixed(2);
                this.setState({estPrice: '$ ' + estPrice});

        this.setState({
            drugStrengthOptions: strengthsList,
            drugQuantityOptions: quantitiesList,
            drugForm: options[value].text,
            drugStrength: defaultStrength,
            drugQuantity: defaultQuantity,
            awpList: awpList,
            estPrice: '$ ' + estPrice
        });
    };


    render() {
        return(
            <Form fluid>
                <Form.Group inline>
                    <label><b>Enter Drug Name</b></label>
                  
                    <Form.Field label='Generic' checked={this.state.isGeneric}  control={Input} type='radio' onChange={this.handleGeneric} name='rxradios' />
                    <Form.Field label='Brand'   checked={!this.state.isGeneric} control={Input} type='radio' onChange={this.handleBrand}  name='rxradios' />
                  
                </Form.Group>
                <Search
                loading={this.state.isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                results={this.state.results}
                value={this.state.value}
                {...this.props}
                input={{ fluid:true }}
                placeholder='e.g. Lipitor'
               
            />

                <Form.Field label='Form' 
                    placeholder='Select Form' 
                    disabled={this.state.drugFormDisabled} 
                    control={Select} 
                    options={this.state.drugFormOptions} 
                    onChange={this.handleDrugFormChange}
                    defaultValue={0} />
                <Form.Field label='Strength' 
                    placeholder='Select Strength' 
                    disabled={this.state.drugStrengthDisabled} 
                    control={Select}
                    options={this.state.drugStrengthOptions} 
                    onChange={this.handleStrengthChange}
                    value={this.state.drugStrength} />
                <Form.Field label='Quantity' 
                    placeholder='Select Quantity' 
                    disabled={this.state.drugQuantityDisabled} 
                    control={Select} 
                    options={this.state.drugQuantityOptions}
                    onChange={this.handleQuantityChange}
                    value={this.state.drugQuantity} />
                <Form.Field label='Estimated Price on MyMedMarket' 
                    disabled={false} 
                    readOnly
                    control={Input} 
                    options={this.state.drugQuantityOptions}
                    value={this.state.estPrice}/>
                <NavLink to={
                            {
                                pathname: '/myhealthrecord',
                                state: { 
                                    isPrescription: true,
                                    drugName: this.state.drugName,
                                    drugForm: this.state.drugForm,
                                    drugStrength: this.state.drugStrength,
                                    drugQuantity: this.state.drugQuantity,
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

export default RetailSearch;
