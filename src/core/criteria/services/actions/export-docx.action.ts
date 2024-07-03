import { Injectable } from "@nestjs/common";
import { AlignmentType, Document, HeadingLevel, ImageRun, Packer, Paragraph, TextRun } from "docx";
import { RenderHeader } from "./render-header";
import { RenderContributions } from "./render-contribution";
import { Criteria } from "../../entities/criteria.entity";

@Injectable()
export class ExportDocxAction {
  constructor(
    private renderHeader: RenderHeader,
    private renderContributions: RenderContributions,
  ) {}

  async execute(criteria: Criteria): Promise<Buffer> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [...this.renderHeader.render(criteria), ...this.renderContributions.render(criteria)],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
  }
}
