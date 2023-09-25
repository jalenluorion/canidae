import React from 'react';
import { CSSTransition } from 'react-transition-group';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import './Notes.css';
import './ViewsSide.css'

const FilesView = ({ visible }) => {
  return (
    <CSSTransition
      in={visible}
      timeout={200}
      classNames="slide-left"
      unmountOnExit
    >
      <div className="container slide-right" style={{ zIndex: visible ? 1 : 0 }}>
        <div className="top-bar">
          <div className="title">
            <h1>
              My Files (Soon)
            </h1>
            <button className="menu-icon" style={{ cursor: `pointer` }}>
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default FilesView;