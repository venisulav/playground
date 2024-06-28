
export enum ActionType {
    UPDATE_INPUT="UPDATE_INPUT"
}
  
export interface InputAction {
    type: ActionType;
    payload: string;
}
  
export interface InputState {
    url: string
    valid: boolean | null
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
  
  /**
   * This reducer updates text input and its validity together.
   * This avoids a race condition and also makes sure URL validation is
   * done only once.
   */
  export function inputReducer(state: InputState, action: InputAction) {
    const { type, payload } = action;
    switch (type) {
      case ActionType.UPDATE_INPUT:
        return {
          ...state,
          url: payload,
          valid: isUrlValid(payload)
        };
      default:
        return state;
    }
  }