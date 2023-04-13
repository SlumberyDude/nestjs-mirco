import { Catch, ArgumentsHost, HttpException, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpRpcException } from '../exceptions/http.rpc.exception';

type HttpResp = {
    statusCode: number,
    message: string[],
    error: string,
}

@Catch(HttpException)
export class HttpExceptionFilter implements  ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): HttpRpcException {
        const resp = exception.getResponse() as HttpResp;

        const rpcException = new HttpRpcException(resp, HttpStatus.BAD_REQUEST);

        return rpcException;
    };
}