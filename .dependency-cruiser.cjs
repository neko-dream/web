/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "ページディレクトリから他のディレクトリへの依存は禁止しています",
      severity: "error",
      from: { path: "(^app/routes/)([^/]+)/" },
      to: { path: "^$1", pathNot: "$1$2" },
    },
    {
      name: "機能ディレクトリから他の機能ディレクトリへの依存は禁止しています",
      severity: "error",
      from: { path: "(^app/components/features/)([^/]+)/" },
      to: { path: "^$1", pathNot: "$1$2" },
    },
    {
      name: "機能ディレクトリから他の機能ディレクトリへの依存は禁止しています",
      severity: "error",
      from: { path: "(^app/components/ui/)([^/]+)/" },
      to: { path: "^$1", pathNot: "$1$2" },
    },
  ],
  options: {
    doNotFollow: {
      path: ["node_modules"],
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
      mainFields: ["module", "main", "types", "typings"],
    },
    skipAnalysisNotInRules: true,
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/(?:@[^/]+/[^/]+|[^/]+)",
      },
      archi: {
        collapsePattern:
          "^(?:packages|src|lib(s?)|app(s?)|bin|test(s?)|spec(s?))/[^/]+|node_modules/(?:@[^/]+/[^/]+|[^/]+)",
      },
      text: {
        highlightFocused: true,
      },
    },
  },
};
// generated: dependency-cruiser@16.10.1 on 2025-04-05T12:22:42.629Z
