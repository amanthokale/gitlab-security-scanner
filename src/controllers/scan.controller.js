const gitlabService = require("../services/gitlab/gitlab.service");
// const scannerService = require("../services/scanner/scanner.service");
const scannerService = require("../services/scanner/local.repository.scanner");
const {
  buildReport,
} = require("../utils/report");
const {
  scanProjects,
} = require("../services/scanner/project-scanner.service");

const getProjects = async (req, res, next) => {
  try {
    const { username, group } = req.query;

    if (!username && !group) {
      return res.status(400).json({
        success: false,
        message: "Username or group is required",
      });
    }

    if (username && group) {
      return res.status(400).json({
        success: false,
        message: "Provide either username or group, not both",
      });
    }

    let projects;

    if (username) {
      const user = await gitlabService.findUser(username);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "GitLab user not found",
        });
      }

      projects = await gitlabService.getUserProjects(user.id);
    } else {
      const gitlabGroup = await gitlabService.findGroup(group);

      if (!gitlabGroup) {
        return res.status(404).json({
          success: false,
          message: "GitLab group not found",
        });
      }

      projects = await gitlabService.getGroupProjects(
        gitlabGroup.id
      );
    }

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects: projects.map((project) => ({
        id: project.id,
        name: project.name,
        path: project.path,
        webUrl: project.web_url,
        defaultBranch: project.default_branch,
      })),
    });
  } catch (error) {
    next(error);
  }
};

const scan = async (req, res, next) => {
  try {
    const { username, group } = req.body;
    console.log("req.body",req.body)
    if (!username && !group) {
      return res.status(400).json({
        success: false,
        message: "Username or group is required",
      });
    }

    if (username && group) {
      return res.status(400).json({
        success: false,
        message: "Provide either username or group, not both",
      });
    }

    let projects;

    if (username) {
        console.log("username",username)
      const user = await gitlabService.findUser(username);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "GitLab user not found",
        });
      }

      projects = await gitlabService.getUserProjects(user.id);
    } else {
      const gitlabGroup = await gitlabService.findGroup(group);

      if (!gitlabGroup) {
        return res.status(404).json({
          success: false,
          message: "GitLab group not found",
        });
      }

      projects = await gitlabService.getGroupProjects(
        gitlabGroup.id
      );
    }
console.log(projects)
//     const results = [];

//     for (const project of projects) {
//       try {
//         const result = await scannerService.scanRepository({
//           id: project.id,
//           name: project.name,
//           webUrl: project.web_url,
//           defaultBranch: project.default_branch,
//         });

//         results.push(result);
//        } catch (error) {
//   console.error(
//     `Failed to scan project ${project.name}:`,
//     error.message
//   );

//   results.push({
//     project: {
//       id: project.id,
//       name: project.name,
//       webUrl: project.web_url,
//     },
//     error: {
//       message: error.message,
//       status: error.response?.status || null,
//     },
//   });
// }
//     }
const results = await scanProjects(projects);

console.log(results)
    // const totalFindings = results.reduce(
    //   (total, result) =>
    //     total + (result.totalFindings || 0),
    //   0
    // );

    // return res.status(200).json({
    //   success: true,
    //   data: {
    //     scannedProjects: results.length,
    //     totalFindings,
    //     results,
    //   },
    // });
    const report = buildReport(results);

return res.status(200).json({
  success: true,
  data: report,
});
  } catch (error) {
    console.log(error)
    next(error);
  }
};

const scanRepository = async (req, res, next) => {
  try {
    const { projectId, branch } = req.query;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "projectId is required",
      });
    }

    const project = {
      id: projectId,
      name: projectId,
      webUrl: null,
      defaultBranch: branch || "main",
    };

    const result = await scannerService.scanRepository(project);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,scanRepository,scan
};