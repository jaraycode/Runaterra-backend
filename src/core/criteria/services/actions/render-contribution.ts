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
import { getColumnWidthsTable, getCustomTableCellWidth } from "./width-utils";
import { ImageCellCreator } from "./image-cell-creator";
import FileClassificator from "./file-classificator";

interface DptoDetailed extends Dpto {
  contributionsOnCriteria: Contribution[];
}

@Injectable()
export class RenderContributions {
  constructor(private imageCellCreator: ImageCellCreator) {}

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

  async render(criteria: Criteria) {
    try {
      let paragraphArray = [];
      const departments = this.getProccessedDepartments(criteria.categories.contribution);

      console.log("===================>", departments);

      for (const department of departments) {
        paragraphArray.push(
          new Paragraph({
            text: `Departament ${[department.name]}`,
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.LEFT,
          }),
        );
        const result = await this.generateTables(department.contributionsOnCriteria);
        paragraphArray.push(...result);
      }

      return [...paragraphArray];
    } catch (error) {
      console.log(error);
    }
  }

  async generateTables(contributions: Contribution[]): Promise<Table[]> {
    const tables = [];

    for (const contribution of contributions) {
      const filesArchivosList = contribution.files.filter((file) => {
        return !FileClassificator.isImage(file);
      });
      const filesImagenesList = contribution.files.filter((file) => {
        return FileClassificator.isImage(file);
      });

      const resultPhotosMap = await this.getPhotosMap(filesImagenesList);

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
                        text: `Contribution #${contribution.id}`,
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
                        text: `Photos`,
                        color: "FFFFFF", // Texto blanco
                        bold: false, // Texto en negrita
                      }),
                    ],
                  }),
                ],
                shading: {
                  type: ShadingType.CLEAR,
                  color: "808080", // Verde bonito
                  fill: "808080", // Verde bonito
                },
                ...getCustomTableCellWidth(100),
              }),
            ],
          }),
          ...resultPhotosMap,
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
                        bold: false, // Texto en negrita
                      }),
                    ],
                  }),
                ],
                shading: {
                  type: ShadingType.CLEAR,
                  color: "808080", // Verde bonito
                  fill: "808080", // Verde bonito
                },
                ...getCustomTableCellWidth(50),
              }),
              new TableCell({
                columnSpan: 1,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Files`,
                        color: "FFFFFF", // Texto blanco
                        bold: false, // Texto en negrita
                      }),
                    ],
                  }),
                ],
                shading: {
                  type: ShadingType.CLEAR,
                  color: "808080", // Verde bonito
                  fill: "808080", // Verde bonito
                },
                ...getCustomTableCellWidth(50),
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [...getFlatMapLinks(contribution.link)],
                ...getCustomTableCellWidth(50),
                columnSpan: 1,
              }),
              new TableCell({
                children: [...getFlatMapFiles(filesArchivosList)],
                ...getCustomTableCellWidth(50),
                columnSpan: 1,
              }),
            ],
          }),
        ],
      });

      tables.push(table);
    }

    return tables;
  }

  async getPhotosMap(files: Files[]) {
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

    for (const pair of filesTwoPairs) {
      if (!pair.length) return;

      const photoCells = [];
      for (const photo of pair) {
        photoCells.push(await this.imageCellCreator.createImageCell(photo));
      }

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
    }

    return photoRows;
  }
}

function getFlatMapLinks(links: Link[]): Paragraph[] {
  if (!Array.isArray(links) || !links || !links.length) return [];

  return links.flatMap((link) => {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: link.URL,
            bold: false,
            style: "Hyperlink",
          }),
          new TextRun({
            text: `\n`,
          }),
          new TextRun({
            text: `${link.description}`,
          }),
        ],
        bullet: {
          level: 0,
        },
        indent: {
          left: 300, // Modify the left indent value here
        },
      }),
    ];
  });
}

function getFlatMapFiles(files: Files[]) {
  if (!Array.isArray(files) || !files || !files.length) return [];

  return files.flatMap((file) => {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: file.path,
            bold: false,
            style: "Hyperlink",
          }),
          new TextRun({
            text: `\n`,
          }),
          new TextRun({
            text: `${file.description}`,
          }),
        ],
        bullet: {
          level: 0,
        },
        indent: {
          left: 300, // Modify the left indent value here
        },
      }),
    ];
  });
}
