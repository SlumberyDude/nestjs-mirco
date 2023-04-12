import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ParseJsonPipe implements PipeTransform<string, Record<string, any>> {
    transform(value: string, metadata: ArgumentMetadata): Record<string, any> {
        const propertyName = metadata.data;
        try {
            return JSON.parse(value);
        } catch {
            throw new RpcException(`${propertyName} содержит невалидный JSON`);
        }
    }
}