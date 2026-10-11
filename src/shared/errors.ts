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

export class InvalidURLError extends Error{
    constructor() {
        super("The URL is invalid");
        this.name = "InvalidURLError";
    }
}

export class LongLinkError extends Error{
    constructor(){
        super("The link is too long");
        this.name = "LongLinkError";
    }
}

export class NotExistingURLError extends Error{
    constructor(){
        super("The link doesn't exists");
        this.name = "NotExistingURLError";
    }
}