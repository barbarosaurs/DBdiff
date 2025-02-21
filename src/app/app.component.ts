import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { invoke } from "@tauri-apps/api/core";
import { create, BaseDirectory } from "@tauri-apps/plugin-fs";
import { FileServiseService } from "./file-servise.service";
import { AppData } from "./app.data";
import * as monaco from "monaco-editor";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements AfterViewInit {
  @ViewChild("editorContainer", { static: false })
  editorContainer!: ElementRef<HTMLDivElement>;

  @ViewChild("editorContainer2", { static: false })
  editorContainer2!: ElementRef<HTMLDivElement>;

  private editor?: monaco.editor.IStandaloneCodeEditor;
  private editor2?: monaco.editor.IStandaloneCodeEditor;
  ngAfterViewInit(): void {
    // Create the Monaco Editor instance after the view (DOM) is initialized
    this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
      value: "",
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
    });

    this.editor2 = monaco.editor.create(this.editorContainer2.nativeElement, {
      value: "",
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
    });
  }

  fileService = inject(FileServiseService);
  appData = inject(AppData);

  greetingMessage = "";

  constructor() {
    //  this.addDiff();
    this.loadAllFiles();
  }

  async loadAllFiles() {
    await this.fileService.loadDBSchema();
    await this.fileService.loadAllDifs();
    this.editor?.setValue(this.appData.dbSchema.content);
    console.log(this.appData.dbSchema.content);
  }

  async addDiff() {
    this.fileService.addDiff("");
  }
}
