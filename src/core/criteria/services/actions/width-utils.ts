import { WidthType } from "docx";

const COMPATIBILITY_GOOGLE_DOCS = true;

export function getCustomTableCellWidth(amount: number = 100) {
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

export function getColumnWidthsTable() {
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
