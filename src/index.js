import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import Header from './components/Header';
import { Container } from 'semantic-ui-react';
import {BrowserRouter, Route } from 'react-router-dom';
import reducers from './reducers';
import Landing from './components/Landing';
import MedicationSearch from './components/MedicationSearch';
import MyM3Dashboard from './containers/MyM3Dashboard';
import MyHealthRecord from './containers/MyHealthRecord';

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

ReactDOM.render(
    <Provider store={store}>
    <BrowserRouter>
        <div>
            <Container>
            <Header />
            <Route exact path='/' component={Landing} />
            <Route exact path='/medicationsearch' component={MedicationSearch} />
            <Route exact path='/myhealthrecord' component={MyHealthRecord} />
            <Route exact path='/mym3dashboard' component={MyM3Dashboard} />
            </Container>
        </div>
    </BrowserRouter>
  </Provider>
  , document.querySelector('.container'));
