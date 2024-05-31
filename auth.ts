import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Get the token from the 'token' cookie
        const token = req.cookies.token;

        if (!token) {
            res.status(401).send({ message: "Unauthorized: Token not found" });
        }

        // Check if the token is valid
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");

        // Assign the decoded token to req.user
        req.user = decodedToken;

        // Pass down functionality to the endpoint
        next();
        
    } catch (error) {
        res.status(401).send({ message: "Unauthorized: Invalid token" });
    }
}

export interface AuthRequest extends Request {
    user?: string | JwtPayload;
}

export default auth;