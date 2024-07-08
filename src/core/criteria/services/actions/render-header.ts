import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AlignmentType, HeadingLevel, Paragraph } from "docx";
import { Criteria } from "../../entities/criteria.entity";
import { Repository } from "typeorm/repository/Repository";

@Injectable()
export class RenderHeader {
  constructor() {}

  render(criteria: Criteria) {
    return [
      new Paragraph({
        text: "Indicador #" + criteria.indicator.index + " " + criteria.indicator.name,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: "Criterio #" + criteria.index + " " + criteria.name,
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
      }),
    ];
  }
}
