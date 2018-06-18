function Signal() {
    
    // notifications

    this.editorCleared = new signals.Signal();

    this.savingStarted = new signals.Signal();
    this.savingFinished = new signals.Signal();

    this.themeChanged = new signals.Signal();

    this.transformModeChanged = new signals.Signal();
    this.snapChanged = new signals.Signal();
    this.spaceChanged = new signals.Signal();
    this.rendererChanged = new signals.Signal();

    this.sceneBackgroundChanged = new signals.Signal();
    this.sceneFogChanged = new signals.Signal();
    this.sceneGraphChanged = new signals.Signal();

    this.cameraChanged = new signals.Signal();

    this.geometryChanged = new signals.Signal();

    this.objectSelected = new signals.Signal();
    this.objectFocused = new signals.Signal();

    this.objectAdded = new signals.Signal();
    this.objectChanged = new signals.Signal();
    this.objectRemoved = new signals.Signal();

    this.helperAdded = new signals.Signal();
    this.helperRemoved = new signals.Signal();

    this.materialChanged = new signals.Signal();

    this.scriptAdded = new signals.Signal();
    this.scriptChanged = new signals.Signal();
    this.scriptRemoved = new signals.Signal();

    this.windowResize = new signals.Signal();

    this.showGridChanged = new signals.Signal();
    this.refreshSidebarObject3D = new signals.Signal();
    this.historyChanged = new signals.Signal();
    this.refreshScriptEditor = new signals.Signal()

};

export default Signal;