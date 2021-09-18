var express = require('express');
var router = express.Router();
const path = require('path')
const api = require('../DAL/projects');
const { validateCookie, fileUploads } = require('../utils/middlewares')

// GET
router.get('/explore', async function (req, res, next) {
    try {
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

router.get('/download/:filename', async function (req, res, next) {
    try {
        const fileName = req.params.filename;
        var fileLocation = path.join('public/files/', fileName);
        res.download(fileLocation, fileName);
    } catch (err) {
        console.log(err)
    }
})

//PUT
router.put('/:projectId/:userId/remove', validateCookie, async function (req, res, next) {
    try {
        const removeProjectRes = await api.hideProject(req.params.projectId, req.params.userId)
        res.send(removeProjectRes)
    } catch (err) {
        console.log(err)
    }
});

router.put('/', fileUploads, validateCookie, async function (req, res, next) {
    const dataObj = { ...req.body }
    if (dataObj.pictures) delete dataObj.pictures
    if (req.files) {
        if (req.files.assetsSrc) {
            dataObj.assetsSrc = `files/${req.files.assetsSrc[0].filename}`
        }
        if (req.files.pictures) {
            dataObj.pictures = req.files.pictures
        }
    }
    try {
        const updateProjectRes = await api.updateProjectData({ ...dataObj })
        res.send(updateProjectRes)
    } catch (err) {
        console.log(err)
    }
});


//POST
router.post('/', fileUploads, validateCookie, async function (req, res, next) {
    const dataObj = { ...req.body }
    if (req.files) {
        if (req.files.assetsSrc) {
            dataObj.assetsSrc = `files/${req.files.assetsSrc[0].filename}`
        }
        if (req.files.pictures) {
            dataObj.pictures = req.files.pictures
        }
    }
    try {
        const newProjectRes = await api.addNewProject({ ...dataObj })
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
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;