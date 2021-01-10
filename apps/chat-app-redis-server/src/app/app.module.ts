import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewaysModule } from './gateways/gateways.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		GatewaysModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
