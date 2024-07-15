import { Injectable } from "@nestjs/common";
import { AlignmentType, HeadingLevel, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import { Criteria } from "../../entities/criteria.entity";
import { Contribution } from "@src/core/contributions/entities/contribution.entity";
import { Dpto } from "@src/core/dptos/entities/dpto.entity";

interface DptoDetailed extends Dpto {
  contributionsOnCriteria: Contribution[];
}

// Ejemplo de uso
const contributions: ContributionR[] = [
  {
    indice: "1.1",
    resumen: "Descripción del aporte #1",
    fotos: [
      { descripcion: "Foto 1", path: "path/to/foto1.jpg" },
      { descripcion: "Foto 2", path: "path/to/foto2.jpg" },
    ],
    archivos: [
      { nombre: "Archivo 1", link: "link/to/archivo1" },
      { nombre: "Archivo 2", link: "link/to/archivo2" },
    ],
    links: [
      { nombre: "Link 1", url: "http://link1.com" },
      { nombre: "Link 2", url: "http://link2.com" },
    ],
  },
  {
    indice: "2",
    resumen: "Descripción del aporte #2",
    fotos: [],
    archivos: [],
    links: [],
  },
];

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
            text: `Departamento ${[department.name]}`,
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.LEFT,
          }),
        );

        for (const contribution of department.contributionsOnCriteria) {
          // Aporte
          paragraphArray.push(
            new Paragraph({
              text: `Aporte #${contribution.id}:`,
              heading: HeadingLevel.HEADING_4,
              alignment: AlignmentType.LEFT,
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
              heading: HeadingLevel.HEADING_5,
              alignment: AlignmentType.LEFT,
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
              heading: HeadingLevel.HEADING_5,
              alignment: AlignmentType.LEFT,
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
              heading: HeadingLevel.HEADING_5,
              alignment: AlignmentType.LEFT,
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

interface ContributionR {
  indice: string;
  resumen: string;
  fotos: { descripcion: string; path: string }[];
  archivos: { nombre: string; link: string }[];
  links: { nombre: string; url: string }[];
}

function generateDocument(contributions: ContributionR[]) {
  const tables = [];

  contributions.forEach((contribution) => {
    const table = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(`Aporte #${contribution.indice}`)],
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(contribution.resumen)],
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Fotos")],
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        ...contribution.fotos.map(
          (foto) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph(foto.descripcion)],
                  width: { size: 100, type: WidthType.PERCENTAGE },
                }),
              ],
            }),
        ),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph("Links"),
                new Paragraph(contribution.links.map((link) => `- ${link.nombre} (${link.url})`).join("\n")),
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph("Archivos"),
                new Paragraph(
                  contribution.archivos.map((archivo) => `- ${archivo.nombre} (${archivo.link})`).join("\n"),
                ),
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
      ],
    });

    tables.push(table);
  });

  return tables;
}

//generateDocument(contributions);
