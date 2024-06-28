import {useState, useEffect, useReducer} from "react";
import { GetResourceResponse, fetchResourceInfo } from "./ServerMock";
import { InputStatus } from "./InputStatus";
import { ActionType, inputReducer } from "./reducer";

/**
 * This solution delays the server-side API call by 2 seconds.
 * If the user types anything within these 2 seconds,
 * the inputState changes, triggering a rerender.
 * During the rerender, useEffect() runs again because its dependency
 * (inputState) has changed. As a result, the setTimeout
 * from the previous render is cleared and replaced with
 * a new one using the latest input value. 
 * Consequently, a request is sent with the most recent input value 
 * after the user pauses for about 2 seconds.
 */
const API_CALLS_DELAY_MS = 2000;

export default function App(){
    /**
     * Stores user input and its validity atomically.
     */
    const [inputState, dispatchInputState] = useReducer(inputReducer, {url:'', valid:false});

    /**
     * Stores the status of the file resource
     * The value is set to null when the client does not know the status.
     */
    const [fileStatus, setFileStatus] = useState<GetResourceResponse|null>(null);

    useEffect(() => {
        let timeoutId = setTimeout(async () => {
            setFileStatus(null);
            if (inputState.valid === true){
                console.log(`Invoking Server API:${inputState.url}`)
                const response = await fetchResourceInfo(inputState.url);
                console.log(`Server Response:${JSON.stringify(response)}`)
                setFileStatus(response);
            }
        }, API_CALLS_DELAY_MS);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [inputState]);
  
    
    return(
        <div>
            <label>
                Enter URL: 
                <input name="url" value={inputState.url}
                    onChange={(e) => dispatchInputState({type:ActionType.UPDATE_INPUT, payload:e.target.value})}
                />
        </label>
        <InputStatus status={inputState.valid} statusDescription={{
                name: "URL valid",
                errorText: "No",
                successText: "Yes",
                unknownText: "Waiting on Input"
            }}/>
        <InputStatus status={fileStatus?.found} statusDescription={{
            name: "Server Resource",
            errorText: "Not found",
            successText: `Found a ${fileStatus?.type}`,
            unknownText: "Waiting on valid URL"
        }}/>
    </div>
    )
}