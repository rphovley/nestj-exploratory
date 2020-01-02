export class APIResponse{

    statusCode: number = 200;
    data: any = null;

    constructor(init?: Partial<APIResponse>){
        if(init.data){
            init.data = init.data;
        }

        Object.assign(this, init) as APIResponse;
    }

    public static json(
        statusCodeOrAPIResponseObject: Partial<APIResponse> | number,
        data?: any
    ): APIResponse{

        if(typeof statusCodeOrAPIResponseObject === 'object'){
            return new APIResponse(statusCodeOrAPIResponseObject);
        }
        else if(typeof statusCodeOrAPIResponseObject === 'number'){
            return new APIResponse({
                statusCode: statusCodeOrAPIResponseObject,
                data
            });
        }
        else{
            return new APIResponse();
        }
    }
}