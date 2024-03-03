import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GroupService } from './group.service';

@ApiTags('groups')
@Controller('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @ApiOkResponse()
  @Get()
  async getGroup() {
    return this.groupService.getGroup();
  }

  @ApiOkResponse()
  @Get(':id/members')
  async getMember(@Param('id') id: number) {
    return this.groupService.getMember(id);
  }

  @Post(':id/members')
  async createGroup() {
    return this.groupService.createGroup();
  }

  @Delete(':id/members/:memberId')
  async deleteGroup(
    @Param('id') id: number,
    @Param('memberId') memberId: number,
  ) {
    return this.groupService.deleteGroup(id, memberId);
  }
}
