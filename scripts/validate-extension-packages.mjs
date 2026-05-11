import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const { name, version } = packageJson;

const outputDirectory = new URL("../.output/", import.meta.url);
const expectedTag = `v${version}`;
const currentTag = process.env.GITHUB_REF_TYPE === "tag" ? process.env.GITHUB_REF_NAME : undefined;

if (currentTag && currentTag !== expectedTag) {
  throw new Error(`Release tag ${currentTag} does not match package version ${expectedTag}.`);
}

const packages = [
  {
    browser: "chrome",
    path: join(outputDirectory.pathname, `${name}-${version}-chrome.zip`),
    requiresManifest: true,
  },
  {
    browser: "firefox",
    path: join(outputDirectory.pathname, `${name}-${version}-firefox.zip`),
    requiresManifest: true,
  },
  {
    browser: "firefox sources",
    path: join(outputDirectory.pathname, `${name}-${version}-sources.zip`),
    requiresManifest: false,
  },
];

for (const extensionPackage of packages) {
  if (!existsSync(extensionPackage.path)) {
    throw new Error(`Missing ${extensionPackage.browser} package: ${extensionPackage.path}`);
  }

  const archiveEntries = execFileSync("unzip", ["-Z1", extensionPackage.path], {
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);

  if (extensionPackage.requiresManifest && !archiveEntries.includes("manifest.json")) {
    throw new Error(
      `${basename(extensionPackage.path)} must include manifest.json at the archive root.`,
    );
  }

  if (extensionPackage.requiresManifest) {
    const manifest = JSON.parse(
      execFileSync("unzip", ["-p", extensionPackage.path, "manifest.json"], { encoding: "utf8" }),
    );

    if (manifest.version !== version) {
      throw new Error(
        `${basename(extensionPackage.path)} manifest version ${manifest.version} does not match package version ${version}.`,
      );
    }

    if (manifest.name !== "Wisdom") {
      throw new Error(`${basename(extensionPackage.path)} manifest name must be Wisdom.`);
    }
  }

  console.log(`Validated ${basename(extensionPackage.path)}`);
}
