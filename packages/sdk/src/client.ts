import { HttpClient, type HttpClientOptions } from "./http";
import {
  AccountResource,
  AgentsResource,
  CallerIdsResource,
  CallerTrustResource,
  CallsResource,
  ClientTokensResource,
  MeResource,
  PhoneNumbersResource,
  SmsResource,
  SubEntitiesResource,
  UsageResource,
  WebrtcResource,
} from "./resources";

export interface RevDeskOptions {
  /** Your RevDesk API key. */
  apiKey: string;
  /** API origin. Defaults to `https://api.revdesk.com`. */
  baseUrl?: string;
  /** Custom `fetch` implementation (defaults to the global `fetch`). */
  fetch?: typeof fetch;
  /** Extra headers merged into every request. */
  headers?: Record<string, string>;
}

/**
 * The RevDesk API client.
 *
 * ```ts
 * import { RevDesk } from "@revdesk/sdk";
 *
 * const revdesk = new RevDesk({ apiKey: process.env.REVDESK_API_KEY! });
 * const { data } = await revdesk.phoneNumbers.list();
 * ```
 */
export class RevDesk {
  readonly phoneNumbers: PhoneNumbersResource;
  readonly callerIds: CallerIdsResource;
  readonly calls: CallsResource;
  readonly agents: AgentsResource;
  readonly sms: SmsResource;
  readonly callerTrust: CallerTrustResource;
  readonly usage: UsageResource;
  readonly subEntities: SubEntitiesResource;
  readonly account: AccountResource;
  readonly me: MeResource;
  readonly webrtc: WebrtcResource;
  readonly clientTokens: ClientTokensResource;

  constructor(options: RevDeskOptions) {
    const http = new HttpClient(options satisfies HttpClientOptions);
    this.phoneNumbers = new PhoneNumbersResource(http);
    this.callerIds = new CallerIdsResource(http);
    this.calls = new CallsResource(http);
    this.agents = new AgentsResource(http);
    this.sms = new SmsResource(http);
    this.callerTrust = new CallerTrustResource(http);
    this.usage = new UsageResource(http);
    this.subEntities = new SubEntitiesResource(http);
    this.account = new AccountResource(http);
    this.me = new MeResource(http);
    this.webrtc = new WebrtcResource(http);
    this.clientTokens = new ClientTokensResource(http);
  }
}
