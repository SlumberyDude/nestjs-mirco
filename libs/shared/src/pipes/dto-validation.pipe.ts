import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class DtoValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        // console.log(`Object for DtoValidation: ${value}`);

        const obj = plainToClass(metadata.metatype, value); // Получаем объект, который будем валидировать
        const errors = await validate(obj);
        // console.log(`Got Errors: ${errors}`);

        if (errors.length) {
            let record: object = {};
            errors.map(err => {
                record[err.property] = Object.values(err.constraints).join(', ');
            })
            // console.log(`Record: ${JSON.stringify(record)}`);
            throw new HttpException(record, HttpStatus.BAD_REQUEST);
        }
        return value;
    }
    
}