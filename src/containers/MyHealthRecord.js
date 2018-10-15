import React, {Component} from 'react';
import { Accordion, Table, Icon, Button, Segment, Label, Checkbox, Message, Confirm, Modal} from 'semantic-ui-react'
import Demographics from './Demographics';
import Allergies from './Allergies';
import Medications from './Medications';
import Providers from './Providers';
import { connect } from 'react-redux';
import * as actions from '../actions';
import _ from 'lodash';
import axios from 'axios';
const ROOT_URL = 'http://localhost:5000';
import ProviderList from '../components/ProviderList';
import Constants from '../constants';
import { networkInterfaces } from 'os';

const myId = '5b71e7a398b69632ac5e6393';
class MyHealthRecord extends Component {

    constructor(props){
        super(props);
        this.state = { 
            activeIndex: 0,
            hideRxSegment: true,
            drugName: '',
            drugForm: '', 
            drugStrength: '', 
            drugQuantity: '',
            estPrice: '',
            openTermConfirm: false,
            openM3Confirm: false,
            checked: false,
            popup: false, 
            selectedProviderAddress: '',
            dataset: '',
            datasetIsShared: false,
            providersIsShared: this.props.providers.isShared,
            allergiesIsShared: this.props.allergies.isShared,
            medicationsIsShared: this.props.medications.isShared,
            openProviderModal: false };
    }

    componentDidMount() {
        // this kicks off the data loading process
        this.props.fetchDemographics(myId);
        this.props.fetchAllergies(myId);  
        this.props.fetchMedications(myId);      
        this.props.fetchProviders(myId); 
        // location.state is coming in from React Route
        if(this.props.location.state !== undefined) {
            const { isPrescription, drugName, drugForm, drugStrength, drugQuantity, estPrice } = this.props.location.state;
            this.setState({ hideRxSegment: !isPrescription,
                drugName, drugForm, drugStrength, drugQuantity, estPrice, 
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            providersIsShared: nextProps.providers.isShared,
            allergiesIsShared: nextProps.allergies.isShared,
            medicationsIsShared: nextProps.medications.isShared
        });        
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
      }

      handleShare = (event) => {
        this.setState({openProviderModal: true, dataset: event.target.value, datasetIsShared: true});
      }

      handleUnShare = (event) => {
        this.setState({openProviderModal: true, dataset: event.target.value, datasetIsShared: false});
    }

/*    handleShareConfirm = (event) => {
        console.log(event.target.value , " is shared");
        var url = ROOT_URL + '/api/healthrecord/' + myId + '/' + event.target.value;
        
        axios.post(ROOT_URL + '/api/healthdrs/' + myId + '/createservice/' + event.target.value, {
            url: url,
            value: true
        });

        switch(event.target.value) {
            case "allergies":
                this.setState({allergiesIsShared: true});
                break;
            case "medications":
                this.setState({medicationsIsShared: true});
                break;
            case "providers":
                this.setState({providersIsShared: true});
                break;
        }        
    }
*/
    handleUnShareConfirm = (event) => {
        // TODO: Unshare needs to revoke key access
        console.log(event.target.value , " is unshared")
        axios.post(ROOT_URL + '/api/healthrecord/' + myId + '/share/' + event.target.value, {
            url: "",
            value: false
        });

        switch(event.target.value) {
            case "allergies":
                this.setState({allergiesIsShared: false});
                break;
            case "medications":
                this.setState({medicationsIsShared: false});
                break;
            case "providers":
                this.setState({providersIsShared: false});
                break;
        }        
    }

    handleTerms = () => {
        if (this.state.checked){
            this.setState({  checked: false });
            this.setState({ openTermConfirm: false });
        }
        else {
            this.setState({ checked: true });
            this.setState({ openTermConfirm: true });
        }
    }

    handleM3Click = () => this.setState({ openM3Confirm: true})
    handleM3Confirm = () => {
        this.sendToM3();
        this.setState({ openM3Confirm: false})
    }
    
    handleM3Cancel= () => this.setState({ openM3Confirm: false})

    handleTermCancel = () => {
        this.setState({ openTermConfirm: false, checked: false})}
    handleTermConfirm = () => {this.setState({ openTermConfirm: false})}
    handlePopupDismiss = () => {
        this.setState({ popup: false })
    
      }

    closeProviderModal = () => {
        this.setState({ openProviderModal: false })};

    cancelProviderConfirm = () => {
        this.setState({openProviderModal: false});
    }

    getProviders = (ethereumAddress) => {
        console.log ("providers are ", ethereumAddress)
        this.setState({ selectedProviderAddress: ethereumAddress});                     
    }

    shareWithProviders = () => {
        console.log ("Calling shareWithProviders with address ", this.state.selectedProviderAddress);
        console.log("share dataset ", this.state.dataset);
        axios.post(ROOT_URL + '/api/healthdrs/' + myId + '/share/' + this.state.dataset, {
            recipient: this.state.selectedProviderAddress,
            url: ROOT_URL + '/api/healthrecord/' + myId +'/' + this.state.dataset,
            value: this.state.datasetIsShared
        });

        switch(this.state.dataset) {
            case "providers":
                this.setState({openProviderModal: false, providersIsShared: true});
            break;
            case "allergies":
                this.setState({openProviderModal: false, allergiesIsShared: true});
            break;
            case "medications":
                this.setState({openProviderModal: false, medicationsIsShared: true});
            break;
        }
    }


    unshareWithProviders = () => {
        console.log ("Calling unshareWithProviders with address ", this.state.selectedProviderAddress);
        console.log("unshare dataset ", this.state.dataset);
        axios.post(ROOT_URL + '/api/healthdrs/' + myId + '/share/' + this.state.dataset, {
            recipient: this.state.selectedProviderAddress,
            url: ROOT_URL + '/api/healthrecord/' + myId +'/' + this.state.dataset,
            value: this.state.datasetIsShared
        });
        switch(this.state.dataset) {
            case "providers":
                this.setState({openProviderModal: false, providersIsShared: false});
            break;
            case "allergies":
                this.setState({openProviderModal: false, allergiesIsShared: false});
            break;
            case "medications":
                this.setState({openProviderModal: false, medicationsIsShared: false});
            break;
        }
    }



    sendToM3 = () => {
        const { ethereumAddress, addresses } = this.props.demographics;
        var address = _.find(addresses, {type:'home'});

       // remember myId is the recordId in mongo
        axios.post(ROOT_URL + '/api/m3/' + myId + '/addscript', {
            drugName: this.state.drugName,
            drugForm: this.state.drugForm,
            drugStrength:this.state.drugStrength,
            drugQuantity: this.state.drugQuantity,
            price: this.state.estPrice,
            address: ethereumAddress,
            state: address.state,
            therapyClass: ''
          })
          .then((response) => {
            this.setState({popup: true});
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    
    render() {
        if(this.props.allergies === undefined)
            return(<div>Still loading</div>);

        const { activeIndex, popup } = this.state
        return (
            <div>
                {(popup) ?             
                <Message 
                    success
                    icon
                    onDismiss={this.handlePopupDismiss}>
                    <Icon name='check' />
                    Your prescription has been added to MyMedMarket.
                </Message> : ""}

            <Segment clearing color={'red'} hidden={this.state.hideRxSegment}>
                    <Label color='red' ribbon size='big'>Your Prescription For </Label>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Drug Name:&nbsp;&nbsp;{this.state.drugName}</Table.HeaderCell>
                                <Table.HeaderCell>Form:&nbsp;&nbsp;{this.state.drugForm}</Table.HeaderCell>
                                <Table.HeaderCell>Strength:&nbsp;&nbsp;{this.state.drugStrength}</Table.HeaderCell>
                                <Table.HeaderCell>Quantity:&nbsp;&nbsp;{this.state.drugQuantity}</Table.HeaderCell>
                                <Table.HeaderCell>Est Price:&nbsp;&nbsp;{this.state.estPrice}</Table.HeaderCell>
                          </Table.Row>
                      </Table.Header>
                    </Table>
                    <h3>To help improve the timeliness of filling your prescription, you may <i>optionally</i> Share any of the your information with the MyMedMarket pharmacy by clicking the <Button size='tiny' positive>Share</Button> button(s) below.</h3>
                 
                    <Segment clearing  color='teal' >
                    
                    
                    <Checkbox checked={this.state.checked} onClick={this.handleTerms} label='I agree to the Terms and Conditions'/>
                    <Confirm 
                        open={this.state.openTermConfirm}                    
                        onConfirm={this.handleTermConfirm}
                        header='Terms and Conditions'
                        content='A bunch of text goes here'
                        confirmButton='I Agree'
                        onCancel={this.handleTermCancel}
                    />
 
                    <Button  primary icon
                            floated='right'
                            labelPosition='right'
                            onClick={this.handleM3Click}>Send to MyMedMarket
                            <Icon name='send' />
                    </Button>
                    <Confirm 
                        open={this.state.openM3Confirm}                    
                        onConfirm={this.handleM3Confirm}
                        header='Press Submit to send ot MyMedMarket'
                        content='A bunch of text goes here'
                        confirmButton='Submit'
                        onCancel={this.handleM3Cancel}
                    />
                   
                    </Segment>
           
                    </Segment>

                <Segment color='red' >
                <Accordion fluid styled>
                <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                    <Icon name='heart' color='red' size='big' />
                    <Icon name='dropdown' />
                    DEMOGRAPHICS
                    <Button.Group floated='right'>
                        <Button value="demographics" onClick={this.handleShare}>Share</Button>
                        <Button.Or />
                        <Button positive value="demographics" onClick={this.handleUnShare}>Unshare</Button>
                    </Button.Group>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    <Demographics />
                </Accordion.Content>
        
                <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                <Icon name='user md' color='green' size='big' />
                  <Icon name='dropdown' />
                  
                  PROVIDERS
                  <Button.Group floated='right'>
                        <Button positive={this.state.providersIsShared} value='providers' onClick={this.handleShare}>Share</Button>
                        <Button.Or />
                        <Button positive={!this.state.providersIsShared} value='providers' onClick={this.handleUnShare}>Unshare</Button>
                    </Button.Group>
                    

                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                  <Providers />
                </Accordion.Content>
        
                <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
                <Icon name='dna' color='yellow' size='big' />
                  <Icon name='dropdown' />
                  ALLERGIES
                  <Button.Group floated='right'>
                        <Button positive={this.state.allergiesIsShared} value='allergies' onClick={this.handleShare}>Share</Button>
                        <Button.Or />
                        <Button positive={!this.state.allergiesIsShared} value='allergies' onClick={this.handleUnShare}>Unshare</Button>
                    </Button.Group>

                </Accordion.Title>
                <Accordion.Content active={activeIndex === 2}>
                  <Allergies />
                </Accordion.Content>


                <Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleClick}>
                <Icon name='pills' color='blue' size='big' />
                  <Icon name='dropdown' />
                 MEDICATIONS
                 <Button.Group floated='right'>
                        <Button positive={this.state.medicationsIsShared} value='medications' onClick={this.handleShare}>Share</Button>
                        <Button.Or />
                        <Button positive={!this.state.medicationsIsShared} value='medications' onClick={this.handleUnShare}>Unshare</Button>
                    </Button.Group>

                </Accordion.Title>
                <Accordion.Content active={activeIndex === 3}>
                <Medications />
                </Accordion.Content>
              </Accordion>
              </Segment>




        <Modal size='large' open={this.state.openProviderModal} onClose={this.closeProviderModal}>
                    
            <Modal.Header> Select providers to share this data wtih </Modal.Header>
            <Modal.Content>
                <ProviderList 
                providerList={this.props.providers.providers}
                callback={this.getProviders}
                />
            </Modal.Content>

            <Modal.Actions>
                <Button negative
                    onClick={this.cancelProviderConfirm}>
                    Cancel
                </Button>

            {(this.state.datasetIsShared)  ?
                <Button positive 
                    onClick={this.shareWithProviders}
                    loading={this.state.loading}
                    icon='checkmark' labelPosition='right' content='Share Data' /> :
                <Button positive 
                    onClick={this.unshareWithProviders}
                    loading={this.state.loading}
                    icon='checkmark' labelPosition='right' content='Unshare Data' />}

          </Modal.Actions>
          </Modal>

              </div>

        );      
    };
}

function mapStateToProps({ 
        allergies: allergies, 
        medications: medications, 
        providers: providers,
        demographics: demographics}) {
        
              
    return ({
            allergies : allergies,
            medications: medications,
            providers: providers,
            demographics: demographics.data
            });
}

export default connect(mapStateToProps, actions)(MyHealthRecord);
