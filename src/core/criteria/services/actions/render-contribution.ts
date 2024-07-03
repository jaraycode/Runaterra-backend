import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "@src/core/categories/entities/category.entity";
import { CategoriesService } from "@src/core/categories/services/categories.service";
import { AlignmentType, HeadingLevel, ImageRun, Paragraph, TextRun } from "docx";
import { Repository } from "typeorm/repository/Repository";
import { Criteria } from "../../entities/criteria.entity";

@Injectable()
export class RenderContributions {
  constructor() {}

  render(criteria: Criteria) {
    let paragraphArray = [];

    console.log(criteria);
    for (var i = 1; i < criteria.categories.contribution.length; i++) {
      paragraphArray.push(
        new Paragraph({
          text: "Departamento #" + i + ":" + criteria.categories.contribution[i].user.department.name,
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
              text: criteria.categories.contribution[i].description,
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
