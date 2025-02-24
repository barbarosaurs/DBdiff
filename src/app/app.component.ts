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
import { ConfirmDialog } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { ConfirmationService, MessageService } from "primeng/api";
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
    ConfirmDialog,
    ToastModule,
    ButtonModule,
    Tooltip,
  ],

  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  providers: [ConfirmationService, MessageService],
})
export class AppComponent implements AfterViewInit {
  @ViewChild("curretVersionEdditor")
  editorContainer!: ElementRef<HTMLDivElement>;
  curentEditor!: ace.Editor;
  @ViewChild("newVersionEdditor")
  newVersionContainer!: ElementRef<HTMLDivElement>;
  newVersionEdditor!: ace.Editor;

  @ViewChild("diffCodeEditor")
  diffCodeContainer!: ElementRef<HTMLDivElement>;
  diffCodeEditor!: ace.Editor;

  ngAfterViewInit(): void {
    this.curentEditor = ace.edit(this.editorContainer.nativeElement);
    this.curentEditor.setFontSize(15);
    this.curentEditor.session.setValue("Loading");

    this.newVersionEdditor = ace.edit(this.newVersionContainer.nativeElement);
    this.newVersionEdditor.setFontSize(15);
    this.newVersionEdditor.session.setValue("");

    this.diffCodeEditor = ace.edit(this.diffCodeContainer.nativeElement);
    this.diffCodeEditor.setFontSize(15);
    this.diffCodeEditor.session.setValue("");

    this.curentEditor.session.on("change", (newCode) => {
      this.updateDifference(this.curentEditor?.getValue());
    });
    this.newVersionEdditor.session.on("change", (newCode) => {
      this.updateDifference(this.curentEditor?.getValue());
    });
  }

  fileService = inject(FileServiseService);
  public appData = inject(AppData);

  greetingMessage = "";

  updateDifference(newCode: string | undefined) {
    if (!newCode) return;
    const differences = diffLines(
      this.curentEditor?.getValue()!,
      this.newVersionEdditor?.getValue()!,
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

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.loadAllFiles();
  }

  async loadAllFiles() {
    await this.fileService.loadDBSchema();
    await this.fileService.loadAllDifs();
    this.curentEditor?.setValue(this.appData.dbSchema.content);
  }

  async saveDiff() {
    const diff = this.diffCodeEditor?.getValue();
    const newText = this.newVersionEdditor?.getValue();
    await this.fileService.updateDBSchema(newText);
    await this.fileService.addDiff(diff);
    this.curentEditor?.setValue(newText);
    this.diffCodeEditor?.setValue("");
    this.newVersionEdditor?.setValue("");

    // Reload all the stuff
    this.appData.diffs = [];
    this.loadAllFiles();
  }

  confirmForClear(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Do you want to delete history?",
      header: "Danger Zone",
      icon: "pi pi-info-circle",
      rejectLabel: "Cancel",
      rejectButtonProps: {
        label: "Cancel",
        severity: "secondary",
        outlined: true,
      },
      acceptButtonProps: {
        label: "Delete",
        severity: "danger",
      },

      accept: () => {
        this.clearHistory();
        this.messageService.add({
          severity: "info",
          summary: "Confirmed",
          detail: "Record deleted",
        });
      },
      reject: () => {
        this.messageService.add({
          severity: "secondary",
          summary: "Rejected",
          detail: "You have rejected",
        });
      },
    });
  }

  conformForSave(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure that you want save diff?",
      header: "Confirmation",
      closable: true,
      closeOnEscape: true,
      icon: "pi pi-exclamation-triangle",
      rejectButtonProps: {
        label: "Cancel",
        severity: "secondary",
        outlined: true,
      },
      acceptButtonProps: {
        label: "Save",
      },
      accept: () => {
        this.saveDiff();
        this.messageService.add({
          severity: "info",
          summary: "Confirmed",
          detail: "You have save new diff :)",
        });
      },
      reject: () => {
        this.messageService.add({
          severity: "secondary",
          summary: "Rejected",
          detail: "You have rejected diff, keep on working you got this.",
          life: 3000,
        });
      },
    });
  }

  async clearHistory() {
    await this.fileService.clearHistory();
    this.appData.diffs = [];
    this.loadAllFiles();
  }
}
