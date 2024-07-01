import { Injectable } from "@nestjs/common";
import { AlignmentType, HeadingLevel, ImageRun, Paragraph, TextRun } from "docx";

@Injectable()
export class RenderContributions {
  constructor() {}

  render() {
    let paragraphArray = [];

    for (var i = 1; i < 2; i++) {
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
  }
}
