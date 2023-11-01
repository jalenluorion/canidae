import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { CSSTransition } from 'react-transition-group';
import { useAsyncValue } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { api } from '../../Helper';
import './Notes.css';
import './ViewsSide.css';

const NoteView = ({ visible }) => {
  const noteList = useAsyncValue();
  const [notes, setNotes] = useState(noteList ? (noteList.lists) : (Cookies.get('savedNotes') ? JSON.parse(Cookies.get('savedNotes')) : {}));
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('8');
  const [noteTimeout, setNoteTimeout] = useState(null);

  const popupRef = useRef(null);

  useEffect(() => {
    setNoteTimeout(setTimeout(() => {
      if (noteList) {
        api.post('/notes', notes, { withCredentials: true });
      } else {
        Cookies.set('savedNotes', JSON.stringify(notes), { expires: 7 });
      }
    }, 3000));
  }, [notes, noteList]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target) && !buttonClicked) {
        setIsPopupOpen(false);
      }
      setButtonClicked(false);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [buttonClicked]);

  const handleNoteChange = (e) => {
    const updatedNote = e.target.value;
    setNotes({ ...notes, [selectedPeriod]: updatedNote });
    clearTimeout(noteTimeout);
  };

  const handleDownload = (e) => {
    setIsPopupOpen(!isPopupOpen);
    setButtonClicked(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setTitle('');
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const downloadNote = () => {
    const downloadTitle = title.trim() ? title : 'Notes';
    const blob = new Blob([notes[selectedPeriod]], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${downloadTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    api.patch('/stats', { notesDownloaded: 1 }, { withCredentials: true });

    setIsPopupOpen(false);
    setTitle('');
  };


  const getPeriodColor = (period) => {
    switch (period) {
      case '1':
        return 'red';
      case '2':
        return 'darkorange';
      case '3':
        return 'yellow';
      case '4':
        return 'green';
      case '5':
        return 'blue';
      case '6':
        return 'indigo';
      case '7':
        return 'violet';
      case '8':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  return (
    <CSSTransition
      in={visible}
      timeout={200}
      classNames="slide-right"
      unmountOnExit
    >
      <div className="container" style={{ zIndex: visible ? 1 : 0 }}>
        <div className="top-bar">
          <div className="title">
            <h1>
              Focused Notes
            </h1>
            <button className="menu-icon" onClick={handleDownload} style={{ cursor: `pointer` }}>
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>

          {isPopupOpen && (
            <div className="menu-dropdown blue-accent" ref={popupRef}>
              <input
                className="notes"
                type="text"
                placeholder="Enter a title"
                value={title}
                onChange={handleTitleChange}
              />
              <button className="button" onClick={downloadNote}>Download</button>
              <button className="button" onClick={closePopup}>Cancel</button>
            </div>
          )}
        </div>

        <textarea
          value={notes[selectedPeriod] || ''} // Display the note for the selected period
          className="text-area main-body"
          onChange={handleNoteChange}
          placeholder="Write your notes here..."
        />
        <div className="input-container centered">
          <select
            value={selectedPeriod}
            onChange={handlePeriodChange}
            className="period-select notes"
            style={{ backgroundColor: getPeriodColor(selectedPeriod), color: getPeriodColor(selectedPeriod) === 'yellow' || getPeriodColor(selectedPeriod) === 'pink' ? 'black' : 'white' }}
          >
            <option style={{ backgroundColor: getPeriodColor('1') }} value="1">Period 1</option>
            <option style={{ backgroundColor: getPeriodColor('2') }} value="2">Period 2</option>
            <option style={{ backgroundColor: getPeriodColor('3') }} value="3">Period 3</option>
            <option style={{ backgroundColor: getPeriodColor('4') }} value="4">Period 4</option>
            <option style={{ backgroundColor: getPeriodColor('5') }} value="5">Period 5</option>
            <option style={{ backgroundColor: getPeriodColor('6') }} value="6">Period 6</option>
            <option style={{ backgroundColor: getPeriodColor('7') }} value="7">Period 7</option>
            <option style={{ backgroundColor: getPeriodColor('8') }} value="8">Other</option>
          </select>
        </div>
      </div>
    </CSSTransition>
  );
};

export default NoteView;
