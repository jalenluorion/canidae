import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

import './Timer.css';
import './ViewsTop.css'

const TimerView = () => {
  return (
    <div className="container-top">
      <div className="top-bar">
        <div className="title">
          <h1>
            Timer
          </h1>
          <button className="menu-icon" style={{ cursor: `pointer` }}>
            <FontAwesomeIcon icon={faClock} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerView;