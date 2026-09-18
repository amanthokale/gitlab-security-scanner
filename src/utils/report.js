const buildReport = (scanResults) => {
  const projects = scanResults.map((result) => ({
    id: result.project.id,
    name: result.project.name,
    webUrl: result.project.webUrl,

    totalFindings: result.findings?.length || 0,

    findings: result.findings || [],

    error: result.error || null,
  }));

  const allFindings = projects.flatMap(
    (project) => project.findings
  );

  const severitySummary = allFindings.reduce(
    (summary, finding) => {
      summary[finding.severity] =
        (summary[finding.severity] || 0) + 1;

      return summary;
    },
    {
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    }
  );

  return {
    summary: {
      scannedProjects: projects.length,
      totalFindings: allFindings.length,
      severity: severitySummary,
    },

    projects,
  };
};

module.exports = {
  buildReport,
};