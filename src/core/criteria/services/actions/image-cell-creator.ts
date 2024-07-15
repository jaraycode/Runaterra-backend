import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { TableCell, Paragraph, TextRun, ImageRun, WidthType, AlignmentType } from "docx";
import { getCustomTableCellWidth } from "./width-utils";
import { Files } from "@src/core/files/entities/file.entity";

@Injectable()
export class ImageCellCreator {
  constructor(private readonly httpService: HttpService) {}

  async getImageBufferFromUrl(url: string): Promise<Buffer | null> {
    try {
      const response = await lastValueFrom(this.httpService.get(url, { responseType: "arraybuffer" }));
      return Buffer.from(response.data, "binary");
    } catch {
      return null;
    }
  }

  private getImageOrError(imageBuffer: Buffer | null): Paragraph {
    if (imageBuffer) {
      return new Paragraph({
        children: [
          new ImageRun({
            data: imageBuffer,
            transformation: {
              width: 225, // Ajusta el tamaño de la imagen según sea necesario
              height: 225,
            },
          }),
        ],
        alignment: AlignmentType.CENTER,
      });
    }

    return new Paragraph({
      children: [new TextRun({ text: "[Error al cargar la imagen]" })],
      alignment: AlignmentType.CENTER,
    });
  }

  async createImageCell(photo: Files): Promise<TableCell> {
    const imageBuffer = await this.getImageBufferFromUrl(photo.path);

    const imageCell = new TableCell({
      children: [
        this.getImageOrError(imageBuffer),
        new Paragraph({
          children: [
            new TextRun({
              text: photo.description,
            }),
          ],
        }),
      ],
      columnSpan: 1,
      ...getCustomTableCellWidth(50),
      /*margins: { top: 100, bottom: 100, left: 100, right: 100 },*/
    });

    return imageCell;
  }
}
