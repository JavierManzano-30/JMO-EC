import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  conversations,
  filterConversations,
  sortConversations,
} from '../../services/conversations';
import { mergeSearchParams, readSearchParams } from '../../services/urlState';
import { getScrollPosition, setScrollPosition } from '../../services/scroll';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguas' },
  { value: 'title', label: 'Título (A-Z)' },
];

const DEFAULT_SORT = SORT_OPTIONS[0].value;

const ConversationsView = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT);
  const scrollContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const scrollKey = useMemo(() => {
    const trimmed = (searchTerm || '').trim();
    return `conversations::${sortOrder}::${trimmed.toLowerCase()}`;
  }, [searchTerm, sortOrder]);

  const syncFromUrl = useCallback(() => {
    const params = readSearchParams();
    const urlSearch = params.get('q') ?? '';
    const urlSort = params.get('sort');

    setSearchTerm(urlSearch);

    if (urlSort && SORT_OPTIONS.some((option) => option.value === urlSort)) {
      setSortOrder(urlSort);
    } else {
      setSortOrder(DEFAULT_SORT);
    }
  }, []);

  useEffect(() => {
    syncFromUrl();
    const handlePopstate = () => {
      syncFromUrl();
    };

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [syncFromUrl]);

  useEffect(() => {
    searchInputRef.current?.focus({ preventScroll: true });
  }, []);

  const filteredConversations = useMemo(() => {
    const filtered = filterConversations(conversations, searchTerm);
    return sortConversations(filtered, sortOrder);
  }, [searchTerm, sortOrder]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    mergeSearchParams(
      {
        view: 'conversations',
        q: value.trim() ? value : '',
      },
      { replace: true },
    );
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortOrder(value);
    mergeSearchParams(
      {
        view: 'conversations',
        sort: value,
      },
      { replace: true },
    );
  };

  const handleOpenConversation = (conversationId) => {
    const container = scrollContainerRef.current;
    if (container) {
      setScrollPosition(scrollKey, container.scrollTop);
    }
    navigate?.('conversation', {
      params: { id: conversationId },
    });
  };

  const handleScroll = (event) => {
    setScrollPosition(scrollKey, event.currentTarget.scrollTop);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const restorePosition = () => {
      const stored = getScrollPosition(scrollKey);
      container.scrollTo({ top: stored, behavior: 'auto' });
    };

    if (document.readyState === 'complete') {
      restorePosition();
    } else {
      window.requestAnimationFrame(restorePosition);
    }
  }, [scrollKey, filteredConversations.length]);

  useEffect(() => () => {
    const container = scrollContainerRef.current;
    if (container) {
      setScrollPosition(scrollKey, container.scrollTop);
    }
  }, [scrollKey]);

  return (
    <section className="view-section" aria-labelledby="conversations-view-title">
      <header className="view-header">
        <h2 id="conversations-view-title">Conversaciones</h2>
        <p>Consulta el historial de conversaciones guardadas para retomarlas más tarde.</p>
      </header>

      <div
        className="view-content view-content--list"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <form className="conversation-filters" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="conversation-search" className="form-field">
            Buscar
            <input
              id="conversation-search"
              type="search"
              value={searchTerm}
              placeholder="Buscar por título o descripción"
              onChange={handleSearchChange}
              ref={searchInputRef}
            />
          </label>

          <label htmlFor="conversation-sort" className="form-field">
            Orden
            <select id="conversation-sort" value={sortOrder} onChange={handleSortChange}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </form>

        <ul className="conversation-list">
          {filteredConversations.map((conversation) => (
            <li key={conversation.id} className="conversation-item">
              <h3>{conversation.title}</h3>
              <p>{conversation.summary}</p>
              <div className="conversation-item__meta">
                <span>Actualizada: {new Date(conversation.updatedAt).toLocaleString()}</span>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => handleOpenConversation(conversation.id)}
                >
                  Ver conversación
                </button>
              </div>
            </li>
          ))}
          {filteredConversations.length === 0 && (
            <li className="conversation-item conversation-item--empty">
              <p>No hay conversaciones que coincidan con la búsqueda.</p>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
};

export default ConversationsView;

