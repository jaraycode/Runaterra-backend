import { Injectable } from "@nestjs/common";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  UnderlineType,
  WidthType,
  convertInchesToTwip,
} from "docx";
import { RenderHeader } from "./render-header";
import { RenderContributions } from "./render-contribution";
import { Criteria } from "../../entities/criteria.entity";

@Injectable()
export class ExportDocxAction {
  constructor(
    private renderHeader: RenderHeader,
    private renderContributions: RenderContributions,
  ) {}

  async executeOld(criteria: Criteria): Promise<Buffer> {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1),
                right: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1),
              },
            },
          },
          children: [
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Cell 1")],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph("Cell 2")],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
  }

  async execute(criteria: Criteria): Promise<Buffer> {
    const result = await this.renderContributions.render(criteria);
    const doc = new Document({
      creator: "GreenieMetric",
      title: `Greenie Metric - Report #${criteria.indicator.index}.${criteria.index} ${criteria.englishName}`,
      description: `Reporte del criterio #${criteria.index} ${criteria.name} del indicador #${criteria.indicator.index} ${criteria.indicator.name}`,
      styles: {
        default: {
          heading1: {
            run: {
              size: 32,
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
              size: 26,
              bold: true,
              underline: {
                type: UnderlineType.SINGLE,
                color: "000000",
              },
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120,
              },
            },
          },
          heading3: {
            run: {
              size: 24,
              bold: true,
              color: "006600",
            },
            paragraph: {
              spacing: {
                before: 200,
                after: 100,
              },
            },
          },
          heading4: {
            run: {
              size: 20,
              bold: true,
              color: "004400",
            },
            paragraph: {
              spacing: {
                before: 160,
                after: 80,
              },
            },
          },
          heading5: {
            run: {
              size: 16,
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
              size: 16,
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
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
  }
}
