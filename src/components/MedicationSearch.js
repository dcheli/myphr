import React, { Component } from 'react';
import { Input, Menu, Segment } from 'semantic-ui-react'
import RetailSearch from './RetailSearch';
import CompoundSearch from './CompoundSearch';

class MedicationSearch extends Component {
    state = { activeItem: 'Compound Medications' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  
    render() {
      const { activeItem } = this.state
  
      return (
        <div>
          <Menu attached='top' tabular>
          <Menu.Item
              name='Compound Medications'
              active={activeItem === 'Compound Medications'}
              onClick={this.handleItemClick}
              color='blue'
            />

            <Menu.Item 
                name='Retail Medications' 
                active={activeItem === 'Retail Medications'} 
                onClick={this.handleItemClick}
                color='blue'
                />
          </Menu>
  
          <Segment attached='bottom' color='blue' clearing>
            {(activeItem === 'Compound Medications') ? <CompoundSearch /> : <RetailSearch />}
          </Segment>
        </div>
      )
    }
};

export default MedicationSearch;