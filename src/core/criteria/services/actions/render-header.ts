import { Injectable } from "@nestjs/common";
import { AlignmentType, HeadingLevel, Paragraph } from "docx";

@Injectable()
export class RenderHeader {
  constructor() {}

  render() {
    return [
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
    ];
  }
}
