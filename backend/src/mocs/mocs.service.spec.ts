import { Test, TestingModule } from '@nestjs/testing';
import { MocsService } from './mocs.service';

describe('MocsService', () => {
  let service: MocsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MocsService],
    }).compile();

    service = module.get<MocsService>(MocsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
