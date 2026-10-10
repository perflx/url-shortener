export class InvalidCredentialsError extends Error{
    constructor(){
        super("Invalid email or password");
        this.name = "InvalidCredentialsError";
    }
}

export class ExistingUserError extends Error{
    constructor(){
        super("The user already exists");
        this.name = "ExistingUserError";
    }
}

export class UserNotFoundError extends Error{
    constructor(){
        super("The User was not found");
        this.name = "UserNotFoundError";
    }
}

export class BadRequestError extends Error{
    constructor(){
        super("Bad Request");
        this.name = "BadRequestError";
    }
}

export class InvalidTokenError extends Error{
    constructor(){
        super("The token is invalid");
        this.name = "InvalidTokenError";
    }
}