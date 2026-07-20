import { Controller, Get, Query } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';

@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get('generate')
  async generateRoot(@Query('topic') topic: string) {
    return this.roadmapService.generateCoreRoadmap(topic);
  }

  @Get('expand')
  async expandNode(@Query('topic') topic: string, @Query('node') node: string) {
    return this.roadmapService.expandNode(topic, node);
  }

  @Get('explain')
  async explainNode(@Query('path') path: string) {
    return this.roadmapService.explainNode(path);
  }
}
