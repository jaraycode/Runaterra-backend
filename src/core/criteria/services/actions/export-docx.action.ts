import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import { AlignmentType, Document, HeadingLevel, ImageRun, Packer, Paragraph, TextRun } from "docx";

@Injectable()
export class ExportDocxAction {
  constructor() {}

  async execute(criteriaId: number): Promise<Buffer> {
    const buildActivitiesParagraphs = () => {
      let paragraphArray = [];

      for (var i = 0; i < 1; i++) {
        paragraphArray.push(
          new Paragraph({
            text: "Departamento #" + i,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.LEFT,
          }),

          new Paragraph({
            text: "Aporte #" + i,
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.LEFT,
            style: "IntenseQuote",
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Descripción del aporte",
                bold: false,
                italics: true,
              }),
            ],
          }),

          new Paragraph({
            text: "Fotos",
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.LEFT,
            style: "IntenseQuote",
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "▢",
              }),
              new TextRun({
                text: "Descripción de la foto",
                bold: false,
                italics: true,
              }),
            ],
          }),

          new Paragraph({
            text: "Archivos",
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.LEFT,
            style: "IntenseQuote",
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "archivo.com",
                bold: false,
                style: "Hyperlink",
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Descripción del archivo",
                bold: false,
                italics: true,
              }),
            ],
          }),

          new Paragraph({
            text: "Links",
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.LEFT,
            style: "IntenseQuote",
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "link.com",
                bold: false,
                style: "Hyperlink",
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Descripción del link",
                bold: false,
                italics: true,
              }),
            ],
          }),
        );
      }

      return paragraphArray;
    };

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Indicador #",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: "Criterio #",
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
            ...buildActivitiesParagraphs(),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
  }
}
