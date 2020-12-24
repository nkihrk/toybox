import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { ControllersModule } from '../controllers/controllers.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [EventsModule, ControllersModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
