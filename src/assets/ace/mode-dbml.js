// src/assets/ace/mode-dbml.js
ace.define(
  "ace/mode/dbml",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/mode/text_highlight_rules",
  ],
  function (require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var TextHighlightRules =
      require("./text_highlight_rules").TextHighlightRules;

    var DbmlHighlightRules = function () {
      this.$rules = {
        start: [
          {
            token: "comment.line.hash",
            regex: /#.*$/,
          },
          {
            token: "keyword.control.dbml",
            regex: /\b(Table|enum|Ref|indexes|index|Note|Project)\b/,
          },
          {
            token: "storage.type.dbml",
            regex:
              /\b(varchar|decimal|text|integer|int|numeric|timestamp|boolean|json|uuid|bigint|DATE|char|CHAR|smallint|VARCHAR|float|double|bytea|inet|date|time|interval|serial|bigserial)\b/,
          },
          {
            token: "constant.language.dbml",
            regex:
              /\b(PK|FK|unique|null|not null|default|primary key|foreign key|index|unique index)\b/,
          },
          {
            token: "string.quoted.single.dbml",
            regex: /'(?:[^']|'')*'/,
          },
          {
            token: "string.quoted.double.dbml",
            regex: /"(?:[^"]|"")*"/,
          },
          {
            token: "constant.numeric.dbml",
            regex: /\b\d+\b/,
          },
          {
            token: "entity.name.type.table.dbml",
            regex: /(?:\bTable\s+)(\w+)/,
            push: [
              {
                token: "meta.table.dbml",
                regex: /\{/,
                next: "table_body",
              },
            ],
          },
          {
            token: "entity.name.type.enum.dbml",
            regex: /(?:\benum\s+)(\w+)/,
            push: [
              {
                token: "meta.enum.dbml",
                regex: /\{/,
                next: "enum_body",
              },
            ],
          },
          {
            token: "keyword.operator.relationship.dbml",
            regex: /[><-]+/,
          },
          {
            token: "meta.tag.dbml",
            regex: /`[^`]*`/,
          },
        ],
        table_body: [
          {
            token: "variable.parameter.column.dbml",
            regex: /(\s*)(\w+)(\s+)/,
            next: "column_type",
          },
          {
            token: "meta.tag.dbml",
            regex: /\}/,
            next: "start",
          },
        ],
        column_type: [
          {
            token: "storage.type.dbml",
            regex:
              /\b(varchar|text|integer|int|numeric|timestamp|boolean|json|uuid)\b/,
            next: "column_settings",
          },
        ],
        column_settings: [
          {
            token: "meta.bracket.square.dbml",
            regex: /\[/,
            next: "column_constraints",
          },
        ],
        column_constraints: [
          {
            token: "constant.language.dbml",
            regex:
              /\b(PK|FK|unique|null|not null|default|primary key|foreign key|index|unique index)\b/,
          },
          {
            token: "meta.bracket.square.dbml",
            regex: /\]/,
            next: "table_body",
          },
          {
            token: "punctuation.separator.comma.dbml",
            regex: /,/,
          },
        ],
        enum_body: [
          {
            token: "constant.enum.value.dbml",
            regex: /\b\w+\b/,
          },
          {
            token: "meta.tag.dbml",
            regex: /\}/,
            next: "start",
          },
        ],
      };

      this.normalizeRules();
    };

    oop.inherits(DbmlHighlightRules, TextHighlightRules);

    var Mode = function () {
      this.HighlightRules = DbmlHighlightRules;
    };
    oop.inherits(Mode, TextMode);

    (function () {
      this.lineCommentStart = "#";
      this.$id = "ace/mode/dbml";
    }).call(Mode.prototype);

    exports.Mode = Mode;
  }
);
