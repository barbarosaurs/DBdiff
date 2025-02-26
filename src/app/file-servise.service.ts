import { inject, Injectable } from "@angular/core";
import {
  mkdir,
  create,
  BaseDirectory,
  exists,
  readDir,
  stat,
  readFile,
  remove,
  writeFile,
} from "@tauri-apps/plugin-fs";
import { appDataDir } from "@tauri-apps/api/path";
import { AppData, File } from "./app.data";

@Injectable({
  providedIn: "root",
})
export class FileServiseService {
  appData = inject(AppData);

  constructor() {
    this.filesUtils();
  }

  path = "";
  async filesUtils() {
    this.path = await appDataDir();
    if (!(await exists(`${await appDataDir()}/diff`))) {
      await mkdir("diff", { baseDir: BaseDirectory.AppData, recursive: true });
    }
    await this.creatScript();
  }

  private getCurrentTimeStamp() {
    const today = new Date();

    let day = today.getDate();
    let month = today.getMonth() + 1;
    const year = today.getFullYear();

    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    if (day < 10) day = +"0" + day;
    if (month < 10) month = +"0" + month;
    if (hours < 10) hours = +"0" + hours;
    if (minutes < 10) minutes = +"0" + minutes;
    if (seconds < 10) seconds = +"0" + seconds;

    const formattedDateTime = `${day}.${month}.${year}-${hours}.${minutes}.${seconds}`;
    return formattedDateTime;
  }

  async addDiff(diff: string) {
    const timeStamp = this.getCurrentTimeStamp();
    const file = await create(
      `${this.appData.diffFoldrName}\\diff-${timeStamp}.txt`,
      {
        baseDir: BaseDirectory.AppData,
      }
    );
    await file.write(new TextEncoder().encode(diff));
    await file.close();
  }

  async creatScript() {
    if (await exists(`${this.path}/${this.appData.dbSchemaName}`)) {
      return;
    }

    const file = await create(`${this.appData.dbSchemaName}`, {
      baseDir: BaseDirectory.AppData,
    });
    await file.close();
  }

  async loadDBSchema() {
    const path = `${await appDataDir()}\\${this.appData.dbSchemaName}`;

    this.appData.dbSchema = await this.creatFileFrom(
      path,
      this.appData.dbSchemaName
    );
    console.log(this.appData.dbSchema);
  }

  async updateDBSchema(content: string) {
    const path = `${await appDataDir()}\\${this.appData.dbSchemaName}`;
    const uint8Array = new TextEncoder().encode(content);
    await writeFile(path, uint8Array);
  }

  decoder = new TextDecoder("utf-8");
  async loadAllDifs() {
    const entries = await readDir(`${this.appData.diffFoldrName}`, {
      baseDir: BaseDirectory.AppData,
    });
    for (const entry of entries) {
      const path = `${await appDataDir()}\\${this.appData.diffFoldrName}\\${
        entry.name
      }`;
      const file = await this.creatFileFrom(path, entry.name);
      this.appData.diffs.push(file);
    }

    this.appData.diffs.sort((a, b) => {
      const timeA = a.creationTime ? a.creationTime.getTime() : 0;
      const timeB = b.creationTime ? b.creationTime.getTime() : 0;
      return timeB - timeA; // Newest first
    });

    console.log(this.appData.diffs);
  }

  private async creatFileFrom(path: string, name: string) {
    const metaData = await stat(path);
    const fileContent = await readFile(path);
    const decodedString = this.decoder.decode(fileContent);

    return {
      creationTime: metaData.birthtime,
      content: decodedString,
      name: name,
    } as File;
  }

  async getPath() {
    return `${await appDataDir()}\\${this.appData.diffFoldrName}`;
  }

  async clearHistory() {
    const entries = await readDir(`${this.appData.diffFoldrName}`, {
      baseDir: BaseDirectory.AppData,
    });
    for (const entry of entries) {
      await remove(`${this.appData.diffFoldrName}/${entry.name}`, {
        baseDir: BaseDirectory.AppData,
      });
    }
  }
}
