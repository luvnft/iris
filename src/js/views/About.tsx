import { Link } from 'preact-router';

import Show from '@/components/helpers/Show';
import { RouteProps } from '@/views/types';

import Follow from '../components/buttons/Follow';
import Header from '../components/header/Header.tsx';
import Avatar from '../components/user/Avatar';
import Name from '../components/user/Name';
import { translate as t } from '../translations/Translation.mjs';
import Helpers from '../utils/Helpers';

const IAM_INFO_ACCOUNT = 'npub1052tld39024jy5pn9a5clv8nddaxe8pywz63ul4ns9h483c3ye9qsn7jxu';

const About: React.FC<RouteProps> = () => (
  <>
    <Header />
    <div className="prose main-view">
      <div className="px-2 py-2 md:px-4">
        <h2 className="mt-0">{t('about')}</h2>
        <p>IAM is a postive vibes only social network with no weird algorithms:</p>
        <ul>
          <li>
            <b>Accessible.</b> No phone number or signup is required. Just type in your name or
            alias and go!
          </li>
          <li>
            <b>Secure.</b> It's open source. You can verify that your data stays safe.
          </li>
          <li>
            <b>Always available.</b> It works offline-first and is not dependent on any single
            centrally managed server. Users can even connect directly to each other.
          </li>
        </ul>

        <Show when={!Helpers.isStandalone()}>
          <h3>Versions</h3>
          <p>
            <ul>
              <li>
                <a target="_blank" href="https://iam.hahz.live">
                  iam.hahz.live
                </a>{' '}
                (web)
              </li>
              <li>
                <a target="_blank" href="https://github.com/luv-nft/iris-messenger/releases/latest">
                  Desktop
                </a>{' '}
                (macOS, Windows, Linux)
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://apps.apple.com/app/iris-the-nostr-client/id1665849007"
                >
                  iOS
                </a>
              </li>
              <li>
                <a target="_blank" href="https://play.google.com/store/apps/details?id=to.iris.twa">
                  Android
                </a>{' '}
                (
                <a
                  target="_blank"
                  href="https://github.com/irislib/iris-messenger/releases/tag/jan2023"
                >
                  apk
                </a>
                )
              </li>
            </ul>
          </p>
        </Show>

        <h3>IAM docs</h3>
        <p>
          Visit IAM <a href="https://github.com/irislib/faq">FAQ</a> for features, explanations and
          troubleshooting.
        </p>

        <h3>Privacy</h3>
        <p>{t('application_security_warning')}</p>

        <h3>Follow</h3>
        <div className="flex flex-row items-center justify-between w-full">
          <Link href={`/${IAM_INFO_ACCOUNT}`} className="flex flex-row items-center gap-2">
            <Avatar str={IAM_INFO_ACCOUNT} width={40} />
            <Name pub={IAM_INFO_ACCOUNT} placeholder="IAM" />
          </Link>
          <Follow className="btn btn-neutral btn-sm" id={IAM_INFO_ACCOUNT} />
        </div>

        <p>
          <a href="https://t.me/+hLW5h98XO8llOTJh">Telegram</a> channel.
        </p>

        <p>
          Released under MIT license. Code:{' '}
          <a href="https://github.com/luvnft/iris-messenger">Github</a>.
        </p>
        <br />
      </div>
    </div>
  </>
);

export default About;
