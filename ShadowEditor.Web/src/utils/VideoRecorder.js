import DownloadUtils from './DownloadUtils';
import TimeUtils from './TimeUtils';

/**
 * 视频录制器
 * @author tengge / https://github.com/tengge1
 */
class VideoRecorder {
    constructor() {
        this.chunks = [];

        this.recorder = null;

        this.onDataAvailable = this.onDataAvailable.bind(this);
    }

    start() {
        if (!navigator.mediaDevices) {
            app.toast(`Record is not supported!`, 'error');
            return new Promise(resolve => {
                resolve(false);
            });
        }

        return new Promise(resolve => {
            navigator.mediaDevices.getDisplayMedia()
                .then(stream => {
                    this.recorder = new MediaRecorder(stream);
                    this.recorder.ondataavailable = this.onDataAvailable;
                    this.recorder.start();
                    resolve(true);
                })
                .catch(err => {
                    resolve(false);
                });
        });
    }

    stop() {
        return new Promise(resolve => {
            this.recorder.onstop = () => {
                this.recorder.ondataavailable = null;
                this.recorder.onstop = null;

                const file = new File(this.chunks, TimeUtils.getDateTime() + '.webm');

                let form = new FormData();
                form.append('file', file);

                fetch(`/api/Video/Add`, {
                    method: 'POST',
                    body: form
                }).then(response => {
                    response.json().then(obj => {
                        if (obj.Code !== 200) {
                            app.toast(_t(obj.Msg), 'warn');
                            return;
                        }
                        app.toast(_t(obj.Msg), 'success');
                        this.chunks.length = 0;
                        resolve(true);
                    });
                });
            };

            this.recorder.stop();
        }).catch(() => {
            resolve(false);
        });
    }

    onDataAvailable(e) {
        this.chunks.push(e.data);
    }
}

export default VideoRecorder;