import { errorMessage } from "~/src/constants";
import { User } from "../schemas/user";
import argon from "argon2";
import isEmail from "email-validator";


async function createUser(label: "email" | "username", id: string, password: string) {
    const hashedPassword = await argon.hash(password);
    const newUser = new User({ [label]: id, password: hashedPassword });
    await newUser.save();
    return newUser;
}

export async function signinUser(id: string, password: string) {
    try {
        if (!id || !password) throw new Error("Email/Username and password are required.");

        // Determine label based on the input format
        const label: "email" | "username" = isEmail.validate(id) ? "email" : "username";

        // Find the user
        let user = await User.findOne({ [label]: id });
        if (!user) {
            // If user doesn't exist, create a new one
            user = await createUser(label, id, password);
        }

        // Verify the password
        const passwordMatch = await argon.verify(user.password, password);
        if (!passwordMatch) throw new Error("Invalid email/username or password.");

        // Return the user data
        return {
            success: true,
            message: "Signed in successfully.",
            data: {
                [label]: user[label],
                id: user._id,
                name: user.name,
            },
        };
    } catch (err: any) {
        return errorMessage(err.message || "An unknown error occurred.");
    }
}


// export async function createUser(id: string, password: string) {
//     try {
//         if (!id || !password) throw new Error("Invalid request!");

//         const label = isEmail.validate(id) ? "email" : "username";
//         const userAlreadyExist = await User.exists({ [label]: id });
//         if (userAlreadyExist) throw new Error(`User with the same ${label} already exists!`);

//         const hashPassword = await argon.hash(password);
//         const user = new User({ [label]: id, password: hashPassword });
//         await user.save();

//         return {
//             success: true,
//             message: "User created successfully!",
//             data: {
//                 [label]: user[label],
//                 id: user._id,
//                 name: user.name,
//             },
//         };
//     } catch (err: any) {
//         return errorMessage(err.message || "An unknown error occurred.");
//     }
// }

export async function getUser(id: string) {
    try {
        if (!id) throw new Error("Invalid request!");

        const label = isEmail.validate(id) ? "email" : "username";
        const user = await User.findOne({ $or: [{ email: id }, { username: id }] });
        if (!user) throw new Error("User does not exist!");

        return {
            success: true,
            message: null,
            data: {
                [label]: user[label],
                id: user._id,
                name: user.name,
            },
        };
    } catch (err: any) {
        return errorMessage(err.message || "An unknown error occurred.");
    }
}

export async function deleteUser(id: string) {
    try {
        if (!id) throw new Error("Invalid request!");

        const label = isEmail.validate(id) ? "email" : "username";
        const result = await User.deleteOne({ $or: [{ email: id }, { username: id }] });

        if (result.deletedCount === 0) throw new Error("User not found or already deleted.");

        return {
            success: true,
            message: "User deleted successfully!",
        };
    } catch (err: any) {
        return errorMessage(err.message || "An unknown error occurred.");
    }
}

export async function updateUser(id: string, payload: Partial<{ email: string; username: string; name: string; password: string }>) {
    try {
        if (!id || !payload || Object.keys(payload).length === 0) throw new Error("Invalid request!");

        const user = await User.findById(id);
        if (!user) throw new Error("User not found!");

        if (payload.password) {
            payload.password = await argon.hash(payload.password); // Hash the new password
        }

        Object.assign(user, payload);
        await user.save();

        return {
            success: true,
            message: "User updated successfully!",
            data: {
                id: user._id,
                email: user.email,
                username: user.username,
                name: user.name,
            },
        };
    } catch (err: any) {
        return errorMessage(err.message || "An unknown error occurred.");
    }
}
