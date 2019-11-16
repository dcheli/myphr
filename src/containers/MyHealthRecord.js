import React, {Component} from 'react';
import { Accordion, Table, Icon, Button, Segment, Label, Checkbox, Message, Confirm, Modal} from 'semantic-ui-react'
import Patient from './Patient';
import Allergies from './Allergies';
import Medications from './Medications';
import Providers from './Providers';
import { connect } from 'react-redux';
import * as actions from '../actions';
import _ from 'lodash';
import axios from 'axios';
const ROOT_URL = 'http://localhost:5000';
import ProviderList from '../components/ProviderList';

const myId = '5b71e7a398b69632ac5e6393';
const buttonPText = {
    color: 'white',
    backgroundColor: '#026119',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'
  }

  const buttonNText = {
    color: '#026119',
    backgroundColor: 'white',
    border: '1px solid #026119',
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
const m3Style = {
    color: 'white',
    backgroundColor: '#0050cc',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'
  }

  const tileStyle = {
    color: 'black',
    backgroundColor: 'white',
   
    paddingBottom: '20px',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'
  }

  const labelStyle = {
    color: 'white',
    fontSize: '18px',
    fontWeight: '500',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'
  }

  const prescriptionStyle = {
    color: 'black',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'
  }

var selectedShares = [];
class MyHealthRecord extends Component {

    constructor(props){
        super(props);
        this.state = { 
            activeIndex: 0,
            hideRxSegment: true,
            isCompound: false,
            formula: '',
            form: '', 
            quantity: '',
            estPrice: '',
            therapyClass: '',
            openTermConfirm: false,
            openM3Confirm: false,
            checked: false,
            popup: false, 
            selectedProviderAddress: '',
            dataset: '', 
            shares:[],          // this is an array that will hold the datasets current shares
            shareUpdates:[],    // this is an array that will get sent to m3 for updates
            datasetIsShared: false,
            patientIsShared: this.props.patient.isShared,
            patientSharesCount: '',
            providersIsShared: this.props.providers.isShared,
            allergiesIsShared: this.props.allergies.isShared,
            medicationsIsShared: this.props.medications.isShared,
            openProvidersModal: false,
            axiosResponse: '',
            pharmacyEthAddress: ''}; 
    }

    componentDidMount() {
        // this kicks off the data loading process
        this.props.fetchPatient(myId);
        this.props.fetchAllergies(myId);  
        this.props.fetchMedications(myId);      
        this.props.fetchProviders(myId); 
        // location.state is coming in from React Route
        if(this.props.location.state !== undefined) {
            const { isPrescription, isCompound, formula, form, therapyClass, daySupply, estPrice,pharmacyEthAddress } = this.props.location.state;
            console.log("Pharmacy Eth Address is ", pharmacyEthAddress);
            this.setState({ hideRxSegment: !isPrescription,
                formula, form, daySupply, estPrice, isCompound, therapyClass, pharmacyEthAddress
            });
        }
    }
   
    componentWillReceiveProps(nextProps) {
        this.setState({
            patientIsShared: nextProps.patient.isShared,
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

      handleShare = (event, {dataset}) => {
          console.log("Data set is ", dataset);
        this.setState({openProvidersModal: true, dataset: dataset,shares: event.target.value, datasetIsShared: true});
      }

      handleUnShare = (event) => {
        this.setState({openProvidersModal: true, dataset: event.target.value, datasetIsShared: false});
    }

/*    handleShareConfirm = (event) => {
        console.log(event.target.value , " is shared");
        var url = ROOT_URL + '/api/healthrecord/' + myId + '/' + event.target.value;
        
        axios.post(ROOT_URL + '/api/healthdrs/' + myId + '/createservice/' + event.target.value, {
            url: url,
            value: true
        });

        switch(event.target.value) {
            case "patient":
                this.setState({patientIsShared: true});
                break;
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
/*
        switch(event.target.value) {
            case "patient":
                this.setState({patientIsShared: false});
                break;
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
        */        
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


    closeProvidersModal = () => {
        this.setState({ openProvidersModal: false })};
       selectedShares = [];

    cancelProviderConfirm = () => {
        this.setState({openProvidersModal: false});
        selectedShares = [];
    }

    getProviders = (ethereumAddress, checked) => {
        // maybe the array is built and managed here
        let i = _.findIndex(selectedShares,{'ethereumAddress': ethereumAddress});
        console.log("I is ", i);
        let obj = {'ethereumAddress': ethereumAddress, "share": checked}
        if(i == -1)
            selectedShares.push(obj);
        else
            selectedShares[i] = obj;

        this.setState({ selectedProviderAddress: ethereumAddress, shareUpdates: _.compact(selectedShares)});   
        console.log("NewShares is ", selectedShares);
    }

    shareWithProviders = (event) => {
        // this is only to generate a uniquie ID for the HN service,
         // probably not really needed once you are actively managing service id's
        var dt = Date.now(); 
        event.preventDefault();
        axios.post(ROOT_URL + '/api/healthdrs/' + myId + '/share/' + this.state.dataset, {
            recipient: this.state.selectedProviderAddress,
            url: ROOT_URL + "/api/" + dt + "/fhir/dstu2/" + this.state.dataset +"/" + myId,
        /*    url: ROOT_URL + '/api/healthrecord/' + myId +'/' + this.state.dataset,*/
            value: this.state.datasetIsShared,
            shareUpdates: JSON.stringify(this.state.shareUpdates)
        }).then(response => {
            console.log("Response is ", response);
            selectedShares = [];
            this.setState({'axiosResponse': response.status});
            switch (this.state.dataset) {
                case 'patient':
                    this.props.fetchPatient(myId);
                    break;
                case 'providers':
                    this.props.fetchProviders(myId);                     
                    break;
                case 'allergies':
                    this.props.fetchAllergies(myId);                      
                    break;
                case 'medications':
                    this.props.fetchMedications(myId);                          
                    break;
        
            }
        });
        this.setState({openProvidersModal: false});
    }

    sendToM3 = () => {
          const { ethereumAddress, addresses } = this.props.patient.patient;
        var address = _.find(addresses, {type:'home'});
        
        console.log("Therapy class is ", this.state.therapyClass)
       // remember myId is the recordId in mongo
        axios.post(ROOT_URL + '/api/m3/' + myId + '/sendscript', {
            formula: this.state.formula,
            form: this.state.form,
            daySupply: this.state.daySupply,
            price: this.state.estPrice,
            consumerEthAddress: ethereumAddress,
            state: address.state,
            therapyClass: this.state.therapyClass,
            pharmacyEthAddress: this.state.pharmacyEthAddress
          })
          .then((response) => {
            this.setState({popup: true});
          })
          .catch(function (error) {
            console.log(error);
          });

    }
    
    render() {
        if(this.props.allergies.shares === undefined 
            || this.props.patient.shares === undefined
            || this.props.providers.shares === undefined
            || this.props.medications.shares === undefined)
            return(<div>Still loading</div>);
        const { activeIndex, popup, isCompound} = this.state
     
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

            <Segment clearing hidden={this.state.hideRxSegment}>
                    <Label style={labelStyle} color='red' ribbon >Your Prescription For </Label>
                    <Table>
                        <Table.Header>
                            <Table.Row style={prescriptionStyle}>
                                 {(isCompound)  ?
                                    <Table.HeaderCell>Formula:&nbsp;&nbsp;{this.state.formula}</Table.HeaderCell>
                                    : <Table.HeaderCell>Drug Name:&nbsp;&nbsp;{this.state.formula}</Table.HeaderCell>
                                 }
                                 {(isCompound)  ? <Table.HeaderCell>Form:&nbsp;&nbsp;{this.state.form}</Table.HeaderCell> :
                                    <Table.HeaderCell>Form:&nbsp;&nbsp;{this.state.form}</Table.HeaderCell>
                                 }
                                 {(isCompound)  ? <Table.HeaderCell></Table.HeaderCell> :
                                    <Table.HeaderCell>Strength:&nbsp;&nbsp;{this.state.strength}</Table.HeaderCell>
                                 }
                                <Table.HeaderCell>Day Supply:&nbsp;&nbsp;{this.state.daySupply}</Table.HeaderCell>
                                <Table.HeaderCell>Est Price:&nbsp;$&nbsp;{this.state.estPrice}</Table.HeaderCell>
                          </Table.Row>
                      </Table.Header>
                    </Table>
                    <h3 style={prescriptionStyle}>To help improve the timeliness of filling your prescription, you may <i>optionally</i> Share any of the your information with the MyMedMarket pharmacy by clicking the <Button size='tiny' style={buttonPText}>&nbsp;Share&nbsp;</Button> button(s) below.</h3>
                 
                    <Segment clearing >
                    
                    
                    <Checkbox checked={this.state.checked} onClick={this.handleTerms} label='I agree to the Terms and Conditions'/>
                    {/*<Confirm 
                        open={this.state.openTermConfirm}                    
                        onConfirm={this.handleTermConfirm}
                        header='Terms and Conditions'
                        content='A bunch of text goes here'
                        confirmButton='I Agree'
                        onCancel={this.handleTermCancel}
                    />
                    */}
                    <Modal
                        open={this.state.openTermConfirm}                    
                        onConfirm={this.handleTermConfirm}
                       confirmButton='I Agree'
                        onCancel={this.handleTermCancel}
                    >
                        <Modal.Header>Terms and Conditions</Modal.Header>
                        <Modal.Content>A bunch of legal text goes here</Modal.Content>
                        <Modal.Actions>
                        <Button style={modalNButton}
                            onClick={this.handleTermCancel}>
                            Cancel</Button>
                        <Button style={buttonPText} 
                            onClick={this.handleTermConfirm}
                            content='I Agree' />
                
                        </Modal.Actions>
                    </Modal>
                    

                    {<Button  style={m3Style} icon
                            floated='right'
                            labelPosition='right'
                            onClick={this.handleM3Click}>Send to MyMedMarket
                            <Icon name='send' />
                    </Button>}

                    <Modal
                        open={this.state.openM3Confirm}                    
                        onConfirm={this.handleTermConfirm}
                       confirmButton='I Agree'
                        onCancel={this.handleTermCancel}
                    >
                        <Modal.Header>Send Prescription to Pharmacy</Modal.Header>
                        <Modal.Content>A bunch of legal text goes here</Modal.Content>
                        <Modal.Actions>
                        <Button style={modalNButton}
                            onClick={this.handleM3Cancel}>
                            Cancel</Button>
                        <Button style={buttonPText} 
                            onClick={this.handleM3Confirm}
                            content='Send' />
                
                        </Modal.Actions>
                    </Modal>
                    {/*<Confirm 
                       
                        open={this.state.openM3Confirm}                    
                        onConfirm={this.handleM3Confirm}
                        header='Press Submit to send ot MyMedMarket'
                        content='A bunch of text goes here'
                        confirmButton='Submit'
                        onCancel={this.handleM3Cancel}
                    />*/}
                   
                    </Segment>
           
                    </Segment>

                <Segment >
                <Accordion fluid styled>
                <Accordion.Title style={tileStyle} active={activeIndex === 0} index={0} onClick={this.handleClick}>
                    <Icon name='heart' color='red' size='big' />
                    <Icon name='dropdown' />
                    PATIENT
                    <Button.Group floated='right'>
                    {(this.props.patient.shares.length > 0) ?
                        <Label color='red' as='a' pointing='right'>
                            {this.props.patient.shares.length}
                        </Label> : ""
                    }
                    {(this.props.patient.shares.length) ?
                        <Button style={buttonPText} positive={this.state.patientIsShared} dataset='patient' value={JSON.stringify(this.props.patient.shares)} onClick={this.handleShare}>Shared</Button>
                        :<Button basic positive={!this.state.patientIsShared} dataset='patient' value={JSON.stringify(this.props.patient.shares)} onClick={this.handleShare}>&nbsp;Share&nbsp;</Button>}
                    </Button.Group>
                    
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    <Patient />
                </Accordion.Content>
        
                <Accordion.Title  style={tileStyle} active={activeIndex === 1} index={1} onClick={this.handleClick}>
                <Icon name='user md' color='green' size='big' />
                  <Icon name='dropdown' />
                  
                  PROVIDERS
                  <Button.Group floated='right'>
                  {(this.props.providers.shares.length > 0) ?
                        <Label color='red'  as='a' pointing='right'>
                            {this.props.providers.shares.length}
                        </Label> : ""
                  }
                  {(this.state.providersIsShared) ?
                        <Button  style={buttonPText} positive={this.state.providersIsShared} dataset='providers' value={JSON.stringify(this.props.providers.shares)} onClick={this.handleShare}>Shared </Button>
                        :<Button basic positive={!this.state.providersIsShared} dataset='providers' value={JSON.stringify(this.props.providers.shares)} onClick={this.handleShare}>Share</Button>}
                    
                    </Button.Group>
                    

                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                  <Providers />
                </Accordion.Content>
        
                <Accordion.Title style={tileStyle} active={activeIndex === 2} index={2} onClick={this.handleClick}>
                <Icon name='dna' color='yellow' size='big' />
                  <Icon name='dropdown' />
                  ALLERGIES                  
                  <Button.Group floated='right'>
                  {(this.props.allergies.shares.length > 0) ?
                        <Label color='red' as='a' pointing='right'>
                            {this.props.allergies.shares.length}
                        </Label> : ""
                    }
                  {(this.state.allergiesIsShared) ?
                        <Button style={buttonPText} positive={this.state.allergiesIsShared} dataset='allergies' value={JSON.stringify(this.props.allergies.shares)} onClick={this.handleShare}>Shared</Button>
                        :<Button style={buttonNText} positive={!this.state.allergiesIsShared} dataset='allergies' value={JSON.stringify(this.props.allergies.shares)} onClick={this.handleShare}>&nbsp;Share&nbsp;</Button>}
                    </Button.Group>

                </Accordion.Title>
                <Accordion.Content active={activeIndex === 2}>
                  <Allergies />
                </Accordion.Content>


                <Accordion.Title style={tileStyle} active={activeIndex === 3} index={3} onClick={this.handleClick}>
                <Icon name='pills' color='blue' size='big' />
                  <Icon name='dropdown' />
                 MEDICATIONS
                 <Button.Group floated='right'>
                 {(this.props.medications.shares.length > 0) ?
                        <Label color='red' as='a' pointing='right'>
                            {this.props.medications.shares.length}
                        </Label> : ""
                    }
                 {(this.state.medicationsIsShared) ?
                        <Button style={buttonPText} positive={this.state.medicationsIsShared} dataset='medications' value={JSON.stringify(this.props.medications.shares)} onClick={this.handleShare}>Shared</Button>
                        :<Button style={buttonNText} positive={!this.state.medicationsIsShared} dataset='medications' value={JSON.stringify(this.props.medications.shares)} onClick={this.handleShare}>&nbsp;Share&nbsp;</Button>}
                    </Button.Group>

                </Accordion.Title>
                <Accordion.Content active={activeIndex === 3}>
                <Medications />
                </Accordion.Content>
              </Accordion>
              </Segment>



        <Modal size='large' open={this.state.openProvidersModal} onClose={this.closeProvidersModal}>
                    
            <Modal.Header> Select providers to share this data wtih. Uncheck the provider to revoke access to the data.</Modal.Header>
            <Modal.Content>
                <ProviderList 
                providerList={this.props.providers.providers}
                callback={this.getProviders}
                shares={this.state.shares}
                
                />
            </Modal.Content>

            <Modal.Actions>
                <Button style={modalNButton}
                    onClick={this.cancelProviderConfirm}>
                    Cancel
                </Button>

            {(this.state.datasetIsShared)  ?
                <Button style={buttonPText} 
                    onClick={this.shareWithProviders}
                    loading={this.state.loading}
                    icon='checkmark' labelPosition='right' content='Update Shares' /> : ""
                }

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
        patient: patient}) {
          
    return ({
            allergies : allergies,
            medications: medications,
            providers: providers,
            patient: patient
            });
}

export default connect(mapStateToProps, actions)(MyHealthRecord);
