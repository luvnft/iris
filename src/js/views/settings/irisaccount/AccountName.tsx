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
            href={`https://iam.luvnft.com/${name}`}
            onClick={(e) => {
              e.preventDefault();
              route(`/${name}`);
            }}
          >
            iam.luvnft.com/{name}
          </a>
        ) : (
          <>iam.luvnft.com/{name}</>
        )}
      </p>
      <p>
        Nostr address (nip05): <b>{name}@iam.luvnft.com</b>
      </p>
    </>
  );
}
