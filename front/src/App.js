import React from 'react';
import { createBrowserRouter, defer, createRoutesFromElements, Route, RouterProvider, Navigate, useLoaderData} from 'react-router-dom';
import StudySpace from './StudySpace/Space';
import LoginView from './StudySpace/ViewsFull/Login';
import { mediaOptions, viewOptions } from './Data';
import { api, fetchPromise } from './Helper';
import Landing from './Landing';
import ReactGA from 'react-ga4';

// App base
function App() {
    ReactGA.initialize("G-ZMHK35E10N");
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
    
    return (
        <RouterProvider router={router} />
    );
}

// Routing
const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Landing />} />
            <Route path="space" element={<GuestRoute />} loader={LoaderGuest}>
                <Route path="login" element={<LoginView />} />
            </Route>
            <Route path="space/:spaceId" element={<UserRoute />} loader={LoaderUser}/>
        </>
    )
);

// Loads data for default guest space
async function LoaderGuest() {
    try {
        const response = await api.get('/user', { withCredentials: true });

        if (response.status === 200) {
            return({ loggedIn: true, spaceId: response.data.user.defaultSpace });
        }
    } catch (error) {
        const ytReady = fetchPromise();
        return defer({ loggedIn: false, isVideoReady: ytReady });
    }
}
// Loads default guest space with loader data
function GuestRoute() {
    const data = useLoaderData();

    if (data.loggedIn === true) {
        return <Navigate to={`${data.spaceId}`} replace />;
    }

    const spaceData = {
        mediaOptions: mediaOptions,
        viewOptions: viewOptions,
    }

    return <StudySpace loggedIn={data.loggedIn} isReady={data.isVideoReady} data={spaceData} />;
}

// Loads data for user space
async function LoaderUser({ params }){
    try {
        const response = await api.get('/verify?id=' + params.spaceId, { withCredentials: true });

        if (response.status === 200) {
            const ytReady = fetchPromise();
            const toDo = api.get('/todo', { withCredentials: true }).then((response) => {return response.data});
            const notes = api.get('/notes', { withCredentials: true }).then((response) => {return response.data});
            return defer({ loggedIn: true, user: response.data.user, space: response.data.space, isVideoReady: ytReady, toDo: toDo, notes: notes });
        }
    } catch (error) {
        return({ loggedIn: false });
    }
}
// Loads user space with loader data
function UserRoute() {
    const data = useLoaderData();

    if (data.loggedIn === false) {
        return <Navigate to="../space" replace />;
    }

    const spaceData = {
        user: data.user,
        space: data.space,
        toDo: data.toDo,
        notes: data.notes,
        mediaOptions: mediaOptions,
        viewOptions: viewOptions,
    }

    return <StudySpace loggedIn={data.loggedIn} isReady={data.isVideoReady} data={spaceData} />;
}

export default App;