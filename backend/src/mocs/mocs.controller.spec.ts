import { Test, TestingModule } from '@nestjs/testing';
import { MocsController } from './mocs.controller';

describe('MocsController', () => {
  let controller: MocsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MocsController],
    }).compile();

    controller = module.get<MocsController>(MocsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
