import { Controller, Get, Query, Headers } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';

@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get('generate')
  async generateRoot(@Query('topic') topic: string, @Headers('x-gemini-api-key') apiKey?: string) {
    return this.roadmapService.generateCoreRoadmap(topic, apiKey);
  }

  @Get('expand')
  async expandNode(@Query('topic') topic: string, @Query('node') node: string, @Headers('x-gemini-api-key') apiKey?: string) {
    return this.roadmapService.expandNode(topic, node, apiKey);
  }

  @Get('explain')
  async explainNode(@Query('path') path: string, @Headers('x-gemini-api-key') apiKey?: string) {
    return this.roadmapService.explainNode(path, apiKey);
  }
}
