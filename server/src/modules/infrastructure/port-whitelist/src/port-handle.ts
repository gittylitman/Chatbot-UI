/**
 * Holds a lazily-initialized port.
 * Decorator arguments are sent before Nest lifecycle, but we need to give them a port reference.
 * So lets create a reference, and initialize it only after Nest gives us an actual port.
 */
export class PortHandle {
  private _port!: number;

  public bindPort(port: number): void {
    this._port = port;
  }

  public get port(): number {
    return this._port;
  }
}
