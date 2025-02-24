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
import { diffLines } from "diff";
import { ButtonModule } from "primeng/button";
import { AceModule } from "ngx-ace-wrapper";
import { FormsModule } from "@angular/forms";
import * as ace from "ace-builds";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { Tooltip } from "primeng/tooltip";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    AceModule,
    ScrollPanelModule,
    Tooltip,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements AfterViewInit {
  @ViewChild("curretVersionEdditor")
  editorContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    const aceEditor = ace.edit(this.editorContainer.nativeElement);
    aceEditor.setFontSize(15);
    aceEditor.session.setValue("<h1>Ace Editor works great in Angular!</h1>");
    // Create the Monaco Editor instance after the view (DOM) is initialized
    // this.currentEdditor = monaco.editor.create(
    //   this.editorContainer.nativeElement,
    //   {
    //     value: "",
    //     language: "javascript",
    //     theme: "vs-dark",
    //     automaticLayout: true,
    //     readOnly: true,
    //     minimap: { enabled: false },
    //   }
    // );
    // this.newEditor = monaco.editor.create(this.editorContainer2.nativeElement, {
    //   value: "",
    //   language: "javascript",
    //   theme: "vs-dark",
    //   automaticLayout: true,
    //   minimap: { enabled: false },
    // });
    // this.diffCodeEditor = monaco.editor.create(
    //   this.diffCodeEditorHTML.nativeElement,
    //   {
    //     value: "",
    //     language: "javascript",
    //     theme: "vs-dark",
    //     automaticLayout: true,
    //     readOnly: true,
    //     minimap: { enabled: false },
    //   }
    // );
    // this.newEditor.getModel()?.onDidChangeContent((newCode) => {
    //   this.updateDifference(this.newEditor?.getValue());
    // });
  }

  fileService = inject(FileServiseService);
  public appData = inject(AppData);

  greetingMessage = "";

  updateDifference(newCode: string | undefined) {
    // if (!newCode) return;
    // const differences = diffLines(
    //   this.currentEdditor?.getValue()!,
    //   this.newEditor?.getValue()!,
    //   { ignoreWhitespace: true }
    // );
    // const diffResults = differences
    //   .map((part) => {
    //     if (part.added) return `+ ${part.value.trim()}`;
    //     if (part.removed) return `- ${part.value.trim()}`;
    //     return "";
    //   })
    //   .join("\n");
    // console.log(diffResults);
    // this.diffCodeEditor?.setValue(diffResults);
  }

  constructor() {
    this.addDiff();
    this.loadAllFiles();
  }

  async loadAllFiles() {
    await this.fileService.loadDBSchema();
    await this.fileService.loadAllDifs();
    // this.currentEdditor?.setValue(this.appData.dbSchema.content);
    // console.log(this.appData.dbSchema.content);
  }

  async addDiff() {
    // const text = this.diffCodeEditor?.getValue();
    // const newText = this.newEditor?.getValue();
    // if (!text) return;
    // if (!newText) return;
    // this.fileService.updateDBSchema(newText);
    // this.fileService.addDiff(text);
    // this.currentEdditor?.setValue(newText);
    // this.diffCodeEditor?.setValue("");
  }
}
