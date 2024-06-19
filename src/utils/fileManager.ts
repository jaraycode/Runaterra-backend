import * as fse from "fs-extra";

export const deleteFile = async (path, filename) => {
  try {
    await fse.remove(path);
    console.log(`${filename} file deleted!`);
  } catch (err) {
    console.log(err);
  }
};
