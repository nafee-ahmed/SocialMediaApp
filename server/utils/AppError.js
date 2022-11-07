class AppError extends Error{  // formats error response
    constructor(message, status){
        super();
        this.message = message;
        this.status = status;
    }
}

module.exports = AppError;