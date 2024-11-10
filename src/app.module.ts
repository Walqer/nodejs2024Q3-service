import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { ErrorHandlerService } from './common/error-handler.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [UserModule, ArtistModule],
  controllers: [AppController],
  providers: [
    AppService,
    ErrorHandlerService,
    {
      provide: APP_FILTER, // Регистрируем фильтр на уровне всего приложения
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
