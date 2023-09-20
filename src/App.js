import React from 'react';
import StudySpace from './StudySpace/Space';

import { options, views } from './Data';

function App() {
    return (
        <StudySpace
            options={options}
            views={views}
        />
    );
}

export default App;