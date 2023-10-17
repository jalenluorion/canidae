import React from 'react';
import { createBrowserRouter, defer, createRoutesFromElements, Route, RouterProvider, Navigate, Link, useLoaderData} from 'react-router-dom';
import StudySpace from './StudySpace/Space';
import LoginView from './StudySpace/ViewsFull/Login';
import { options, views } from './Data';
import { api, fetchPromise } from './Helper';

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<IndexPage />} />
            <Route path="space" element={<GuestRoute />} loader={LoaderGuest}>
                <Route path="login" element={<LoginView />} />
            </Route>
            <Route path="space/:userId" element={<UserRoute />} loader={LoaderUser}/>
        </>
    )
);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

async function LoaderGuest() {
    try {
        const response = await api.get('/user', { withCredentials: true });

        if (response.status === 200) {
            return({ loggedIn: true, userId: response.data.user._id });
        }
    } catch (error) {
        const ytReady = fetchPromise();
        return defer({ loggedIn: false, isVideoReady: ytReady });
    }
}

async function LoaderUser({ params }){
    try {
        const response = await api.get('/verify?id=' + params.userId, { withCredentials: true });

        if (response.status === 200) {
            const ytReady = fetchPromise();
            const toDo = api.get('/todo', { withCredentials: true }).then((response) => {return response.data});
            const notes = api.get('/notes', { withCredentials: true }).then((response) => {return response.data});
            return defer({ loggedIn: true, user: response.data.user, isVideoReady: ytReady, toDo: toDo, notes: notes });
        }
    } catch (error) {
        return({ loggedIn: false });
    }
}

function IndexPage() {
    return (
        <div>
            <h1>Welcome to Canidae!</h1>
            <Link to="space">Open Canidae</Link>
        </div>
    );
}

function GuestRoute() {
    const data = useLoaderData();

    if (data.loggedIn === true) {
        return <Navigate to={`${data.userId}`} replace />;
    }

    return <StudySpace data={data} options={options} views={views} />;
}

function UserRoute() {
    const data = useLoaderData();

    if (data.loggedIn === true) {
        return <StudySpace data={data} options={options} views={views} />;
    }

    return <Navigate to="../space" replace />;
}

export default App;