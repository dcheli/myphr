import React, { Component } from 'react';
import { Accordion, Segment } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';

const defaultBlueText = {
  color: '#0049db',
  fontSize: '24px',
  fontWeight: '500',
  fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'
}

class MedicationSearch extends Component {

    handleClick = (e, name) => {console.log("Hello ", name )
  
  };
  
    render() {  
      return (
        <div>
          <Accordion fluid styled>
            <Accordion.Title 
              style={{fontSize: '24px', fontWeight: '500', color: '#000000', fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'}}>Select Therapy Class</Accordion.Title>

            <NavLink to={{
                pathname: '/compoundsearch',
                state:{tcCode: 'fc', tcName: 'Foot Care'}
              }}>
              <Accordion.Title style={defaultBlueText}
                name='fc'
              >Foot Care
              </Accordion.Title>
            </NavLink>

            <NavLink to={{
                pathname: '/compoundsearch',
                state:{tcCode: 'hrt', tcName: "Hormone Replacement Therapy"}
              }}>
              <Accordion.Title style={defaultBlueText}
                name='hrt'
                >Hormone Replacement Therapy</Accordion.Title>
            </NavLink>

            <NavLink to={{
                pathname: '/compoundsearch',
                state:{tcCode: 'sc', tcName: 'Skin Care'}
              }}>
              <Accordion.Title style={defaultBlueText}
                name='sc'
                >Skin Care</Accordion.Title>
            </NavLink>

            <NavLink to={{
                pathname: '/compoundsearch',
                state:{tcCode: 'tp', tcName: 'Topical Pain'}
              }}>
              <Accordion.Title style={defaultBlueText}
                name='tc'
                >Topical Pain</Accordion.Title>
            </NavLink>    
          </Accordion>
        </div>
      )
    }
};

export default MedicationSearch;