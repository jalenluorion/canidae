import React, { useState, useEffect, useRef } from 'react';
import './Notes.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

const NoteView = () => {
  const [note, setNote] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [title, setTitle] = useState('');
  const popupRef = useRef(null);

  useEffect(() => {
    const savedNote = Cookies.get('savedNote');
    if (savedNote) {
      setNote(savedNote);
    }

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleNoteChange = (e) => {
    const updatedNote = e.target.value;
    setNote(updatedNote);
    Cookies.set('savedNote', updatedNote, { expires: 7 });
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setTitle('');
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const downloadNote = (e) => {
    e.stopPropagation();
    const downloadTitle = title.trim() ? title : 'Notes';
    const blob = new Blob([note], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${downloadTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setShowPopup(false);
    setTitle('');
  };

  const handleClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setShowPopup(false);
      setTitle('');
    }
  };

  return (
    <div className="container">
      <h1 className="title">
        Notes
        <span onClick={handleDownload} className="menu-icon" style={{ cursor: `pointer` }}>
          <FontAwesomeIcon icon={faDownload} />
        </span>
      </h1>
      <textarea
        value={note}
        className="text-area"
        onChange={handleNoteChange}
        placeholder="Write your notes here..."
      />

      {showPopup && (
        <div
          className="menu-dropdown"
          style={{ position: 'absolute', top: '50px', right: '10px' }}
          ref={popupRef}
        >
          <input
            type="text"
            placeholder="Enter a title"
            value={title}
            onChange={handleTitleChange}
          />
          <button onClick={downloadNote}>Download</button>
          <button onClick={closePopup}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default NoteView;