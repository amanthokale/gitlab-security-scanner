const swaggerSpec = {
  openapi: "3.0.0",

  info: {
    title: "GitLab Security Scanner API",
    version: "1.0.0",
    description:
      "API for scanning GitLab public repositories for potential security risks.",
  },

  servers: [
    {
      url: "http://localhost:5000",
    },
  ],

  tags: [
    {
      name: "Health",
      description: "Service health",
    },
    {
      name: "Scans",
      description: "GitLab repository scanning",
    },
  ],

  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check API health",

        responses: {
          200: {
            description: "API is healthy",
          },
        },
      },
    },

    "/api/v1/scans": {
      post: {
        tags: ["Scans"],
        summary: "Scan GitLab repositories",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                oneOf: [
                  {
                    type: "object",

                    required: ["username"],

                    properties: {
                      username: {
                        type: "string",
                        example: "gitlab-user",
                      },
                    },
                  },
                  {
                    type: "object",

                    required: ["group"],

                    properties: {
                      group: {
                        type: "string",
                        example: "gitlab-org",
                      },
                    },
                  },
                ],
              },
            },
          },
        },

        responses: {
          200: {
            description: "Scan completed successfully",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ScanResponse",
                },
              },
            },
          },

          400: {
            description: "Invalid request",
          },

          404: {
            description: "GitLab user or group not found",
          },

          500: {
            description: "Internal server error",
          },
        },
      },
    },
  },

  components: {
    schemas: {
      Finding: {
        type: "object",

        properties: {
          project: {
            type: "string",
            example: "my-project",
          },

          projectUrl: {
            type: "string",
            nullable: true,
            example: "https://gitlab.com/example/my-project",
          },

          issue: {
            type: "string",
            example: "Sensitive file committed to repository",
          },

          category: {
            type: "string",
            example: "sensitive_files",
          },

          severity: {
            type: "string",
            enum: ["HIGH", "MEDIUM", "LOW"],
            example: "HIGH",
          },

          file: {
            type: "string",
            nullable: true,
            example: ".env",
          },
        },
      },

      SeveritySummary: {
        type: "object",

        properties: {
          HIGH: {
            type: "integer",
            example: 5,
          },

          MEDIUM: {
            type: "integer",
            example: 2,
          },

          LOW: {
            type: "integer",
            example: 4,
          },
        },
      },

      ScanSummary: {
        type: "object",

        properties: {
          scannedProjects: {
            type: "integer",
            example: 15,
          },

          totalFindings: {
            type: "integer",
            example: 11,
          },

          severity: {
            $ref: "#/components/schemas/SeveritySummary",
          },
        },
      },

      ScanResponse: {
        type: "object",

        properties: {
          success: {
            type: "boolean",
            example: true,
          },

          data: {
            type: "object",

            properties: {
              summary: {
                $ref: "#/components/schemas/ScanSummary",
              },

              findings: {
                type: "array",

                items: {
                  $ref: "#/components/schemas/Finding",
                },
              },

              projects: {
                type: "array",

                items: {
                  type: "object",
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;