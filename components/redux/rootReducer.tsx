import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'

 
export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
}

export const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout']
}

const rootReducer = combineReducers({
   
})

export default rootReducer