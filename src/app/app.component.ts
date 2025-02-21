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
//import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as monaco from "monaco-editor";
import { diffLines } from "diff";

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

  @ViewChild("diffCodeEditor", { static: false })
  diffCodeEditorHTML!: ElementRef<HTMLDivElement>;

  private currentEdditor?: monaco.editor.IStandaloneCodeEditor;
  private newEditor?: monaco.editor.IStandaloneCodeEditor;
  private diffCodeEditor?: monaco.editor.IStandaloneCodeEditor;
  ngAfterViewInit(): void {
    // Create the Monaco Editor instance after the view (DOM) is initialized
    this.currentEdditor = monaco.editor.create(
      this.editorContainer.nativeElement,
      {
        value: "",
        language: "javascript",
        theme: "vs-dark",
        automaticLayout: true,
        readOnly: true,
        minimap: { enabled: false },
      }
    );

    this.newEditor = monaco.editor.create(this.editorContainer2.nativeElement, {
      value: "",
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: false },
    });

    this.diffCodeEditor = monaco.editor.create(
      this.diffCodeEditorHTML.nativeElement,
      {
        value: "",
        language: "javascript",
        theme: "vs-dark",
        automaticLayout: true,
        readOnly: true,
        minimap: { enabled: false },
      }
    );
    this.newEditor.getModel()?.onDidChangeContent((newCode) => {
      this.updateDifference(this.newEditor?.getValue());
    });
  }

  fileService = inject(FileServiseService);
  public appData = inject(AppData);

  greetingMessage = "";

  updateDifference(newCode: string | undefined) {
    if (!newCode) return;
    const differences = diffLines(
      this.currentEdditor?.getValue()!,
      this.newEditor?.getValue()!,
      { ignoreWhitespace: true }
    );
    const diffResults = differences
      .map((part) => {
        if (part.added) return `+ ${part.value.trim()}`;
        if (part.removed) return `- ${part.value.trim()}`;
        return "";
      })
      .join("\n");
    console.log(diffResults);
    this.diffCodeEditor?.setValue(diffResults);
  }

  constructor() {
    this.addDiff();
    this.loadAllFiles();
  }

  async loadAllFiles() {
    await this.fileService.loadDBSchema();
    await this.fileService.loadAllDifs();
    this.currentEdditor?.setValue(this.appData.dbSchema.content);
    console.log(this.appData.dbSchema.content);
  }

  async addDiff() {
    const text = this.diffCodeEditor?.getValue();
    const newText = this.newEditor?.getValue();
    if (!text) return;
    if (!newText) return;

    this.fileService.updateDBSchema(newText);
    this.fileService.addDiff(text);
    this.currentEdditor?.setValue(newText);
    this.diffCodeEditor?.setValue("");
  }
}
