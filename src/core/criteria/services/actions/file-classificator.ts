import { Files } from "@src/core/files/entities/file.entity";

const compatibleImageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp"];
const compatibleExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
const notAImageMimeTypes = [
  "application/pdf", // PDF
  "application/msword", // Word 97-2003
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word
  "application/vnd.ms-excel", // Excel 97-2003
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel
  "text/plain", // TXT
  "application/zip", // ZIP
  "application/x-zip-compressed", // ZIP (antiguo)
  "application/vnd.ms-powerpoint", // PowerPoint 97-2003
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PowerPoint
  "application/rtf", // RTF
  "application/json", // JSON
  "application/xml", // XML
  "text/csv", // CSV
  "application/x-www-form-urlencoded", // Form data
  "application/octet-stream", // Binario genérico
  "text/html", // HTML
  "text/css", // CSS
  "application/javascript", // JavaScript
  "application/vnd.google-apps.document", // Google Docs
  "application/vnd.google-apps.spreadsheet", // Google Sheets
  "application/vnd.google-apps.presentation", // Google Slides
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow", // PowerPoint Slideshow
  "application/vnd.oasis.opendocument.text", // OpenDocument Text
  "application/vnd.oasis.opendocument.spreadsheet", // OpenDocument Spreadsheet
  "application/vnd.oasis.opendocument.presentation", // OpenDocument Presentation
  "application/vnd.ms-publisher", // Microsoft Publisher
  "application/x-tar", // TAR
  "application/x-gzip", // GZIP
  "application/vnd.android.package-archive", // APK
  "application/x-sh", // Shell script
  "application/x-7z-compressed", // 7Z
];

export default class FileClassificator {
  static isImage(file: Files) {
    if (notAImageMimeTypes.includes(file.type) || notAImageMimeTypes.includes(file.type.toLocaleLowerCase()))
      return false;

    if (
      compatibleImageMimeTypes.includes(file.type) ||
      compatibleImageMimeTypes.includes(file.type.toLocaleLowerCase())
    )
      return true;

    const fileFullName = file.path;
    const fileExtension = fileFullName.split(".").pop();

    if (compatibleExtensions.includes(fileExtension)) return true;

    return false;
  }
}
