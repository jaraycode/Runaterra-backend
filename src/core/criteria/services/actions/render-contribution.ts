import { Injectable } from "@nestjs/common";
import { AlignmentType, HeadingLevel, Paragraph, TextRun } from "docx";
import { Criteria } from "../../entities/criteria.entity";

@Injectable()
export class RenderContributions {
  constructor() {}

  render(criteria: Criteria) {
    try {
      let paragraphArray = [];
      const processedDepartments = new Set<string>();

      for (var i = 0; i < criteria.categories.contribution.length; i++) {
        const departmentName = criteria.categories.contribution[i].user.department.name;

        if (!processedDepartments.has(departmentName)) {
          processedDepartments.add(departmentName);

          paragraphArray.push(
            new Paragraph({
              text: `Departamento #${i + 1}: ${departmentName}`,
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.LEFT,
            }),
          );
          paragraphArray.push(
            new Paragraph({
              text: `Aporte #${i + 1}:`,
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
          );
          criteria.categories.contribution[i].files.forEach((file) => {
            paragraphArray.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: file.path,
                    bold: false,
                    style: "Hyperlink",
                  }),
                ],
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: file.description,
                    bold: false,
                    italics: true,
                  }),
                ],
              }),
            );
          });
        }
        paragraphArray.push(
          new Paragraph({
            text: "Links",
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.LEFT,
            style: "IntenseQuote",
          }),
        );

        let links = criteria.categories.contribution[i].link;
        if (!Array.isArray(links)) {
          links = [links];
        }

        links.forEach((link) => {
          paragraphArray.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: link.URL,
                  bold: false,
                  style: "Hyperlink",
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: link.description,
                  bold: false,
                  italics: true,
                }),
              ],
            }),
          );
        });
      }

      return paragraphArray;
    } catch (error) {
      console.log(error);
    }
  }
}
