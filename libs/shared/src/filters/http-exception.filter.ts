import { Catch, ArgumentsHost, HttpException, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { HttpRpcException } from '../exceptions/http.rpc.exception';

type HttpResp = {
    statusCode: number,
    message: string[],
    error: string,
}

@Catch(HttpException)
export class HttpExceptionFilter implements  ExceptionFilter {

    catch(exception: HttpException, host: ArgumentsHost): RpcException {
        console.log(`exception in filter: ${JSON.stringify(exception)}`)
        const resp = exception.getResponse() as HttpResp;
        // console.log(`resp: ${JSON.stringify(resp)}`)
        const rpcException = new HttpRpcException(resp, HttpStatus.BAD_REQUEST);
        console.log(`rpcException: ${JSON.stringify(rpcException)}`)
        return rpcException;
    };
}