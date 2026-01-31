import User from "../Models/userModel.js";
import generateToken from "../Utils/generateToken.js";


export const registerAdmin = async (req, res) => {
    const { name, email, password, phone, adminCode } = req.body;
    try {
        if (adminCode != process.env.ADMIN_CODE) {
            return res.status(403).json({ message: "Invalid admin code" });
        }
        // console.log("admin code verified");
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // console.log("no existing user found, proceeding to create admin");
        const newUser = await User.create({
            name,
            email,
            password,
            phone,
            role: 'admin'
        });
        res.status(201).json({ message: "Admin registered successfully", user: {
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

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password -resettoken -resettokenexpiry');
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId, '-password -resettoken -resettokenexpiry');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.role = role;
        await user.save();
        res.status(200).json({ message: "User role updated successfully", user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, phone, profilePic } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.profilePic = profilePic || user.profilePic;
        await user.save();
        res.status(200).json({ message: "User profile updated successfully", user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profilePic: user.profilePic
        } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }, '-password -resettoken -resettokenexpiry');
        res.status(200).json({ admins });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId, '-password -resettoken -resettokenexpiry');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try{
        const {email , password} = req.body;
        const user = await User.findOne({ email});
        if(!user){
            return res.status(400).json({ message: "Invalid email or password"});
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid email or password"});
        }
        if(!user.isrRoleAccepted){
            return res.status(403).json({ message: "Verify your email to accept your role" });
        }
        await generateToken(user._id , res);
        res.status(200).json({ message: "User logged in successfully", user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error });
    }
};

export const acceptUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isrRoleAccepted = true;
        await user.save();
        res.status(200).json({ message: "User role accepted successfully", user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isrRoleAccepted: user.isrRoleAccepted
        } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};