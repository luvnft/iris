import * as secp from '@noble/secp256k1';
import iris from 'iris-lib';
import localForage from 'localforage';
import { Component } from 'preact';

import logo from '../../assets/img/android-chrome-192x192.png';
import Button from '../components/basic/Button';
import LanguageSelector from '../components/LanguageSelector';
import Helpers from '../Helpers';
import localState from '../LocalState';
import Events from '../nostr/Events';
import { translate as t } from '../translations/Translation';
import SocialNetwork from "../nostr/SocialNetwork";
const bech32 = require('bech32-buffer');

async function login(k) {
  iris.session.login(k);
  setTimeout(() => {
    // TODO remove setTimeout
    localState.get('loggedIn').put(true);
  }, 100);
}

async function nostrLogin(e) {
  e.preventDefault();
  const rpub = await window.nostr.getPublicKey();
  const k = {
    secp256k1: { rpub },
  };
  await login(k);
}

class Login extends Component {
  componentDidMount() {
    const el = document.getElementById('login-form-name');
    el && el.focus();
    // re-render after a while sec to make sure window.nostr is set
    setTimeout(() => this.setState({}), 100);
    setTimeout(() => this.setState({}), 1000);
  }

  async onPasteKey(event) {
    const val = event.target.value;
    if (!val.length) {
      return;
    }
    let k;
    try {
      // old format iris keys were json { priv, pub, epub, epriv }
      // with nostr, secp256k1: { rpub, priv } was added to it
      k = JSON.parse(val);
    } catch (e) {
      /* empty */
    }
    if (!k) {
      // logging in with a hex private key?
      // TODO ask user if it's a private or public key
      if (secp.utils.isValidPrivateKey(val)) {
        k = {
          secp256k1: { priv: val, rpub: secp.schnorr.getPublicKey(val) },
        };
      }
      try {
        const { data, prefix } = bech32.decode(val);
        const hex = Helpers.arrayToHex(data);
        // logging in with a public key?
        if (prefix === 'npub') {
          k = {
            secp256k1: { rpub: hex },
          };
        } else if (prefix === 'nsec') {
          // logging in with a bech32 private key (nsec)
          k = {
            secp256k1: { priv: hex, rpub: secp.schnorr.getPublicKey(hex) },
          };
        }
      } catch (e) {
        console.error(e);
      }
    }
    console.log('k', k);
    if (!k) {
      return;
    }
    console.log('login with', k);
    await login(k);
    event.target.value = '';
    Helpers.copyToClipboard(''); // clear the clipboard
  }

  showCreateAccount(e) {
    e.preventDefault();
    this.setState({ showSwitchAccount: false });
  }

  onLoginFormSubmit(e) {
    e.preventDefault();
    let name = document.getElementById('login-form-name').value;
    iris.session.loginAsNewUser({ name, autofollow: false });
    localState.get('showFollowSuggestions').put(true);
    name &&
      setTimeout(() => {
        SocialNetwork.setMetadata({ name });
      }, 100);
    // follow the developer's nostr key also
    this.base.style = 'display:none';
    const now = Math.floor(Date.now() / 1000);
    Events.notificationsSeenTime = now;
    localForage.setItem('notificationsSeenTime', now);
    setTimeout(() => {
      // TODO remove setTimeout
      localState.get('loggedIn').put(true);
    }, 100);
  }

  onNameChange(event) {
    const val = event.target.value;
    if (
      val.indexOf('"priv"') !== -1 ||
      secp.utils.isValidPrivateKey(val) ||
      val.startsWith('nsec') ||
      val.startsWith('npub')
    ) {
      this.onPasteKey(event);
      event.target.value = '';
      return;
    }
    this.setState({ inputStyle: val.length ? 'text-align: center' : '' });
  }

  renderExistingAccountLogin() {
    return (
      <>
        <input
          id="paste-privkey"
          autoFocus
          onInput={(e) => this.onPasteKey(e)}
          placeholder={t('paste_private_key')}
        />
      </>
    );
  }

  render() {
    return (
      <section id="login">
        <div id="login-content">
          {!this.state.showSwitchAccount ? (
            <form id="login-form" autocomplete="off" onSubmit={(e) => this.onLoginFormSubmit(e)}>
              <div id="create-account">
                <img width="86" height="86" src={logo} alt="iris" />
                <h1>iris</h1>
                <input
                  style={this.state.inputStyle}
                  onInput={(e) => this.onNameChange(e)}
                  autocomplete="off"
                  autocorrect="off"
                  autocapitalize="sentences"
                  spellcheck="off"
                  id="login-form-name"
                  type="text"
                  name="name"
                  placeholder={t('whats_your_name')}
                />
                <p>
                  <Button id="sign-up" type="submit">
                    {t('new_user_go')}
                  </Button>
                </p>
                <br />
                {window.nostr ? (
                  <p>
                    <a href="" onClick={(e) => nostrLogin(e)}>
                      {t('nostr_extension_login')}
                    </a>
                  </p>
                ) : null}
                <p>
                  <a
                    href=""
                    id="show-existing-account-login"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ showSwitchAccount: true });
                    }}
                  >
                    {t('private_key_login')}
                  </a>
                </p>
                <p>
                  <LanguageSelector />
                </p>
              </div>
            </form>
          ) : (
            <div id="existing-account-login">
              <p>
                <a href="" id="show-create-account" onClick={(e) => this.showCreateAccount(e)}>
                  {t('back')}
                </a>
              </p>
              {this.renderExistingAccountLogin()}
            </div>
          )}
        </div>
      </section>
    );
  }
}

class ExistingAccountLogin extends Login {
  render() {
    return this.renderExistingAccountLogin();
  }
}

export { ExistingAccountLogin };
export default Login;
