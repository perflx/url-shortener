export class AppError extends Error{
    statusCode: number;
    constructor(message: string, statusCode: number){
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
    }
}

export class InvalidCredentialsError extends AppError{
    constructor(){
        super("Invalid email or password", 401);
        this.name = "InvalidCredentialsError";
    }
}

export class ExistingUserError extends AppError{
    constructor(){
        super("The user already exists", 409);
        this.name = "ExistingUserError";
    }
}

export class UserNotFoundError extends AppError{
    constructor(){
        super("The User was not found", 404);
        this.name = "UserNotFoundError";
    }
}

export class BadRequestError extends AppError{
    constructor(){
        super("Bad Request", 400);
        this.name = "BadRequestError";
    }
}

export class InvalidTokenError extends AppError{
    constructor(){
        super("The token is invalid", 401);
        this.name = "InvalidTokenError";
    }
}

export class InvalidURLError extends AppError{
    constructor() {
        super("The URL is invalid", 400);
        this.name = "InvalidURLError";
    }
}

export class LongLinkError extends InvalidURLError{
    constructor(){
        super();
        this.name = "LongLinkError";
    }
}

export class NotExistingURLError extends AppError{
    constructor(){
        super("The link doesn't exists", 404);
        this.name = "NotExistingURLError";
    }
}