const express = require('express');
const router = express.Router();
const jsend = require('jsend');
router.use(jsend.middleware)

const { sequelize, Participant, WorkDetail, HomeDetail } = require('../models');



// Helper validation functions

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && re.test(email);
}

function isValidDate(dateString) {
    if (typeof dateString !== 'string') return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString;
}

function isValidString(value, min = 1, max = 255) {
    return typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;
}

function isValidSalary(salary) {
    return typeof salary === 'number' && salary >= 0;
}


// Middleware to validate POST/PUTS body 
// this is not needed but its best practice to block uncorrect format before going into database
function validateParticipant(req, res, next) {
    const { email, firstname, lastname, dob, work, home } = req.body;
    if (!isValidEmail(email)) {
        return res.status(400).jsend.fail({ statusCode: 400, result: 'Invalid or missing email' });
    }
    if (!isValidString(firstname, 1, 100)) {
        return res.status(400).jsend.fail({ statusCode: 400, result: 'Invalid or missing lastname' });
    }
    if (!isValidString(lastname, 1, 100)) {
        return res.status(400).jsend.fail({ statusCode: 400, result: 'Invalid or missing lastname' })
    }
    if (!isValidDate(dob)) {
        return res.status(400).jsend.fail({ statusCode: 400, result: 'Invalid or missing dob; expected YYYY-MM-DD' });
    }
    if (typeof work !== 'object') {
        return res.status(400).jsend.fail({ statusCode: 400, result: 'Missing work details' })
    }
    const { companyname, salary, currency } = work;
    if (!isValidString(companyname, 1, 255)) {
        return res.status(400).jsend.fail({ statusCode: 400, result: 'Invalid or missing companyname' });
    }
    if (!isValidSalary(salary)) {
        return res.status(400).jsend.fail({ statusCode: 400, result: 'Invalid or missing salary; must be a non-negative number' })
    }
    if (!isValidString(currency, 1, 10)) {
        return res.status(400).jsend.fail({ statusCode: 400, result: 'Invalid or missing currency' })

    }
    if (typeof home !== 'object') {
        return res.status(400).jsend.fail({ statusCode: 400, result: 'Missing home details' })
    }
    const { country, city } = home;
    if (!isValidString(country, 1, 100)) {
        return res.status(400).jsend.fail({ statusCode: 400, result: 'Invalid or missing country' })
    }
    if (!isValidString(city, 1, 100)) {
        return res.status(400).jsend.fail({ statusCode: 400, result: 'Invalid or missing city' })
    }
    next()
}

// POST /participants/add  
router.post('/add', validateParticipant, async (req, res) => {
    const { email, firstname, lastname, dob, work, home } = req.body;
    try {
        await Participant.create({ email, firstname, lastname, dob });
        await WorkDetail.create({ participant_email: email, ...work });
        await HomeDetail.create({ participant_email: email, ...home });
        return res.status(201).jsend.success({
            statusCode: 201,
            result: 'Participant created successfully'
        });
    } catch (error) {
        console.error('Error creating participant:', error);   
        return res.status(500).jsend.error({
            message: `Error creating participant: ${error.name} – ${error.message}`
        });
    }
});

// GET /participants
router.get('/', async (req, res) => {
    try {
        const participants = await Participant.findAll({
            include: [
                { model: WorkDetail, as: 'workDetails' },
                { model: HomeDetail, as: 'homeDetails' }
            ]
        });
        return res.jsend.success({ statusCode: 200, result: participants });
    } catch (error) {
        console.error(error);  
        return res.status(500).jsend.error({
            message: `Failed to retrieve participants: ${error.message}`
        });
    }
});

// GET /participant/details
router.get('/details', async (req, res) => {
    try {
        const details = await Participant.findAll({ attributes: ['email', 'firstname', 'lastname'] });
        return res.jsend.success({ statusCode: 200, result: details })
    } catch (error) {
        console.error(error);
        return res.status(500).jsend.error({ message: 'Failed to retrieve participant details' });
    }
});


// GET /participant/details/:email
router.get('/details/:email', async (req, res) => {
    const { email } = req.params
    try {
        const participant = await Participant.findByPk(email, { attributes: ['firstname', 'lastname', 'dob'] });
        if (!participant) {
            return res.status(400).jsend.fail({ statusCode: 404, result: 'Participant not found' })
        }
        return res.jsend.success({ statusCode: 200, result: participant })
    } catch (error) {
        console.error(error);
        return res.status(500).jsend.error({ message: 'Failed to retrieve participant' });
    }
});

// GET /participants/work/:email
router.get('/work/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const workDetail = await WorkDetail.findOne({ where: { participant_email: email } });
        if (!workDetail) {
            return res.status(404).jsend.fail({ statusCode: 404, result: 'Work details not found' });
        }
        const { companyname, salary, currency } = workDetail;
        return res.jsend.success({ statusCode: 200, result: { companyname, salary, currency } });
    } catch (error) {
        console.error(error);
        return res.status(500).jsend.error({ message: 'Failed to retrieve work details' })
    }
});

// GET /participants/home/ :email
router.get('/home/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const homeDetail = await HomeDetail.findOne({ where: { participant_email: email } });
        if (!homeDetail) {
            return res.status(404).jsend.fail({ statusCode: 404, result: 'Home details not found' })
        }
        const { country, city } = homeDetail;
        return res.jsend.success({ statusCode: 200, result: { country, city } });
    } catch (error) {
        console.error(error);
        return res.status(500).jsend.error({ message: 'Failed to retrive home details' })
    }

});

// DELETE /participants/:email
router.delete('/:email', async (req, res) => {
    const { email } = req.params;
    try {
        await WorkDetail.destroy({ where: { participant_email: email } });
        await HomeDetail.destroy({ where: { participant_email: email } });
        const deletedCount = await Participant.destroy({ where: { email } });
        if (!deletedCount) {
            return res.status(404).jsend.fail({ statusCode: 404, result: 'Participant not found' });
        }
        return res.jsend.success({ statusCode: 200, result: 'Participant deleted successfully' });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .jsend.error({ message: 'Failed to delete participant' });

    }
});

// PUT /participants/:email
router.put('/:email', validateParticipant, async (req, res) => {
    const { email: bodyEmail, firstname, lastname, dob, work, home } = req.body;
    const { email } = req.params;
    if (email !== bodyEmail) {
        return res.status(400).jsend.fail({ statusCode: 400, result: 'URL email and body email must match' });
    }
    try {
        const participant = await Participant.findByPk(email);
        if (!participant) {
            return res.status(404).jsend.fail({ statusCode: 404, result: 'Participant not found' });
        }
        await participant.update({ firstname, lastname, dob });
        await WorkDetail.update({ ...work }, { where: { participant_email: email } })
        await HomeDetail.update({ ...home }, { where: { participant_email: email } });
        return res.jsend.success({ statusCode: 200, result: 'Participant updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).jsend.error({ message: 'Failed to update oarticipant' });
    }
});

module.exports = router;