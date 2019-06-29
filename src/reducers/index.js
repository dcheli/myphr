import { combineReducers } from 'redux';
import PatientReducer from './patient';
import AllergiesReducer from './allergies';
import MedicationsReducer from './medications';
import ProvidersReducer from './providers';
import MyM3Prescriptions from './mym3prescriptions';

const rootReducer = combineReducers({
  patient: PatientReducer,
  allergies: AllergiesReducer,
  medications: MedicationsReducer,
  providers: ProvidersReducer,
  mym3prescriptions: MyM3Prescriptions
});

export default rootReducer;
