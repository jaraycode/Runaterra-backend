import { Injectable } from "@nestjs/common";
import { AlignmentType, Document, HeadingLevel, ImageRun, Packer, Paragraph, TextRun } from "docx";
import { RenderHeader } from "./render-header";
import { RenderContributions } from "./render-contribution";

@Injectable()
export class ExportDocxAction {
  constructor(
    private renderHeader: RenderHeader,
    private renderContributions: RenderContributions,
  ) {}

  async execute(criteriaId: number): Promise<Buffer> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [...this.renderHeader.render(), ...this.renderContributions.render()],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
  }
}
