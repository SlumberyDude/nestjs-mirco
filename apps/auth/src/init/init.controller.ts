import { Controller, UseFilters } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { DtoValidationPipe, HttpExceptionFilter, ObservableExceptionFilter, SharedService } from 'y/shared';
import { InitDto } from './dto/init.dto';
import { InitService } from './init.service';

@ApiTags('Инициализация приложения')
@Controller('init')
export class InitController {

    constructor(
        private initService: InitService,
        private readonly sharedService: SharedService,
    ) {}

    @UseFilters(new HttpExceptionFilter(), new ObservableExceptionFilter())
    @MessagePattern({ cmd: 'init-server' })
    async createAdminAndRoles(
        @Ctx() context: RmqContext,
        @Payload( new DtoValidationPipe() ) dto: InitDto,
    ) {
        this.sharedService.acknowledgeMessage(context);

        return await this.initService.createAdminAndRoles(dto);
    }
    
}
