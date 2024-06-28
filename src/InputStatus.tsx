
// Both null and undefined are interpreted as unknown.
export type Successful = boolean | null | undefined

export type StatusDescription = {
    name: string
    errorText: string
    successText: string
    unknownText: string
}
/**
 * Renders the text message based on the status.
 */
export function InputStatus(prop:{status: Successful, statusDescription: StatusDescription}){
    function renderSwitch(){
        switch(prop.status){
            case false:
                return prop.statusDescription.errorText
            case true:
                return prop.statusDescription.successText
            default:
                return prop.statusDescription.unknownText
        }
    }
    return(<div>
        {prop.statusDescription.name}:{renderSwitch()}
        </div>
    )
}