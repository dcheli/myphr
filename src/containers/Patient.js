import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
//const myId = '5b64aefb82ca771b88487511';
import _ from 'lodash';

class Patient extends Component {
     render() {
         if(this.props.patient === undefined) 
            return(<div>Still loading</div>);
         

        const { name, addresses, contacts } = this.props.patient;    
        const {gender, dateOfBirth, weight, height, maritalStatus} = this.props.patient;
        var address = _.find(addresses, {type:'home'});
        var contact = _.find(contacts, {type:'home'});

        return(
            <Table>
                
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='6'>Personal Information</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell><b>Name:&nbsp;&nbsp;&nbsp;</b>{name.firstName}&nbsp;{name.middleName}&nbsp;{name.lastName}</Table.Cell>
                    <Table.Cell><b>Gender:&nbsp;&nbsp;&nbsp;</b>{gender}</Table.Cell>
                    <Table.Cell><b>Birth Date:&nbsp;&nbsp;&nbsp;</b>{dateOfBirth}</Table.Cell>
                    <Table.Cell><b>Marital Status:&nbsp;&nbsp;&nbsp;</b>{maritalStatus}</Table.Cell>
                    <Table.Cell><b>Weight:&nbsp;&nbsp;&nbsp;</b>{weight}</Table.Cell>
                    <Table.Cell><b>Height:&nbsp;&nbsp;&nbsp;</b>{height}</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell><b>Address:&nbsp;&nbsp;&nbsp;</b>(home)&nbsp;&nbsp;{address.address1}</Table.Cell>
                    <Table.Cell><b>City:&nbsp;&nbsp;&nbsp;</b>{address.city}</Table.Cell>
                    <Table.Cell><b>State:&nbsp;&nbsp;&nbsp;</b>{address.state}</Table.Cell>
                    <Table.Cell><b>Zip:&nbsp;&nbsp;&nbsp;</b>{address.zip}</Table.Cell>
                    <Table.Cell colSpan='2'><b>Phone:&nbsp;&nbsp;&nbsp;</b>{contact.number}</Table.Cell>
                   
                </Table.Row>

            </Table.Body>
            </Table>    

        );
    };
}


function mapStateToProps({patient={}, isLoading=false}) {
    return{
        patient: patient.patient
    }
}

export default connect(mapStateToProps)(Patient);
