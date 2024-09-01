/*
 * pulsate-dev/pulsate specification documentation generator
 */
import { walk } from "@std/fs";

const viewCodePath =
  "https://github.com/pulsate-dev/pulsate/tree/main" as const;
const pathReplaceRegexp = new RegExp(/file:([a-zA-Z.0-9#;&]*?)"/, "g");
// NOTE: basePath must set like this: "path/to/pkg/"
const basePath = Deno.args[0];
if (!basePath) {
  throw new Error("ERROR: basePath is not set.");
}

const modules = [
  "accounts",
  "drive",
  "notes",
  "timeline",
] as const;
const packages = [
  "adaptors",
  "id/mod.ts",
  "id/type.ts",
  "intermodule",
  "password",
  "time",
] as const;

const moduleSourceDirs = [
  "model",
  "service",
] as const;

const sourcePaths = [
  ...modules.map((module) => {
    return moduleSourceDirs.map((dir) => {
      return `${basePath}${module}/${dir}`;
    });
  }),
  ...packages.map((pkg) => {
    return `${basePath}${pkg}`;
  }),
];

const command = await new Deno.Command("deno", {
  args: [
    "doc",
    "--unstable-byonm",
    "--unstable-sloppy-imports",
    "--html",
    "--name=pulsate",
    ...sourcePaths.flat(),
  ],
}).output();
console.log(new TextDecoder().decode(command.stderr));

// remove *.test.ts files & directories
const testFiles = [];
for await (const v of walk("./docs", { includeSymlinks: false })) {
  if (v.isFile) continue;
  if (v.name.includes("test.ts")) {
    testFiles.push(v.path);
  }
}

for (const v of testFiles) {
  Deno.removeSync(v, { recursive: true });
}

const replaceFileLink = async (path: string) => {
  let file = await Deno.readTextFile(path);

  const match = file.matchAll(pathReplaceRegexp);
  if (!match) {
    throw new Error("No match");
  }

  // file:以降を取得
  const matchStrings = [...match].map((v) => v[1]);
  const splited = matchStrings.map((v) => v.split("&#x2F;"));

  // pkg, module or package が連続していたらそれ以降を取得して結合
  for (const [i, v] of splited.entries()) {
    // pkgより後ろを取得
    const last3 = v.slice(v.indexOf("pkg"));

    // 前からpkg, module or packageが連続するかどうかをチェック
    if (last3[0] !== "pkg") throw new Error("Not found pkg");
    if (
      !(modules.includes(last3[1] as typeof modules[number]) ||
        packages.includes(last3[1] as typeof packages[number]))
    ) {
      // idの時は結合して合っているかを確かめる
      const joined = last3.slice(1).join("/");
      if (!packages.includes(joined as typeof packages[number])) {
        throw new Error("Not found module or package");
      }
    }

    const path = `${viewCodePath}/${last3.join("/")}`;

    file = file.replaceAll(`file:${matchStrings[i]}`, path);
  }
  await Deno.writeTextFile(path, file, { append: false });
};

for await (const v of walk("./docs")) {
  if (v.isDirectory) continue;
  replaceFileLink(v.path);
}
