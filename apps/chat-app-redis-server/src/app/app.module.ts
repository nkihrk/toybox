import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewaysModule } from './gateways/gateways.module';

@Module({
	imports: [GatewaysModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
