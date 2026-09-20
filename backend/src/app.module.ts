import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { SwapsModule } from './swaps/swaps.module';
import { InitiativesModule } from './initiatives/initiatives.module';
import { RatingsModule } from './ratings/ratings.module';
import { AlertsModule } from './alerts/alerts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { TicketsModule } from './tickets/tickets.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PostsModule,
    SwapsModule,
    InitiativesModule,
    RatingsModule,
    AlertsModule,
    NotificationsModule,
    UsersModule,
    AdminModule,
    TicketsModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
