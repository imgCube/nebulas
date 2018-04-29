import * as Neb from 'nebulas'
import NebulasAPI from "./NebulasAPI"

export default class Nebulas {
  private readonly underlyingInstance: any

  public api: NebulasAPI

  constructor(public apiUrl: string = "") {
    this.underlyingInstance = new Neb.Neb()
    this.underlyingInstance.setRequest(new Neb.HttpRequest(apiUrl))

    this.api = new NebulasAPI(this.underlyingInstance)
  }
}
