import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Types } from '../entities/types.entity';
import { ApiTags } from '@nestjs/swagger';
import { Resource, Roles } from 'nest-keycloak-connect';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Apiquery } from '../decorators/api-query.decorator';

@ApiBearerAuth()
@ApiTags('Types')
@Controller('api/types')
@Resource('portal-api')
export class TypesController {
    constructor(
        @InjectRepository(Types)
        private readonly typesRepository: Repository<Types>,
    ) { }


    @Get('')
    @Roles({ roles: ['Administrator', 'Operator'] })
    @Apiquery()
    async findAllSchedule(
        @Query('id') id?: number,
        @Query('limit') limit?: number,
        @Query('filter') filter?: string,
        @Query('filterBy') filterBy?: string,
        @Query('page') page?: number,
        @Query('orderBy') orderBy?: 'id',
        @Query('order') order?: 'ASC' | 'DESC',
    ): Promise<Pagination<Types>> {
        const options: IPaginationOptions = {
            page,
            limit: limit || 50,
        };
        const queryBuilder = this.typesRepository.createQueryBuilder('types');
        
        queryBuilder.orderBy(`types.${orderBy || 'id'}`, order || 'ASC');
        return paginate<Types>(queryBuilder, options);
    }


    @Get(':id')
    @Roles({ roles: ['Administrator', 'Operator'] })
    async findScheduleById(@Param('id') id: number): Promise<Types | { message: string }> {
        const schedule = await this.typesRepository
            .createQueryBuilder('types')
            .getOne();
        if (!schedule) {
            return { message: 'Agendamento não encontrado' };
        }
        return schedule;
    }




    @Post()
    @Roles({ roles: ['Administrator'] })
    async createSchedule(@Body() types: Types): Promise<Types> {
        console.log(types)
        return await this.typesRepository.save(types);
    }


    @Patch(':id')
    @Roles({ roles: ['Administrator'] })
    async update(@Param('id') id: string, @Body() types: Types) {
        return await this.typesRepository.update(+id, types);
    }

    @Delete(':id')
    @Roles({ roles: ['Administrator'] })
    async remove(@Param('id') id: string) {
        return await this.typesRepository.delete(+id);
    }
}