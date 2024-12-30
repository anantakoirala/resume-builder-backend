import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { User } from 'src/users/decorators/user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Request, Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@User() user: any, @Body() createResumeDto: CreateResumeDto) {
    return this.resumeService.create(createResumeDto, user.id);
  }

  @Get('test')
  @UseGuards(JwtGuard)
  test() {
    return this.resumeService.test();
  }

  @Get()
  @UseGuards(JwtGuard)
  findAll(@User() user: any) {
    console.log('findall resumes');
    return this.resumeService.findAll(user.id);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: string, @User() user: any) {
    return this.resumeService.findOne(id, user.id);
  }
  // @Get('print/:id')
  // async print(
  //   @Param('id') id: string,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ): Promise<void> {
  //   const response = await this.resumeService.print(id, req);
  //   res.set({
  //     // pdf
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': 'attachment; filename=invoice.pdf',
  //   });

  //   res.send(response);
  // }

  @Get('print/:id')
  async print(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.resumeService.print(id, req);
    const filePath = join(process.cwd(), 'src', 'assets', `${id}.pdf`);
    const fileName = `${id}.pdf`;
    if (fs.existsSync(filePath)) {
      res.setHeader('Access-Control-Expose-Headers', 'X-Suggested-Filename');
      res.setHeader('X-Suggested-Filename', fileName);
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );

      // Send the file as a response using the correct filePath
      res.sendFile(filePath); // Use the same filePath variable here
    } else {
      // If the file doesn't exist, send a JSON response
      res.status(404).json({ message: 'File not found' });
    }
    return 'hello';
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(
    @User() user: any,
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    return this.resumeService.update(id, user.id, updateResumeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumeService.remove(+id);
  }
}
