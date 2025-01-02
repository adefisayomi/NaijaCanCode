import { errorMessage } from "~/src/constants";
import { Code } from "../schemas/code";

export interface SaveCodeParams {
  userId: string;
  codePayload: {
    html: string;
    css: string;
    js: string;
  };
}

interface SaveCodeResponse {
  success: boolean;
  message: string | null;
  data?: {
    code: string;
  } | any;
}

export async function saveCode({ userId, codePayload }: SaveCodeParams){
  try {
    if (!userId) {
      throw new Error("Invalid request: User ID is required.");
    }

    // Fetch or create a user code document
    let userCode = await Code.findOne({ userId });
    if (!userCode) {
      userCode = new Code({ userId });
    }

    // Update the code and save
    userCode.code = codePayload;
    await userCode.save();

    return {
      success: true,
      message: null,
      data: {
        code: userCode.code,
      },
    };
  } catch (err: unknown) {
    // Handle any errors
    const errorMsg = err instanceof Error ? err.message : "An unknown error occurred.";
    return errorMessage(errorMsg);
  }
}

export async function getCode(userId: string): Promise<SaveCodeResponse> {
    try {
      if (!userId) {
        throw new Error("Invalid request: User ID is required.");
      }
  
      // Fetch or create a user code document
      let userCode = await Code.findOne({ userId });

      console.log(userCode?.code)
  
      return {
        success: true,
        message: null,
        data: {
          code: userCode?.code || '',
        },
      };
    } catch (err: unknown) {
      // Handle any errors
      const errorMsg = err instanceof Error ? err.message : "An unknown error occurred.";
      return errorMessage(errorMsg);
    }
  }
