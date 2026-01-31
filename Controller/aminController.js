import User from "../Models/userModel.js";
import transporter from "../Config/nodemailerAuth.js";


export const addUer = async (req, res) => {
    try {
        const { name, email, phone, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = await User.create({
            name,
            email,
            phone,
            role
        });
        let inviteURL = `http://localhost:8080/api/v1/auth/role-setup/${newUser._id}`;

        // Send role notification email
        const mailOptions = {
            // from: process.env.EMAIL_USER,
            to: email,
            subject: 'Role Assigned',
            text: `Hello ${name},\n\nYou have been assigned the role of ${role}.\n\n
            set up your account by visiting the following link: ${inviteURL}
            \n\nBest regards,\nTeam`
        };
        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: "User added successfully", user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role
        } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};