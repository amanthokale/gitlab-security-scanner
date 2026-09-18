const express = require("express");

const {
  getProjects,
  scanRepository,
  scan
} = require("../controllers/scan.controller");

const router = express.Router();

router.get("/projects", getProjects);

router.get("/repository", scanRepository);
router.post("/", scan);

module.exports = router;