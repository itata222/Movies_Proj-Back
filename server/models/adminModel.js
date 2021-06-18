const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true,
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ]
    },
    {
        timestamps: true,
    }
);


adminSchema.pre("save", async function (next) {
    const admin = this;

    if (admin.isModified("password")) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }

    next();
});

adminSchema.statics.findAdminbyEmailAndPassword = async (email, password) => {
    const admin = await Admin.findOne({ email });
    if (!admin) {
        throw new Error("unable to login");
    }
    const isPassMatch = await bcrypt.compare(password, admin.password);
    if (!isPassMatch) {
        throw new Error("unable to login");
    }

    return admin;
};

adminSchema.methods.generateAuthToken = async function () {
    const admin = this;
    const token = jwt.sign(
        {
            _id: admin._id,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "6h"
        }
    );
    admin.tokens = admin.tokens.concat({ token });
    await admin.save();
    return token;
};

adminSchema.methods.toJSON = function () {
    const admin = this;
    const adminObj = admin.toObject();

    delete adminObj.password;
    delete adminObj.tokens;

    return adminObj;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;