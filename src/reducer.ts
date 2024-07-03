import { GetResourceResponse } from "./ServerMock";

export enum ActionType {
    UPDATE_INPUT = "UPDATE_INPUT",
    SET_FETCH_RESPONSE = "UPDATE_FILE_STATUS"
}
  
export interface InputAction {
    type: ActionType;
    payload: any;
}

export interface InputState {
    url: string
    valid: boolean
    fetchResponse: GetResourceResponse|null
}

/**
 * Checks if a URL is valid
 */
const isUrlValid = (value: string) => {
    let isValid = true;
    try{
        new URL(value);
    } catch(error) {
        isValid = false;
    }
    console.log(`${value} is valid URL: ${isValid}`)
    return isValid;
}
  
export function inputReducer(state: InputState, action: InputAction): InputState {
  const { type, payload } = action;
  switch (type) {
    case ActionType.UPDATE_INPUT:
      return {
        url: payload,
        valid: isUrlValid(payload),
        fetchResponse: null
      };
    case ActionType.SET_FETCH_RESPONSE:{
      return{
          ...state, 
          fetchResponse: payload
        }
    }
    default:
      return state;
  }
}