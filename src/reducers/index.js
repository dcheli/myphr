import { combineReducers } from 'redux';
import DemographicsReducer from './demographics';
import AllergiesReducer from './allergies';
import MedicationsReducer from './medications';
import ProvidersReducer from './providers';

const rootReducer = combineReducers({
  demographics: DemographicsReducer,
  allergies: AllergiesReducer,
  medications: MedicationsReducer,
  providers: ProvidersReducer
});

export default rootReducer;
