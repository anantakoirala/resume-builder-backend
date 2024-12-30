import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { HttpService } from '@nestjs/axios';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ResumeData,
  defaultResumeData,
} from 'src/auth/utils/schema/resumeSchema';
import { kebabCase } from 'src/auth/utils/string';
import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import * as fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { Prisma } from '@prisma/client';
import { getFontUrl } from 'src/auth/utils/getFonts';
const merge = require('deepmerge');
const fontkit = require('@pdf-lib/fontkit');

@Injectable()
export class ResumeService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}
  async create(createResumeDto: CreateResumeDto, userId: any) {
    const { name, email, picture } = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { name: true, email: true, picture: true },
    });

    const data = merge(defaultResumeData, {
      basics: { name, email, picture: { url: picture ?? '' } },
    });

    const resume = await this.prisma.resume.create({
      data: {
        data,
        userId,
        title: createResumeDto.title,
        visibility: createResumeDto.visibility,
        slug: createResumeDto.slug ?? kebabCase(createResumeDto.title),
      },
    });

    console.log(data);

    //console.log(defaultResumeData);
    return resume;
  }

  async findAll(userId: string) {
    console.log('userId', userId);
    const resumes = this.prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return resumes;
  }

  async findOne(id: string, userId: string) {
    const resume = this.prisma.resume.findUniqueOrThrow({
      where: { userId_id: { userId, id } },
    });
    return resume;
  }

  async update(id: string, userId: string, updateResumeDto: UpdateResumeDto) {
    try {
      const resume = await this.prisma.resume.update({
        data: {
          title: updateResumeDto.title,
          slug: updateResumeDto.slug,
          data: updateResumeDto.data,
        },
        where: { userId_id: { userId, id } },
      });

      // Handle the retrieved resume object
      return resume;
    } catch (error) {
      console.log('error messagse', error.message);
      // Handle the error if the resume is not found or if there's any other issue
      console.error('Error retrieving resume:', error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} resume`;
  }

  async print(id: string, req: any) {
    try {
      const resume = await this.prisma.resume.findUniqueOrThrow({
        where: { id: id },
      });

      // Accessing the entire JSON object stored in the `data` field
      const resumeData = resume.data as ResumeData;
      console.log(resumeData.metadata);
      const templatefontUrl = getFontUrl(resumeData.metadata.font);
      // Accessing a specific property inside the `data` JSON object
      //const metadata = resumeData.metadata;
      const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
      });

      const page = await browser.newPage();

      // Manually set the HTTP-only cookie
      await page.setCookie({
        name: 'Authentication',
        value: req.cookies['Authentication'],
        domain: 'localhost',
        path: '/',
        httpOnly: true,
      });

      // Navigate the page to the specific URL with the ID
      await page.goto(`http://localhost:3000/preview/${id}`, {
        waitUntil: 'networkidle2',
      });

      // Wait for the template to be rendered on the page
      const resss = await page.$(`#template`);

      const width =
        (await (await resss?.getProperty('scrollWidth'))?.jsonValue()) ?? 0;
      const height =
        (await (await resss?.getProperty('scrollHeight'))?.jsonValue()) ?? 0;

      const pagesBuffer: Buffer[] = [];
      console.log('width', width);
      pagesBuffer.push(
        await page.pdf({ width, height, printBackground: true }),
      );

      const PDFdoc = await PDFDocument.create();
      PDFdoc.registerFontkit(fontkit);

      const response = await this.httpService.axiosRef.get(templatefontUrl);

      const fontUrlMatches = response.data.match(/url\((.*?)\)/);
      if (!fontUrlMatches || fontUrlMatches.length < 2) {
        throw new Error('Font URL not found in CSS file');
      }
      const fontUrl = fontUrlMatches[1].replace(/['"]/g, '');
      console.log(fontUrl);
      const fontResponse = await this.httpService.axiosRef.get(fontUrl, {
        responseType: 'arraybuffer',
      });

      await PDFdoc.embedFont(fontResponse.data);

      //Get information about fonts used in the resume from the metadata

      for (let index = 0; index < pagesBuffer.length; index++) {
        const loadedPage = await PDFDocument.load(pagesBuffer[index]);
        loadedPage.registerFontkit(fontkit);
        await loadedPage.embedFont(fontResponse.data);
        //console.log('llll', loadedPage);
        const copiedPage = await PDFdoc.copyPages(loadedPage, [0]);
        PDFdoc.addPage(copiedPage[0]);
      }

      await writeFileSync(`src/assets/${id}.pdf`, await PDFdoc.save());

      await page.close();
      await browser.close();

      return 'success';
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        'An error occurred while fetching the transactions',
      );
    }
  }

  async test() {
    // try {
    //   const pdfDoc = await PDFDocument.create();
    //   pdfDoc.registerFontkit(fontkit);

    //   // Make the Axios request to fetch the font CSS file
    //   const response = await this.httpService.axiosRef.get(
    //     'https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
    //   );

    //   // Extract the font URL from the CSS file
    //   const fontUrlMatches = response.data.match(/url\((.*?)\)/);
    //   if (!fontUrlMatches || fontUrlMatches.length < 2) {
    //     throw new Error('Font URL not found in CSS file');
    //   }
    //   const fontUrl = fontUrlMatches[1].replace(/['"]/g, '');
    //   console.log('fonturl', fontUrl);
    //   // Make another Axios request to fetch the font file
    //   const fontResponse = await this.httpService.axiosRef.get(fontUrl, {
    //     responseType: 'arraybuffer',
    //   });

    //   // Embed the font into the PDF document
    //   const customFont = await pdfDoc.embedFont(fontResponse.data);

    //   const page = pdfDoc.addPage();
    //   page.drawText('You can create PDFs!', {
    //     font: customFont,
    //     size: 24,
    //     x: 50,
    //     y: 500,
    //   });

    //   const pdfBytes = await pdfDoc.save();
    //   await writeFileSync(`src/assets/new.pdf`, pdfBytes);

    //   return 'hello';
    // } catch (error) {
    //   console.error('Error in test:', error);
    //   // Handle errors appropriately
    //   throw error;
    // }
    try {
      // Load all the fonts from the URLs using HttpService
      // const responses = await Promise.all(
      //   fontUrls.map((url) =>
      //     this.httpService.axiosRef.get(url, {
      //       responseType: 'arraybuffer',
      //     }),
      //   ),
      // );
      // const fontsBuffer = responses.map(
      //   (response) => response.data as ArrayBuffer,
      // );
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();

      // HTML content to be converted to PDF
      const htmlContent = `
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>HTML 5 Boilerplate</title>
          </head>
          <body>
            <p>ananta</p>
          </body>
        </html>
      `;

      // Draw HTML content onto the PDF page
      await page.drawText(htmlContent, {
        x: 50,
        y: 700,
        font: await pdfDoc.embedFont('Helvetica'), // Embed default font
      });

      // Save the PDF to a file
      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync('output.pdf', pdfBytes);

      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
}
