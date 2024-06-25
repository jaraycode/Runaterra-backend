import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import { Document, Packer, Paragraph, TextRun } from "docx";

@Injectable()
export class ExportDocxAction {
  constructor() {}

  async execute(criteriaId: number): Promise<Buffer> {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun("Hello World"),
                            new TextRun({
                                text: "Foo Bar",
                                bold: true,
                            }),
                            new TextRun({
                                text: "\tGithub is the best",
                                bold: true,
                            }),
                        ],
                    }),
                ],
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;

    // Used to export the file into a .docx file
    /*Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync(`criterio-greenie-panel-${criteriaId}.docx`, buffer);
    });*/
  }
}



