import { LanguageIcon } from '@heroicons/react/24/solid';
import { route } from 'preact-router';

import Show from '../../components/helpers/Show';
import localState from '../../state/LocalState.ts';
import { translate as t } from '../../translations/Translation.mjs';

const SETTINGS = {
  account: 'account',
  appearance: 'appearance',
  content: 'content',
  payments: 'payments',
  network: 'network',
  backup: 'backup',
  language: 'language',
  social_network: 'social_network',
  iris_account: undefined as string | undefined,
};

if (['iam.hahz.live', 'beta.iris.to', 'localhost'].includes(window.location.hostname)) {
  SETTINGS.iris_account = 'iam.hahz.live';
}

const SettingsMenu = (props) => {
  const activePage = props.activePage || 'account';

  const menuLinkClicked = (url, e) => {
    e.preventDefault();
    localState.get('toggleSettingsMenu').put(false);
    localState.get('scrollUp').put(true);
    route(`/settings/${url}`);
  };

  return (
    <div
      className={`flex-col w-full md:w-48 flex-shrink-0 ${
        !props.activePage ? 'flex' : 'hidden md:flex'
      }`}
    >
      {Object.keys(SETTINGS).map((page) => {
        if (!SETTINGS[page]) return null;
        return (
          <a
            href="#"
            className={`btn inline-flex w-auto flex items-center p-3 rounded-full transition-colors duration-200 hover:bg-neutral-900 ${
              activePage === page && window.innerWidth > 640 ? 'active' : ''
            }`}
            onClick={(e) => menuLinkClicked(page, e)}
            key={page}
          >
            <span class="text">{t(SETTINGS[page])}</span>
            <Show when={page === 'language'}>
              <LanguageIcon width={16} />
            </Show>
          </a>
        );
      })}
    </div>
  );
};

export default SettingsMenu;
