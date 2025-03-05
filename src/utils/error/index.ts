class CustomError extends Error {
    public status: number;
    public errorMessage: string;
  
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.errorMessage = message;
    }
  }
  
  export { CustomError };
  