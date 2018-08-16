import Constants  from '../constants';
import axios from 'axios';
const ROOT_URL = 'http://localhost:5000';

export const fetchDemographics = (myId) => (dispatch) => {

    axios.get(ROOT_URL + '/api/healthrecord/' + myId + '/demographics')
        .then (({data}) => {
            dispatch(setDemographicDetails(data));
        });
};


function setDemographicDetails(data) {
    return {
        type: Constants.SET_DEMOGRAPHIC_DETAILS,
        payload: data
    };
}

export const fetchAllergies = (myId) => (dispatch) => {
    axios.get(ROOT_URL + '/api/healthrecord/' + myId + '/allergies')
        .then (({data}) => {
            dispatch(setAllergyDetails(data));
        });
};


function setAllergyDetails(data) {
    return {
        type: Constants.SET_ALLERGY_DETAILS,
        payload: data
    };
}

export const fetchMedications = (myId) => (dispatch) => {
    axios.get(ROOT_URL + '/api/healthrecord/' + myId + '/medications')
        .then (({data}) => {
            dispatch(setMedicationDetails(data));
        });
};


function setMedicationDetails(data) {
    return {
        type: Constants.SET_MEDICATION_DETAILS,
        payload: data
    };
}

export const fetchProviders = (myId) => (dispatch) => {
    axios.get(ROOT_URL + '/api/healthrecord/' + myId + '/providers')
        .then (({data}) => {
            dispatch(setProviderDetails(data));
        });
};


function setProviderDetails(data) {
    return {
        type: Constants.SET_PROVIDER_DETAILS,
        payload: data
    };
}