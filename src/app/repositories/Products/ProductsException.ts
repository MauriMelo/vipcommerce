export default class ProductsException {
  public code = 500;

  public message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
}
