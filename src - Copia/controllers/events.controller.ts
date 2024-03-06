import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Events } from '../entities/events.entity';
import { ApiTags } from '@nestjs/swagger';
import { Resource, Roles } from 'nest-keycloak-connect';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Apiquery } from '../decorators/api-query.decorator';
import { Types } from 'src/entities/types.entity';

@ApiBearerAuth()
@ApiTags('Events')
@Controller('api/events')
@Resource('portal-api')
export class EventsController {
    constructor(
        @InjectRepository(Events)
        private readonly eventsRepository: Repository<Events>,
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
    ): Promise<Pagination<Events>> {
        const options: IPaginationOptions = {
            page,
            limit: limit || 50,
        };
        const queryBuilder = this.eventsRepository.createQueryBuilder('events')
            .leftJoinAndSelect('events.type', 'type');
        if (filterBy != 'null' && filter != 'null') {
            if(filterBy == 'id'){
                filterBy = 'idDevice'
            }
            queryBuilder.where(`LOWER(CAST(${filterBy} AS TEXT)) LIKE LOWER('${filter}%')`);
        }
        queryBuilder.orderBy(`events.${orderBy || 'id'}`, order || 'ASC');
        return paginate<Events>(queryBuilder, options);
    }


    @Get(':id')
    @Roles({ roles: ['Administrator', 'Operator'] })
    async findScheduleById(@Param('id') id: number): Promise<Events | { message: string }> {
        const schedule = await this.eventsRepository
            .createQueryBuilder('events')
            .getOne();
        if (!schedule) {
            return { message: 'Agendamento não encontrado' };
        }
        return schedule;
    }




    @Post()
    @Roles({ roles: ['Administrator'] })
    async createSchedule(@Body() events: Events): Promise<Events> {
        console.log(events)

        return await this.eventsRepository.save(events);
    }


    @Patch(':id')
    @Roles({ roles: ['Administrator'] })
    async update(@Param('id') id: string, @Body() events: Events) {
        return await this.eventsRepository.update(+id, events);
    }

    @Delete(':id')
    @Roles({ roles: ['Administrator'] })
    async remove(@Param('id') id: string) {
        return await this.eventsRepository.delete(+id);
    }
}