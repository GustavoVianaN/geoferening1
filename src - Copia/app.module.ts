import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { KeycloakConnectModule, ResourceGuard, RoleGuard, AuthGuard } from 'nest-keycloak-connect';
import { Events } from './entities/events.entity';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { EventsController } from './controllers/events.controller';
import { Types } from './entities/types.entity';
import { TypesController } from './controllers/types.controller';

@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: "https://192.168.13.116:9998",
      "ssl-required": "external",
      resource: 'portal-api',
      "verify-token-audience": true,
      realm: 'ipms-dev',
      clientId: 'portal-api',
      secret: "DStrv7hapnwEI6NzOYGT0dfCiN58a6OK",
      'confidential-port': 0
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '192.168.13.116',
      port: 5432,
      username: 'postgres',
      password: 'sistemas',
      database: 'georeferenciamento',
      entities: [Events, Types],
      synchronize: true,
    }),
    JwtModule,
    TypeOrmModule.forFeature([Events,Types]),
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    })
  ],
  controllers: [EventsController, TypesController],
 /*
 
  providers: [
    Events,
    // This adds a global level authentication guard,
    // you can also have it scoped
    // if you like.
    //
    // Will return a 401 unauthorized when it is unable to
    // verify the JWT token or Bearer header is missing.
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // This adds a global level resource guard, which is permissive.
    // Only controllers annotated with @Resource and 
    // methods with @Scopes
    // are handled by this guard.
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    // New in 1.1.0
    // This adds a global level role guard, which is permissive.
    // Used by `@Roles` decorator with the 
    // optional `@AllowAnyRole` decorator for allowing any
    // specified role passed.
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  */
  
})

export class AppModule {}