import { route } from 'preact-router';

export default function AccountName({ name, link = true }) {
  return (
    <>
      <p>
        Username: <b>{name}</b>
      </p>
      <p>
        Short link:{' '}
        {link ? (
          <a
            href={`https://iam.hahz.live/${name}`}
            onClick={(e) => {
              e.preventDefault();
              route(`/${name}`);
            }}
          >
            iam.hahz.live/{name}
          </a>
        ) : (
          <>iam.hahz.live/{name}</>
        )}
      </p>
      <p>
        Nostr address (nip05): <b>{name}@iam.hahz.live</b>
      </p>
    </>
  );
}
