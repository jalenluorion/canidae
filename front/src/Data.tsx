import ListView from './StudySpace/ViewsSide/List';
import NoteView from './StudySpace/ViewsSide/Notes';
import FilesView from './StudySpace/ViewsSide/Files'
import CampusView from './StudySpace/ViewsSide/Campus'
import TimerView from './StudySpace/ViewsTop/Timer'
import SettingsView from './StudySpace/ViewsFull/Settings'
import UserView from './StudySpace/ViewsFull/User'

import { faListCheck, faUsers, faStickyNote, faClock, faPalette, faBook, faBoxArchive } from '@fortawesome/free-solid-svg-icons'; // Import the new icons

const mediaOptions = {
    backgrounds: [
      { value: 'c0_ejQQcrwI', label: 'Coffee Shop', live: false },
      { value: '-VgN7nKx9MU', label: 'Fireplace', live: false },
      { value: 'xg1gNlxto2M', label: 'New York City', live: false },
      { value: 'CHFif_y2TyM', label: 'Library', live: false },
      { value: 'mkgylOJSdhE', label: 'Backyard Rain', live: false },
      { value: 'acsLxmnjMho', label: 'Treehouse', live: false },
      { value: 'QX9ptr60JFw', label: 'Rainy Woods', live: false },
      { value: 'jfKfPfyJRdk', label: 'Lofi Hip Hop', live: true },
    ],
    audio: [
      { value: 'yIQd2Ya0Ziw', label: 'Rain' },
      { value: 'qsOUv9EzKsg', label: 'Fireplace' },
      { value: 'jfKfPfyJRdk', label: 'Lo-fi' },
      { value: 'WPni755-Krg', label: 'Ambience' },
      { value: 'BMuknRb7woc', label: 'Classical' },
      { value: '3NycM9lYdRI', label: 'Piano' },
      { value: 'Y-JQ-RCyPpQ', label: 'Jazz' },
      { value: 'LVbUNRwpXzw', label: 'Techno' },
    ],
};
const viewOptions = {
    farLeftView: { label: 'Social', icon: faUsers, component: ListView },
    left1View: { label: 'To-Do', icon: faListCheck, component: ListView },
    left2View: { label: 'Files', icon: faBoxArchive, component: FilesView },
    topView: { label: 'Timer', icon: faClock, component: TimerView },
    right1View: { label: 'Notes', icon: faStickyNote, component: NoteView },
    right2View: { label: 'Classes', icon: faBook, component: CampusView },
    farRightView: { label: 'Settings', icon: faPalette, component: SettingsView },
    userView: { component: UserView },
}

export {
  mediaOptions,
  viewOptions,
}