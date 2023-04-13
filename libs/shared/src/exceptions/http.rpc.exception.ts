import { RpcException } from "@nestjs/microservices";

export class HttpRpcException extends RpcException {
    statusCode: number;

    constructor(response: string | object, statusCode = 200) {
        super(response);
        // this.statusCode = statusCode;
        this.statusCode = statusCode;
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            error: this.getError(),
        }
    }
}