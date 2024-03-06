import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function Apiquery() {
  return applyDecorators(
    ApiQuery({ name: 'page', type: Number, required: false }),
    ApiQuery({ name: 'limit', type: Number, required: false }),
    ApiQuery({ name: 'id', type: Number, required: false }),
    ApiQuery({ name: 'orderBy', type: String, required: false }),
    ApiQuery({ name: 'order', type: String, required: false }),
    ApiQuery({ name: 'filter', type: String, required: false }),
    ApiQuery({ name: 'filterBy', type: String, required: false }),

  );
}
