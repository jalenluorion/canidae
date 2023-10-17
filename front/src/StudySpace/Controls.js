import React, { useState } from 'react';
import ControlContainer from './ControlView/Control';
import { Outlet, Await } from 'react-router-dom';

function Controls({
    data,
    options,
    views,
    selectedBackground,
    setSelectedBackground,
    selectedAudio,
    setSelectedAudio,
    audioReady,
}) {
    const [showUserView, setShowUserView] = useState(false);

    const [showLeft1View, setShowLeft1View] = useState(false);
    const [showLeft2View, setShowLeft2View] = useState(false);
    const [showTopView, setShowTopView] = useState(false);
    const [showRight1View, setShowRight1View] = useState(false);
    const [showRight2View, setShowRight2View] = useState(false);
    const [showFarRightView, setShowFarRightView] = useState(false);

    const [activeTab, setActiveTab] = useState('backgrounds');
    return (
        <>
            <div className="item-container">
                <Await
                    resolve={data.toDo}
                    errorElement={
                        <p>Error loading package location!</p>
                    }
                >
                    <div className="left-view">
                        <views.left1View.component visible={showLeft1View} />
                        <views.left2View.component visible={showLeft2View} />
                    </div>
                </Await>
                    <div className="top-view">
                        <views.topView.component visible={showTopView} />
                    </div>
                    <div className="control-view">
                        <ControlContainer
                            user={data.user}
                            views={views}
                            showUserView={showUserView}
                            setShowUserView={setShowUserView}
                            showLeft1View={showLeft1View}
                            setShowLeft1View={setShowLeft1View}
                            showRight1View={showRight1View}
                            setShowRight1View={setShowRight1View}
                            showLeft2View={showLeft2View}
                            setShowLeft2View={setShowLeft2View}
                            showRight2View={showRight2View}
                            setShowRight2View={setShowRight2View}
                            showTopView={showTopView}
                            setShowTopView={setShowTopView}
                            showFarRightView={showFarRightView}
                            setShowFarRightView={setShowFarRightView}
                        />
                    </div>
                <Await
                    resolve={data.notes}
                    errorElement={
                        <p>Error loading package location!</p>
                    }
                >
                    <div className="right-view">
                        <views.right1View.component visible={showRight1View} />
                        <views.right2View.component visible={showRight2View} />
                    </div>
                </Await>
            </div>
            <views.farRightView.component
                visible={showFarRightView}
                setVisible={setShowFarRightView}
                options={options}
                selectedBackground={selectedBackground}
                setSelectedBackground={setSelectedBackground}
                selectedAudio={selectedAudio}
                setSelectedAudio={setSelectedAudio}
                audioReady={audioReady}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <views.userView.component
                visible={showUserView}
                setVisible={setShowUserView}
                user={data.user}
            />
            <Outlet />
        </>
    )
}

export default Controls;