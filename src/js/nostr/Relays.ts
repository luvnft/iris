import { Relay, relayInit } from '../lib/nostr-tools';

import Events from './Events';
import Key from './Key';
import SocialNetwork from './SocialNetwork';
import Subscriptions from './Subscriptions';

const DEFAULT_RELAYS = [
  'wss://eden.nostr.land',
  'wss://nostr.fmt.wiz.biz',
  'wss://relay.damus.io',
  'wss://nostr-pub.wellorder.net',
  'wss://relay.nostr.info',
  'wss://offchain.pub',
  'wss://nos.lol',
  'wss://brb.io',
  'wss://relay.snort.social',
  'wss://relay.current.fyi',
  'wss://nostr.relayer.se',
];

const SEARCH_RELAYS = ['wss://relay.nostr.band'];

const defaultRelays = new Map<string, Relay>(
  DEFAULT_RELAYS.map((url) => [url, relayInit(url, (id) => Events.cache.has(id))]),
);

const searchRelays = new Map<string, Relay>(
  SEARCH_RELAYS.map((url) => [url, relayInit(url, (id) => Events.cache.has(id))]),
);

export default {
  relays: defaultRelays,
  searchRelays: searchRelays,
  getStatus: (relay: Relay) => {
    // workaround for nostr-tools bug
    try {
      return relay.status;
    } catch (e) {
      return 3;
    }
  },
  getConnectedRelayCount: function () {
    let count = 0;
    for (const relay of this.relays.values()) {
      if (this.getStatus(relay) === 1) {
        count++;
      }
    }
    return count;
  },
  connect: function (relay: Relay) {
    try {
      relay.connect();
    } catch (e) {
      console.log(e);
    }
  },
  manage: function () {
    const go = () => {
      for (const relay of this.relays.values()) {
        if (relay.enabled !== false && this.getStatus(relay) === 3) {
          this.connect(relay);
        }
      }
      for (const relay of this.searchRelays.values()) {
        if (this.getStatus(relay) === 3) {
          this.connect(relay);
        }
      }
    };

    for (const relay of this.relays.values()) {
      relay.on('notice', (notice) => {
        console.log('notice from ', relay.url, notice);
      });
    }
    for (const relay of this.searchRelays.values()) {
      relay.on('notice', (notice) => {
        console.log('notice from ', relay.url, notice);
      });
    }

    go();

    setInterval(go, 10000);
  },
  add(url: string) {
    if (this.relays.has(url)) return;
    const relay = relayInit(url, (id) => Events.cache.has(id));
    relay.on('connect', () => Subscriptions.resubscribe(relay));
    relay.on('notice', (notice) => {
      console.log('notice from ', relay.url, notice);
    });
    this.relays.set(url, relay);
  },
  remove(url: string) {
    try {
      this.relays.get(url)?.close();
    } catch (e) {
      console.log('error closing relay', e);
    }
    this.relays.delete(url);
  },
  restoreDefaults() {
    this.relays.clear();
    for (const url of DEFAULT_RELAYS) {
      this.add(url);
    }
    this.saveToContacts();
    // do not save these to contact list
    for (const url of SEARCH_RELAYS) {
      if (!this.relays.has(url)) this.add(url);
    }
  },
  saveToContacts() {
    const relaysObj: any = {};
    for (const url of this.relays.keys()) {
      relaysObj[url] = { read: true, write: true };
    }
    const existing = SocialNetwork.followEventByUser.get(Key.getPubKey());
    const content = JSON.stringify(relaysObj);

    const event = {
      kind: 3,
      content,
      tags: existing?.tags || [],
    };
    Events.publish(event);
  },
};
