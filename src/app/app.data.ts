import { Injectable } from "@angular/core";
import { mkdir, create, BaseDirectory, exists } from "@tauri-apps/plugin-fs";
import { appDataDir } from "@tauri-apps/api/path";

@Injectable({
  providedIn: "root",
})
export class AppData {
  dbSchemaName = "dbSchema.txt";
  dbSchema!: File;
  diffs: File[] = [];
  diffFoldrName = "diff";
}

export class File {
  creationTime!: Date | null;
  content!: string;
  name!: string;
}
