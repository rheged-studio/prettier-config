/**
 * Preset smoke tests (R-2935, decisions on R-2934).
 *
 * The suite packs the package once and installs the tarball, with its real
 * dependencies, into one throwaway consumer per supported Prettier version
 * under the gitignored `.fixtures/` directory. Each consumer points Prettier
 * at the preset through `package.json`'s `"prettier"` key, so every check runs
 * against the published `exports` and `files`, the way an estate repo would.
 *
 * - `fixtures/formatted/` must pass `prettier --check`.
 * - `fixtures/unformatted/` must fail it, and must format to the file of the
 *   same name in `fixtures/formatted/`.
 * - `fixtures/ignored/` holds unformatted files the shipped `prettierignore`
 *   must skip.
 */
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

const repoRoot = resolve(import.meta.dirname, "../..");
const fixturesDirectory = join(repoRoot, "fixtures");
const workDirectory = join(repoRoot, ".fixtures");
const packageName = "@rheged-studio/prettier-config";

const installedPrettier = (
  JSON.parse(
    readFileSync(join(repoRoot, "node_modules/prettier/package.json"), "utf8"),
  ) as { version: string }
).version;

// The peer floor (R-2934 D12) and the version the repo itself resolves.
const prettierVersions = [
  ["floor", "3.5.3"],
  ["latest", installedPrettier],
] as const;

// Options that are not formatting choices, so the preset leaves them alone.
const unpinnedOptions = new Set(["parser", "plugins"]);
const formattingCategories = new Set([
  "Common",
  "Global",
  "HTML",
  "JavaScript",
]);

const formattedNames = readdirSync(join(fixturesDirectory, "formatted"));
const unformattedNames = readdirSync(join(fixturesDirectory, "unformatted"));

type RunResult = {
  output: string;
  status: null | number;
  stdout: string;
};

type SupportOption = {
  category: string;
  default: unknown;
  name: string;
};

function consumerDirectory(label: string): string {
  return join(workDirectory, `consumer-${label}`);
}

function runPrettier(cwd: string, args: string[]): RunResult {
  const result = spawnSync(join(cwd, "node_modules/.bin/prettier"), args, {
    cwd,
    encoding: "utf8",
  });
  return {
    output: result.stdout + result.stderr,
    status: result.status,
    stdout: result.stdout,
  };
}

function presetConfig(): Record<string, unknown> {
  const raw = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `const { default: config } = await import(${JSON.stringify(join(repoRoot, "index.mjs"))}); console.log(JSON.stringify(config));`,
    ],
    { encoding: "utf8" },
  );
  return JSON.parse(raw) as Record<string, unknown>;
}

/**
 * Packs the package and returns the tarball path plus its sorted file list.
 */
function packTarball(): { files: string[]; tarball: string } {
  rmSync(workDirectory, { force: true, recursive: true });
  mkdirSync(workDirectory, { recursive: true });
  execFileSync("pnpm", ["pack", "--pack-destination", workDirectory], {
    cwd: repoRoot,
    stdio: "ignore",
  });
  const name = readdirSync(workDirectory).find((file) => file.endsWith(".tgz"));
  if (!name) {
    throw new Error("pnpm pack produced no tarball");
  }

  const tarball = join(workDirectory, name);
  const files = execFileSync("tar", ["-tzf", tarball], { encoding: "utf8" })
    .trim()
    .split("\n")
    .map((entry) => entry.replace(/^package\//, ""))
    .toSorted();
  return { files, tarball };
}

/**
 * Installs the tarball and one Prettier version into a fresh consumer, then
 * copies the fixtures in beside it.
 */
function installConsumer(label: string, version: string, tarball: string) {
  const directory = consumerDirectory(label);
  mkdirSync(directory, { recursive: true });
  writeFileSync(
    join(directory, "package.json"),
    JSON.stringify({
      devDependencies: {
        [packageName]: `file:${tarball}`,
        prettier: version,
      },
      name: `consumer-${label}`,
      prettier: packageName,
      private: true,
      type: "module",
    }),
  );
  execFileSync(
    "pnpm",
    ["install", "--ignore-workspace", "--prefer-offline", "--silent"],
    { cwd: directory, stdio: "ignore" },
  );
  cpSync(fixturesDirectory, join(directory, "fixtures"), { recursive: true });
}

let packedFiles: string[] = [];

beforeAll(() => {
  const { files, tarball } = packTarball();
  packedFiles = files;
  for (const [label, version] of prettierVersions) {
    installConsumer(label, version, tarball);
  }
}, 180_000);

describe("published package", () => {
  it("ships exactly the preset, the ignore file, README, LICENSE and package.json", () => {
    expect(packedFiles).toEqual(
      [
        "LICENSE",
        "README.md",
        "index.mjs",
        "package.json",
        "prettierignore",
      ].toSorted(),
    );
  });
});

describe.each(prettierVersions)("Prettier %s (%s)", (label, version) => {
  const cwd = consumerDirectory(label);

  it("installs the requested Prettier", () => {
    expect(runPrettier(cwd, ["--version"]).stdout.trim()).toBe(version);
  });

  it("pins every formatting option to Prettier's default", () => {
    const { options } = JSON.parse(
      runPrettier(cwd, ["--support-info"]).stdout,
    ) as { options: SupportOption[] };
    const defaults = Object.fromEntries(
      options
        .filter(
          (option) =>
            formattingCategories.has(option.category) &&
            !unpinnedOptions.has(option.name),
        )
        .map((option) => [option.name, option.default]),
    );
    const pinned = Object.fromEntries(
      Object.entries(presetConfig()).filter(
        ([key]) => !unpinnedOptions.has(key),
      ),
    );
    expect(pinned).toEqual(defaults);
  });

  it("resolves the preset from the consumer's package.json", () => {
    const resolved = JSON.parse(
      execFileSync(
        process.execPath,
        [
          "--input-type=module",
          "-e",
          'const { resolveConfig } = await import("prettier"); console.log(JSON.stringify(await resolveConfig("fixtures/formatted/example.ts")));',
        ],
        { cwd, encoding: "utf8" },
      ),
    ) as Record<string, unknown>;
    expect(resolved).toMatchObject(presetConfig());
  });

  it("passes the formatted fixtures", () => {
    const { output, status } = runPrettier(cwd, [
      "--check",
      "fixtures/formatted",
    ]);
    expect(output).toContain("All matched files use Prettier code style!");
    expect(status).toBe(0);
  });

  it("formats nothing a config-free Prettier would leave alone (D1)", () => {
    const { output, status } = runPrettier(cwd, [
      "--no-config",
      "--check",
      "fixtures/formatted",
    ]);
    expect(output).toContain("All matched files use Prettier code style!");
    expect(status).toBe(0);
  });

  it.each(unformattedNames)(
    "fails on unformatted %s and formats it to the expected output",
    (name) => {
      const path = `fixtures/unformatted/${name}`;
      expect(runPrettier(cwd, ["--check", path]).status).toBe(1);
      expect(runPrettier(cwd, [path]).stdout).toBe(
        readFileSync(join(fixturesDirectory, "formatted", name), "utf8"),
      );
    },
  );

  it("skips everything the shipped prettierignore lists", () => {
    const shippedIgnore = `node_modules/${packageName}/prettierignore`;
    const target = "fixtures/ignored";
    expect(runPrettier(cwd, ["--check", target]).status).toBe(1);
    const { output, status } = runPrettier(cwd, [
      "--check",
      target,
      "--ignore-path",
      shippedIgnore,
    ]);
    expect(output).not.toContain("[warn]");
    expect(status).not.toBe(1);
  });
});

it("has a formatted counterpart for every unformatted fixture", () => {
  expect(formattedNames).toEqual(expect.arrayContaining(unformattedNames));
});
