import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { ValidationPipe } from '../pipes/validation.pipe';
import { InitDto } from './dto/init.dto';
import { InitService } from './init.service';

@ApiTags('Инициализация приложения')
// @UsePipes(ValidationPipe)
@Controller('init')
export class InitController {

    constructor(private initService: InitService) {}

    @Post()
    createAdminAndRoles(@Body() initDto: InitDto) {
        return this.initService.createAdminAndRoles(initDto);
    }
    
}
