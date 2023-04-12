import { RpcException } from "@nestjs/microservices";

export class HttpRpcException extends RpcException {
    messages: string[];
    statusCode: number;

    constructor(response) {
        super(response);
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.messages,
            error: this.getError(),
        }
    }
}