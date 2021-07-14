var express = require('express');
var router = express.Router();
const api = require('../DAL/projects');
const { validateCookie, fileUploads } = require('../utils/middlewares')

// GET
router.get('/', async function (req, res, next) {
    try {
        if (req.query.userId) req.query.userId = ''
        console.log(req.query)
        const projectsData = await api.getProjectsCardData(req.query)
        res.send(projectsData)
    } catch (err) {
        console.log(err, 'error')
    }
});

router.get('/dashboard', validateCookie, async function (req, res, next) {
    try {
        const projectsData = await api.getProjectsCardData(req.query)
        res.send(projectsData)
    } catch (err) {
        console.log(err, 'error')
    }
});

router.get('/:projectId', async function (req, res, next) {
    try {
        const data = await api.getProjectData(req.params.projectId)
        res.send(JSON.stringify(data));
    } catch (err) {
        console.log(err)
    }
});

//PUT
router.put('/', fileUploads, validateCookie, async function (req, res, next) {
    try {
        const updateProjectRes = await api.updateProjectData({ ...req.body })
        res.send(updateProjectRes)
    } catch (err) {
        console.log(err)
    }
});

router.put('/:projectId/:userId/remove', validateCookie, async function (req, res, next) {
    try {
        const removeProjectRes = await api.hideProject(req.params.projectId, req.params.userId)
        res.send(removeProjectRes)
    } catch (err) {
        console.log(err)
    }
});


//POST
router.post('/', fileUploads, validateCookie, async function (req, res, next) {
    try {
        console.log('hi')
        console.log(req.body)
        //  pictures: [...req.body.pictures.split(',').map(obj => obj)]
        const newProjectRes = await api.addNewProject({ ...req.body })
        res.send(newProjectRes)
    } catch (err) {
        console.log(err)
    }
});

//DELETE
router.delete('/remove/requiredtech/:projectId/:techId', validateCookie, async function (req, res, next) {
    try {
        const removeReqTechRes = await api.removeReqTech(req.params.projectId, req.params.techId)
        res.send(removeReqTechRes)
    } catch (err) {
        console.log(err)
    }
});

router.delete('/remove/picture/:picId', validateCookie, async function (req, res, next) {
    try {
        const removePictureRes = await api.removePicture(req.params.picId)
        res.send(removePictureRes)
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;