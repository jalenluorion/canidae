import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import './Notes.css';
import './ViewsSide.css'

const FilesView = () => {
  return (
    <div className="container slide-right">
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
  );
};

export default FilesView;