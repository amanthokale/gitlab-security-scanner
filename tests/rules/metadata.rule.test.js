const { metadataRule } = require("../../src/rules/metadata.rule");

describe("Metadata Rule", () => {
  test("should return no findings when README.md and LICENSE exist", () => {
    const files = [
      { path: "README.md", type: "blob" },
      { path: "LICENSE", type: "blob" },
      { path: "src/app.js", type: "blob" },
    ];

    const findings = metadataRule.scan(files);

    expect(findings).toHaveLength(0);
  });

  test("should detect missing README.md", () => {
    const files = [
      { path: "LICENSE", type: "blob" },
      { path: "src/app.js", type: "blob" },
    ];

    const findings = metadataRule.scan(files);

    expect(findings).toHaveLength(1);

    expect(findings[0]).toEqual({
      ruleId: "missing-metadata",
      category: "metadata",
      issue: "Missing README.md",
      severity: "LOW",
      file: null,
    });
  });

  test("should detect missing LICENSE", () => {
    const files = [
      { path: "README.md", type: "blob" },
      { path: "src/app.js", type: "blob" },
    ];

    const findings = metadataRule.scan(files);

    expect(findings).toHaveLength(1);

    expect(findings[0]).toEqual({
      ruleId: "missing-metadata",
      category: "metadata",
      issue: "Missing LICENSE",
      severity: "LOW",
      file: null,
    });
  });

  test("should detect both missing README.md and LICENSE", () => {
    const files = [
      { path: "src/app.js", type: "blob" },
      { path: "src/server.js", type: "blob" },
    ];

    const findings = metadataRule.scan(files);

    expect(findings).toHaveLength(2);

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          issue: "Missing README.md",
          severity: "LOW",
        }),
        expect.objectContaining({
          issue: "Missing LICENSE",
          severity: "LOW",
        }),
      ])
    );
  });

  test("should handle case-insensitive README.md and LICENSE", () => {
    const files = [
      { path: "readme.md", type: "blob" },
      { path: "license", type: "blob" },
    ];

    const findings = metadataRule.scan(files);

    expect(findings).toHaveLength(0);
  });

  test("should handle an empty repository", () => {
    const findings = metadataRule.scan([]);

    expect(findings).toHaveLength(2);

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          issue: "Missing README.md",
        }),
        expect.objectContaining({
          issue: "Missing LICENSE",
        }),
      ])
    );
  });
});