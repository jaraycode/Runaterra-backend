import { Injectable } from "@nestjs/common";
import { AlignmentType, HeadingLevel, Paragraph, TextRun } from "docx";
import { Criteria } from "../../entities/criteria.entity";
import { Contribution } from "@src/core/contributions/entities/contribution.entity";
import { Dpto } from "@src/core/dptos/entities/dpto.entity";

interface DptoDetailed extends Dpto {
  contributionsOnCriteria: Contribution[];
}

@Injectable()
export class RenderContributions {
  constructor() {}

  private getProccessedDepartments(contributions: Contribution[]): DptoDetailed[] {
    const departments: DptoDetailed[] = [];

    contributions.forEach((contribution: Contribution) => {
      const dptoContributionId = contribution.user.department.id;
      const dptoExists = departments.find((dpto) => dpto.id === dptoContributionId);

      if (!dptoExists) {
        departments.push({
          ...contribution.user.department,
          contributionsOnCriteria: [contribution],
        });
      } else {
        dptoExists.contributionsOnCriteria.push(contribution);
      }
    });

    return departments;
  }

  render(criteria: Criteria) {
    try {
      let paragraphArray = [];
      const departments = this.getProccessedDepartments(criteria.categories.contribution);

      departments.forEach((department) => {
        paragraphArray.push(
          new Paragraph({
            text: `Departamento ${[department]}`,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.LEFT,
          }),
        );

        for (const contribution of department.contributionsOnCriteria) {
          // Aporte
          paragraphArray.push(
            new Paragraph({
              text: `Aporte #${contribution.id}:`,
              heading: HeadingLevel.HEADING_3,
              alignment: AlignmentType.LEFT,
              style: "IntenseQuote",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: contribution.description,
                  bold: false,
                  italics: true,
                }),
              ],
            }),
          );

          // Fotos
          paragraphArray.push(
            new Paragraph({
              text: "Fotos",
              heading: HeadingLevel.HEADING_4,
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
          );

          // Archivos
          paragraphArray.push(
            new Paragraph({
              text: "Archivos",
              heading: HeadingLevel.HEADING_4,
              alignment: AlignmentType.LEFT,
              style: "IntenseQuote",
            }),
          );
          contribution.files.forEach((file) => {
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

          // Links
          paragraphArray.push(
            new Paragraph({
              text: "Links",
              heading: HeadingLevel.HEADING_4,
              alignment: AlignmentType.LEFT,
              style: "IntenseQuote",
            }),
          );

          let links = contribution.link;
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
      });

      return paragraphArray;
    } catch (error) {
      console.log(error);
    }
  }
}
