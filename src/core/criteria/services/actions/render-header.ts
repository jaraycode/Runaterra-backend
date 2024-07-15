import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AlignmentType, HeadingLevel, Paragraph, TextRun } from "docx";
import { Criteria } from "../../entities/criteria.entity";
import { Repository } from "typeorm/repository/Repository";
import { COMPATIBILITY_GOOGLE_DOCS } from "./width-utils";

@Injectable()
export class RenderHeader {
  constructor() {}

  render(criteria: Criteria) {
    const sizeCorrector = COMPATIBILITY_GOOGLE_DOCS ? 2 : 1;

    return [
      new Paragraph({
        text: "Greenie Metric Template",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({}),
      new Paragraph({
        children: [
          new TextRun({
            text: "University: Andrés Bello Guayana Catholic University",
            size: 12 * sizeCorrector,
            font: "Calibri",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Country: Venezuela",
            size: 12 * sizeCorrector,
            font: "Calibri",
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Web Address: http://guayanaweb.ucab.edu.ve/",
            size: 12 * sizeCorrector,
            font: "Calibri",
          }),
        ],
      }),
      new Paragraph({}),
      new Paragraph({
        text: "[" + criteria.indicator.index + "]" + criteria.indicator.englishName,
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
      }),
      new Paragraph({
        text: "[" + criteria.indicator.index + "." + criteria.index + "]" + criteria.englishName,
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
      }),
    ];
  }
}
