/** A registration the system refuses, with a message meant for the form. */
export class SignUpError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SignUpError";
  }
}
