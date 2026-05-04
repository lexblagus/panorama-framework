import { describe, expect, it } from "vitest";
import { CliError, parseCliArgs } from "../../src/index.js";

describe("parseCliArgs", () => {
  it("parses build with --recipe", () => {
    expect(parseCliArgs(["build", "--recipe", "smoke-test"])).toEqual({
      command: "build",
      recipeId: "smoke-test",
    });
  });

  it("parses run with --plan", () => {
    expect(parseCliArgs(["run", "--plan", "smoke-test"])).toEqual({
      command: "run",
      planId: "smoke-test",
    });
  });

  it("rejects --plan for build", () => {
    expect(() => parseCliArgs(["build", "--plan", "smoke-test"])).toThrow(
      CliError,
    );
  });

  it("rejects --recipe for run", () => {
    expect(() => parseCliArgs(["run", "--recipe", "smoke-test"])).toThrow(
      CliError,
    );
  });

  it("accepts dots after first character", () => {
    expect(parseCliArgs(["resume", "--plan", "smoke.test"])).toEqual({
      command: "resume",
      planId: "smoke.test",
    });
  });

  it("rejects invalid identifier", () => {
    expect(() => parseCliArgs(["exec", "--recipe", ".invalid"])).toThrow(
      CliError,
    );
  });
});

