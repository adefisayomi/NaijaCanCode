import { errorMessage } from "~/src/constants";
import { Account, IAccount } from "../schemas/account";
import argon2 from 'argon2'
import emailValidator from 'email-validator'


export async function createAccount(payload: IAccount): Promise<{ success: boolean; message: string | null; data: any }> {
  try {
    const { username, password } = payload;

    if (!username || !password) {
      throw new Error('Invalid data! Username and password are required.');
    }

    // Check if the account already exists
    const accountExists = await Account.findOne({ username }).select('+password'); // Include password for verification
    if (accountExists) {
      // If the account exists, verify the password (login scenario)
      const passwordMatch = await argon2.verify(accountExists.password, password);
      if (!passwordMatch) {
        throw new Error('Invalid password!');
      }

      // Return existing account without password
      return {
        success: true,
        message: 'Login successful!',
        data: accountExists.toObject({ transform: (_, ret) => { delete ret.password; return ret; } }),
      };
    }

    // Signup scenario: Hash the password and create a new account
    const passwordHash = await argon2.hash(password);
    const newAccount = new Account({ username, password: passwordHash });

    await newAccount.save();

    // Return the newly created account without password
    return {
      success: true,
      message: 'Account created successfully!',
      data: newAccount.toObject({ transform: (_, ret) => { delete ret.password; return ret; } }),
    };
  } catch (error: any) {
    // Return error message in a consistent format
    return {
      success: false,
      message: error.message || 'An unexpected error occurred!',
      data: null,
    };
  }
}


  export async function getAccount (id: string) {
    try {
        const account = await Account.findOne({$or: [{email: id}, {username: id}]}).select('-password')
        return ({
            success: true,
            message: null,
            data: account
        })
    }
    catch(err: any) {
        return errorMessage(err.message)
    }
  }