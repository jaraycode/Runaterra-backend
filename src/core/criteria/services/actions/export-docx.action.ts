import { Injectable } from "@nestjs/common";
import {
  AlignmentType,
  Document,
  Header,
  HeadingLevel,
  HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  UnderlineType,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
  WidthType,
  convertInchesToTwip,
} from "docx";
import { RenderHeader } from "./render-header";
import { RenderContributions } from "./render-contribution";
import { Criteria } from "../../entities/criteria.entity";
import { COMPATIBILITY_GOOGLE_DOCS } from "./width-utils";
import * as fs from "fs";

@Injectable()
export class ExportDocxAction {
  constructor(
    private renderHeader: RenderHeader,
    private renderContributions: RenderContributions,
  ) {}

  async execute(criteria: Criteria): Promise<Buffer> {
    const sizeCorrector = COMPATIBILITY_GOOGLE_DOCS ? 2 : 1;

    const projectAbsolutePath = process.cwd() + "/src/images";
    console.log("projectAbsolutePath", projectAbsolutePath);

    const headerAllPages = new Header({
      children: [
        new Paragraph({
          children: [
            new ImageRun({
              data: fs.readFileSync(projectAbsolutePath + "/Ucab.png"),
              transformation: {
                width: 300,
                height: 43,
              },
              floating: {
                horizontalPosition: {
                  relative: HorizontalPositionRelativeFrom.MARGIN,
                  align: HorizontalPositionAlign.LEFT,
                },
                verticalPosition: {
                  relative: VerticalPositionRelativeFrom.TOP_MARGIN,
                  align: VerticalPositionAlign.BOTTOM,
                },
              },
            }),
            new ImageRun({
              data: fs.readFileSync(projectAbsolutePath + "/GM.png"),
              transformation: {
                width: 115,
                height: 85,
              },
              floating: {
                horizontalPosition: {
                  relative: HorizontalPositionRelativeFrom.MARGIN,
                  align: HorizontalPositionAlign.RIGHT,
                },
                verticalPosition: {
                  relative: VerticalPositionRelativeFrom.TOP_MARGIN,
                  align: VerticalPositionAlign.BOTTOM,
                },
              },
            }),
          ],
        }),
      ],
    });

    const result = await this.renderContributions.render(criteria);
    const doc = new Document({
      creator: "GreenieMetric",
      title: `Greenie Metric Report #${criteria.indicator.index}.${criteria.index} ${criteria.englishName}`,
      description: `Report Criteria #${criteria.index} ${criteria.name} from indicator #${criteria.indicator.index} ${criteria.indicator.name}`,
      styles: {
        default: {
          heading1: {
            run: {
              size: 17 * sizeCorrector,
              bold: true,
              color: "008800",
            },
            paragraph: {
              spacing: {
                after: 120,
              },
            },
          },
          heading2: {
            run: {
              size: 14 * sizeCorrector,
              bold: true,
            },
            paragraph: {
              spacing: {
                before: 190,
                after: 70,
              },
            },
          },
          heading3: {
            run: {
              size: 12 * sizeCorrector,
              bold: true,
              color: "006600",
            },
            paragraph: {
              spacing: {
                before: 160,
                after: 60,
              },
            },
          },
          heading4: {
            run: {
              size: 10 * sizeCorrector,
              bold: true,
              color: "004400",
            },
            paragraph: {
              spacing: {
                before: 120,
                after: 60,
              },
            },
          },
          heading5: {
            run: {
              size: 10 * sizeCorrector,
              bold: true,
              color: "669966",
            },
            paragraph: {
              spacing: {
                before: 120,
                after: 60,
              },
            },
          },
          document: {
            run: {
              size: 10 * sizeCorrector,
              font: "Calibri",
              color: "000000",
            },
            paragraph: {
              spacing: {
                line: 276,
              },
            },
          },
        },
        paragraphStyles: [
          {
            id: "textWrap",
            name: "Text Wrap",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
          },
        ],
        characterStyles: [],
      },
      sections: [
        {
          properties: {},
          children: [...this.renderHeader.render(criteria), ...result],
          headers: {
            default: headerAllPages,
          },
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
  }
}
