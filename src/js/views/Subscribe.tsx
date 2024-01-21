import { RouteProps } from '@/views/types';

import Header from '../components/header/Header.tsx';
import { translate as t } from '../translations/Translation.mjs';

const Subscribe: React.FC<RouteProps> = () => (
  <>
    <Header />
    <div className="main-view" id="settings">
      <div className="centered-container mobile-padding15">
        <h2>{t('subscribe')}</h2>
        <h3>IAM Supporter</h3>
        <p>Support open source development and get extra features!</p>
        <p>
          <ul>
            <li>IAM Supporter Badge</li>
            <li>Purple checkmark on IAM</li>
            <li>IAM Supporters' private group chat</li>
            {/*
                :D
                  <li>Email-DM bridge for your IAM address</li>
                  <li>Bitcoin Lightning proxy for your IAM address</li>
                  <li>Custom themes for your profile page</li>
                  <li>Profile view statistics</li>
                */}
            <li>More features to come!</li>
          </ul>
        </p>
        <p>
          <input
            defaultChecked={true}
            type="radio"
            id="subscription_annually"
            name="subscription"
            value="1"
          />
          <label htmlFor="subscription_annually">
            <b>8 € / month</b> charged annually (96 € / year)
          </label>
        </p>
        <p>
          <input type="radio" id="subscription_monthly" name="subscription" value="2" />
          <label htmlFor="subscription_monthly">
            <b>10 € / month</b> charged monthly (120 € / year)
          </label>
        </p>
        <p>
          <button className="btn btn-primary">Subscribe</button>
        </p>

        <h3>IAM LUV</h3>
        <p>
          True LUV status. Lifetime IAM Purple access, plus:
          <ul>
            <li>IAM LUV Badge</li>
            <li>IAM LUV private group chat</li>
            <li>Priority support</li>
          </ul>
        </p>
        <p>
          <b>1000 €</b> one-time payment.
        </p>
        <p>
          <button className="btn btn-primary">Subscribe</button>
        </p>
        <br />
        <br />
      </div>
    </div>
  </>
);

export default Subscribe;
