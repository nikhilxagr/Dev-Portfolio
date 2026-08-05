export class AIProvider {
  // eslint-disable-next-line no-unused-vars
  async streamChat({ prompt, onToken, onComplete, onError }) {
    throw new Error(
      `[AIProvider] streamChat() must be implemented by ${this.constructor.name}`
    );
  }

  get name() {
    return this.constructor.name;
  }
}
