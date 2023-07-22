import { debounce } from 'lodash';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';

import Events from '../../../nostr/Events';
import Key from '../../../nostr/Key';
import { translate as t } from '../../../translations/Translation.mjs';
import For from '../../helpers/For';
import Show from '../../helpers/Show';
import EventComponent from '../EventComponent';

import Avatar from './Avatar';
import Content from './Content';

const Note = ({
  event,
  meta,
  asInlineQuote,
  isReply, // message that is rendered under a standalone message, separated by a small margin
  isQuote, // message that connects to the next message with a line
  isQuoting, // message that is under an isQuote message, no margin
  showReplies,
  showRepliedMsg,
  standalone,
  fullWidth,
}) => {
  const [replies, setReplies] = useState([] as string[]);

  showReplies = showReplies || 0;
  if (!standalone && showReplies && replies.length) {
    isQuote = true;
  }
  if (meta.replyingTo && showRepliedMsg) {
    isQuoting = true;
  }

  if (showRepliedMsg === undefined) {
    showRepliedMsg = standalone;
  }

  if (fullWidth === undefined) {
    fullWidth = !isReply && !isQuoting && !isQuote && !asInlineQuote;
  }

  useEffect(() => {
    if (standalone) {
      return Events.getReplies(
        event.id,
        debounce(
          (replies) => {
            const arr = Array.from(replies).slice(0, showReplies) as string[];
            arr.sort((a, b) => {
              const aEvent = Events.db.by('id', a);
              const bEvent = Events.db.by('id', b);
              return aEvent.created_at - bEvent.created_at;
            });
            setReplies(arr);
          },
          500,
          { leading: true, trailing: true },
        ),
      );
    }
  }, [event.id, standalone, showReplies]);

  meta = meta || {};

  let rootMsg = Events.getEventRoot(event);
  if (!rootMsg) {
    rootMsg = meta.replyingTo;
  }

  function messageClicked(clickEvent) {
    if (standalone) {
      return;
    }
    if (['A', 'BUTTON', 'TEXTAREA', 'IMG', 'INPUT'].find((tag) => clickEvent.target.closest(tag))) {
      return;
    }
    if (window.getSelection()?.toString()) {
      return;
    }
    clickEvent.stopPropagation();
    if (event.kind === 7) {
      const likedId = event.tags?.reverse().find((t) => t[0] === 'e')[1];
      return route(`/${likedId}`);
    }
    route(`/${Key.toNostrBech32Address(event.id, 'note')}`);
  }

  function getClassName() {
    const classNames = ['msg'];

    if (standalone) {
      classNames.push('standalone');
    } else {
      classNames.push(
        'cursor-pointer transition-all ease-in-out duration-200 hover:bg-neutral-999',
      );
    }
    if (isQuote) classNames.push('quote pb-2');
    if (isQuoting) classNames.push('quoting pt-0');
    if (asInlineQuote) classNames.push('inline-quote border-2 border-neutral-900 rounded-lg my-2');
    if (fullWidth) classNames.push('full-width');

    return classNames.join(' ');
  }

  const repliedMsg = (
    <Show when={meta.replyingTo && showRepliedMsg}>
      <EventComponent
        key={event.id + meta.replyingTo}
        id={meta.replyingTo}
        isQuote={true}
        showReplies={0}
      />
    </Show>
  );

  const showThreadBtn = (
    <Show when={!standalone && !isReply && !isQuoting && rootMsg}>
      <a
        className="text-iris-blue text-sm block mb-2"
        href={`/${Key.toNostrBech32Address(rootMsg || '', 'note')}`}
      >
        {t('show_thread')}
      </a>
    </Show>
  );

  return (
    <>
      {repliedMsg}
      <div
        key={event.id + 'note'}
        className={`p-2 ${getClassName()}`}
        onClick={(e) => messageClicked(e)}
      >
        {showThreadBtn}
        <div className="flex flex-row" onClick={(e) => messageClicked(e)}>
          <Show when={!fullWidth}>
            <Avatar event={event} isQuote={isQuote} standalone={standalone} />
          </Show>
          <Content
            event={event}
            meta={meta}
            standalone={standalone}
            isQuote={isQuote}
            isQuoting={isQuoting}
            asInlineQuote={asInlineQuote}
            fullWidth={fullWidth}
          />
        </div>
      </div>
      <Show when={!(isQuote || asInlineQuote)}>
        <hr className="-mx-2 opacity-10 mb-2" />
      </Show>
      <For each={replies}>
        {(r) => (
          <EventComponent key={r} id={r} isReply={true} isQuoting={!standalone} showReplies={1} />
        )}
      </For>
    </>
  );
};

export default Note;