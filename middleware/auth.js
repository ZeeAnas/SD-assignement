const basicAuth = require('basic-auth');
const { Admin } = require('../models');

async function  authenticateAdmin(req, res, next) {
    const creds = basicAuth(req);
    if (!creds || !creds.name || !creds.pass) {
        return res
        .status(401)
        .set('WWW-Authenticate', 'Basic realm="Admin Area"')
        .json({ error: 'Missing credentials'});
    }
    const admin = await Admin.findByPk(creds.name);
    if(!admin || admin.password !== creds.pass) {
        return res
        .status(401)
        .set('WWW-Authenticate', 'Basic realm="Admin Area"')
        .json({ error: 'Invalid credentials'});
    }
    next()
}

module.exports = authenticateAdmin