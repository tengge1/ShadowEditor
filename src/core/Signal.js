function Signal() {
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