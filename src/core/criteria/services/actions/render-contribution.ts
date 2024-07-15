import { Injectable } from "@nestjs/common";
import {
  AlignmentType,
  HeadingLevel,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { Criteria } from "../../entities/criteria.entity";
import { Contribution } from "@src/core/contributions/entities/contribution.entity";
import { Dpto } from "@src/core/dptos/entities/dpto.entity";
import { Files } from "@src/core/files/entities/file.entity";
import { Link } from "@src/core/contributions/entities/link.entity";

const COMPATIBILITY_GOOGLE_DOCS = true;

function getCustomTableCellWidth(amount: number = 100) {
  const percentageAmount = amount / 100;

  if (COMPATIBILITY_GOOGLE_DOCS)
    return {
      width: {
        size: 4505 * percentageAmount,
        type: WidthType.DXA,
      },
    };

  return {
    width: {
      size: 100 * percentageAmount,
      type: WidthType.PERCENTAGE,
    },
  };
}

function getColumnWidthsTable() {
  if (COMPATIBILITY_GOOGLE_DOCS) {
    return { columnWidths: [4505, 4505] };
  }
  return {
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  };
}

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
            text: `Departamento ${[department.name]}`,
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.LEFT,
          }),
        );

        paragraphArray.push(...generateTables(department.contributionsOnCriteria));
      });

      return [...paragraphArray];
    } catch (error) {
      console.log(error);
    }
  }
}

function generateTables(contributions: Contribution[]): Table[] {
  const tables = [];

  contributions.forEach((contribution) => {
    const table = new Table({
      ...getColumnWidthsTable(),
      rows: [
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Aporte #${contribution.id}`,
                      color: "FFFFFF", // Texto blanco
                      bold: true, // Texto en negrita
                    }),
                  ],
                  heading: HeadingLevel.HEADING_4,
                  alignment: AlignmentType.CENTER,
                }),
              ],
              shading: {
                type: ShadingType.CLEAR,
                color: "00FF00", // Verde bonito
                fill: "008040", // Verde bonito más opaco
              },
              ...getCustomTableCellWidth(100),
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [new Paragraph(contribution.description)],
              ...getCustomTableCellWidth(100),
            }),
          ],
        }),

        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Fotos`,
                      color: "FFFFFF", // Texto blanco
                      bold: true, // Texto en negrita
                    }),
                  ],
                }),
              ],
              shading: {
                type: ShadingType.CLEAR,
                color: "00FF00", // Verde bonito
                fill: "00B050", // Verde bonito
              },
              ...getCustomTableCellWidth(100),
            }),
          ],
        }),
        ...getPhotosMap(contribution.files),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 1,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Links`,
                      color: "FFFFFF", // Texto blanco
                      bold: true, // Texto en negrita
                    }),
                  ],
                }),
              ],
              shading: {
                type: ShadingType.CLEAR,
                color: "00FF00", // Verde bonito
                fill: "00B050", // Verde bonito
              },
              ...getCustomTableCellWidth(50),
            }),
            new TableCell({
              columnSpan: 1,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Archivos`,
                      color: "FFFFFF", // Texto blanco
                      bold: true, // Texto en negrita
                    }),
                  ],
                }),
              ],
              shading: {
                type: ShadingType.CLEAR,
                color: "00FF00", // Verde bonito
                fill: "00B050", // Verde bonito
              },
              ...getCustomTableCellWidth(50),
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: getFlatMapLinks(contribution.link),
                }),
              ],
              ...getCustomTableCellWidth(50),
              columnSpan: 1,
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: getFlatMapFiles(contribution.files),
                }),
              ],
              ...getCustomTableCellWidth(50),
              columnSpan: 1,
            }),
          ],
        }),
      ],
    });

    tables.push(table);
  });

  return tables;
}

function getPhotosMap(files: Files[]) {
  if (!Array.isArray(files) || !files || !files.length)
    return [
      new TableRow({
        children: [
          new TableCell({
            children: [],
            ...getCustomTableCellWidth(100),
          }),
        ],
      }),
    ];

  // Divide el arreglo de files en varios arreglos de 2
  const filesTwoPairs: Files[][] = files.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 2);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  const photoRows = [];

  filesTwoPairs.forEach((pair) => {
    if (!pair.length) return;

    const photoCells = [];
    pair.forEach((photo) => {
      photoCells.push(
        new TableCell({
          columnSpan: 1,
          children: [new Paragraph(photo.description)],
          ...getCustomTableCellWidth(50),
        }),
      );
    });

    // Si habia una sola foto, añade otro espacio vacio pa rellenar
    if (photoCells.length <= 1) {
      photoCells.push(
        new TableCell({
          columnSpan: 1,
          children: [],
          ...getCustomTableCellWidth(50),
        }),
      );
    }

    photoRows.push(
      new TableRow({
        children: photoCells,
      }),
    );
  });

  return photoRows;
}

function getFlatMapLinks(links: Link[]) {
  if (!Array.isArray(links) || !links || !links.length) return [];

  return links.flatMap((link) => {
    return [
      new TextRun({
        text: `- ${link.description} (${link.URL})`,
        break: 1,
        style: "textWrap",
      }),
      new TextRun({
        text: link.URL,
        bold: false,
        style: "Hyperlink",
        break: 1,
      }),
    ];
  });
}

function getFlatMapFiles(files: Files[]) {
  if (!Array.isArray(files) || !files || !files.length) return [];

  return files.flatMap((file) => {
    return [
      new TextRun({
        text: `- ${file.description} (${file.path})`,
        break: 1,
        style: "textWrap",
      }),
      new TextRun({
        text: file.path,
        bold: false,
        style: "Hyperlink",
        break: 1,
      }),
    ];
  });
}
