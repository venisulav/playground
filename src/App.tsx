import {useEffect, useReducer} from "react";
import { fetchResourceInfo } from "./ServerMock";
import { InputStatus } from "./InputStatus";
import { ActionType, inputReducer } from "./reducer";

/**
 * This solution delays the server-side API call by 2 seconds.
 * If the user types anything within these 2 seconds,
 * the inputState changes, triggering a rerender.
 * During the rerender, useEffect() runs again because its dependency
 * (inputState.url) has changed. As a result, the setTimeout
 * from the previous render is cleared and replaced with
 * a new one using the latest input value.
 * 
 * Consequently, a request is sent to the backend(just a mock here)
 * with the most recent input value after the user
 * pauses for about 2 seconds.
 */
const API_CALLS_DELAY_MS = 2000;

export default function App(){

    const [inputState, dispatchInputState] = useReducer(inputReducer, {url:'', valid:false, fetchResponse: null});

    useEffect(() => {
        /**
         * This flag ensures we don't set a response for an outdated input.
         * Clearing the timeout alone isn't enough.
         */
        let cancelled = false;
        const url = inputState.url;
        const valid = inputState.valid;
        const timeoutId = setTimeout(async () => {
            if (valid === true){
                console.log(`Invoking Server API:${url}`);
                const fetchResponse = await fetchResourceInfo(url);
                console.log(`Server Response:${JSON.stringify(fetchResponse)}`);
                if (!cancelled){
                    dispatchInputState({type:ActionType.SET_FETCH_RESPONSE, payload:fetchResponse });
                }
            }
        }, API_CALLS_DELAY_MS);
        return () => {
            clearTimeout(timeoutId);
            cancelled = true;
        };
    }, [inputState.url, inputState.valid]);
  
    
    return(
        <div>
            <label>
                Enter URL: 
                <input name="url" value={inputState.url}
                    autoComplete={"off"}
                    onChange={(e) => dispatchInputState({type:ActionType.UPDATE_INPUT, payload:e.target.value})}
                />
        </label>
        <InputStatus status={inputState.valid} statusDescription={{
                name: "URL valid",
                errorText: "No",
                successText: "Yes",
                unknownText: "Waiting on Input"
            }}/>
            <InputStatus status={inputState.fetchResponse?.found} statusDescription={{
                name: "Server Resource",
                errorText: "Not found",
                successText: `Found a ${inputState.fetchResponse?.type}`,
                unknownText: inputState.valid ? "Fetch in progress": "Waiting on valid URL"
            }}/>
    </div>
    )
}