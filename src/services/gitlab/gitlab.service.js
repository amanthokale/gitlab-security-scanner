const gitlabClient = require("./gitlab.client");

const MAX_PER_PAGE = 100;

class GitLabService {
  async findUser(username) {
    const response = await gitlabClient.get("/users", {
      params: {
        username,
      },
    });

    return response.data[0] || null;
  }

  async findGroup(groupName) {
    const response = await gitlabClient.get("/groups", {
      params: {
        search: groupName,
      },
    });

    return response.data[0] || null;
  }

  async getUserProjects(userId) {
    return this.getAllProjects(`/users/${userId}/projects`);
  }

  async getGroupProjects(groupId) {
    return this.getAllProjects(`/groups/${groupId}/projects`);
  }

  async getAllProjects(endpoint) {
    const projects = [];
    let page = 1;

    while (true) {
      const response = await gitlabClient.get(endpoint, {
        params: {
          visibility: "public",
          page,
          per_page: MAX_PER_PAGE,
          order_by: "id",
          sort: "asc",
        },
      });

      const currentProjects = response.data;

      if (!currentProjects.length) {
        break;
      }

      projects.push(...currentProjects);
      console.log("Pusing")
      const totalPages = Number(
        response.headers["x-total-pages"] || page
      );

      if (page >= totalPages) {
        break;
      }

      page++;
    }

    return projects;
  }
  async getRepositoryTree(projectId, branch) {
  const files = [];
  let page = 1;

  while (true) {
    const response = await gitlabClient.get(
      `/projects/${encodeURIComponent(projectId)}/repository/tree`,
      {
        params: {
          ref: branch,
          recursive: true,
          page,
          per_page: 100,
        },
      }
    );

    const currentFiles = response.data;

    if (!currentFiles.length) {
      break;
    }

    files.push(...currentFiles);

    const totalPages = Number(
      response.headers["x-total-pages"] || page
    );

    if (page >= totalPages) {
      break;
    }

    page++;
  }

  return files;
}
async getFileContent(projectId, filePath, branch) {
  const response = await gitlabClient.get(
    `/projects/${encodeURIComponent(projectId)}/repository/files/${encodeURIComponent(filePath)}`,
    {
      params: {
        ref: branch,
      },
    }
  );

  return Buffer.from(
    response.data.content,
    "base64"
  ).toString("utf-8");
}
async getRepositoryArchive(projectId, branch) {
  const response = await gitlabClient.get(
    `/projects/${encodeURIComponent(projectId)}/repository/archive.zip`,
    {
      params: {
        sha: branch,
      },
      responseType: "arraybuffer",
    }
  );

  return Buffer.from(response.data);
}
}



module.exports = new GitLabService();