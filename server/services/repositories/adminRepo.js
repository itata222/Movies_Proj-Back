const Admin = require('../../models/adminModel');

const createAdmin = async (adminObj) => {
    try {
        const admin = new Admin(adminObj);
        const token = await admin.generateAuthToken();
        return { admin, token };
    } catch (e) {
        return e.message
    }
}

module.exports = { createAdmin };