const path = require("path");
const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/is.admin");
const isDownload = require("../middlewares/downloader");

const isAdmincontroller = require("../admin-controllers/is-admin.controller");
const adminLogin = require("../admin-controllers/login.controller");
const adminLogut = require("../admin-controllers/logout.controller");
const createTeam = require("../admin-controllers/create-team.controller");
const saveHero = require("../admin-controllers/save-hero.controller");
const saveSettings = require("../admin-controllers/save-settings.controller");
const getSettings = require("../admin-controllers/get-settings.controller");
const editTeamMembers = require("../admin-controllers/edit-team-members.controller");
const deleteTeamMembers = require("../admin-controllers/delete-member.controller");
const createBlog = require("../admin-controllers/create-blog.controller");
const editBlog = require("../admin-controllers/edit-blog.controller");
const getBlogs = require("../admin-controllers/get-blogs.controller");
const deleteBlog = require("../admin-controllers/delete-blog.controller");
const createFlyer = require("../admin-controllers/create-flyer.controller");
const getFlyers = require("../admin-controllers/get-flyers.controller");
const editFlyer = require("../admin-controllers/edit-flyer.controller");
const deleteFlyer = require("../admin-controllers/delete-flyer.controller");
const downloadFlyer = require("../admin-controllers/download-flyer.controller");

router.get("/is-admin", isAdmin, isAdmincontroller);
router.post("/login", adminLogin);
router.post("/logout", isAdmin, adminLogut);
router.post("/create-team", isAdmin, createTeam);
router.post("/save-settings", isAdmin, saveSettings);
router.post("/save-hero", isAdmin, saveHero);
router.get("/get-settings", getSettings);
router.put("/edit-team-members/:name", isAdmin, editTeamMembers);
router.delete("/delete-team-members/:name", isAdmin, deleteTeamMembers);
/*--------------- For Blogs Route ----------------*/
router.post("/create-blog", isAdmin, createBlog);
router.put("/update-blog/:id", isAdmin, editBlog);
router.get("/view-blog-list", getBlogs);
router.delete("/delete-blog/:id", isAdmin, deleteBlog);
/*--------------- For Flyer Route ----------------*/
router.post("/create-flyer", isAdmin, createFlyer);
router.get("/view-flyer-list", getFlyers);
router.put("/edit-flyer/:id", isAdmin, editFlyer);
router.delete("/delete-flyer/:id", isAdmin, deleteFlyer);
router.get("/download-flyer/:id",isDownload, downloadFlyer);

module.exports = router;
