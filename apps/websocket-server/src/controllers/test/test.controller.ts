import { Controller, Get } from '@nestjs/common';

@Controller()
export class TestController {
	@Get('hoge')
	getHoge() {
		return { message: 'hoge' };
	}
}
