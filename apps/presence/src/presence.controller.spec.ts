import { Test, TestingModule } from '@nestjs/testing';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';

describe('PresenceController', () => {
  let presenceController: PresenceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PresenceController],
      providers: [PresenceService],
    }).compile();

    presenceController = app.get<PresenceController>(PresenceController);
  });
});
