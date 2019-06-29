import Constants  from '../constants';
import axios from 'axios';
//const ROOT_URL = 'http://localhost:5000';

export const fetchPatient = (myId) => (dispatch) => {

    axios.get(Constants.ROOT_URL + '/api/healthrecord/' + myId + '/patient')
        .then (({data}) => {
            dispatch(setPatientDetails(data));
        });
};


function setPatientDetails(data) {
    return {
        type: Constants.SET_PATIENT_DETAILS,
        payload: data
    };
}

export const fetchAllergies = (myId) => (dispatch) => {
    axios.get(Constants.ROOT_URL + '/api/healthrecord/' + myId + '/allergies')
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
    axios.get(Constants.ROOT_URL + '/api/healthrecord/' + myId + '/medications')
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
    axios.get(Constants.ROOT_URL + '/api/healthrecord/' + myId + '/providers')
        .then (({data}) => {
            dispatch(setProviderDetails(data));
        });
};


function setProviderDetails(data) {
    return {
        type: Constants.SET_PROVIDER_DETAILS,
        payload: data
    };
};


export const fetchM3Prescriptions = (ethaddr) => (dispatch) => {
    axios.get(Constants.ROOT_URL + '/api/m3/' + ethaddr + '/mym3prescriptions')
        .then (({data}) => {
            if(data.length === 0)
                dispatch({ type: Constants.NOT_FOUND })
            dispatch(setM3PrescriptionDetails(data));
        });
};


function setM3PrescriptionDetails(data) {
    return {
        type: Constants.SET_M3PRESCRIPTION_DETAILS,
        payload: data
    };
};