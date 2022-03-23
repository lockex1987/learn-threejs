// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas

Vue.createApp({
    data() {
        return {
            canvas: null,
            context: null,
            // Tạo độ vị trí của hình vuông trên canvas
            x: 0,
            isPlaying: true,
            isRecording: false,
            isRecorded: false,

            // here we will store our recorded media chunks (Blobs)
            chunks: [],
            recorder: null
        };
    },

    mounted() {
        this.canvas = this.$refs.theCanvas;
        this.context = this.canvas.getContext('2d');

        this.animate();
        this.initRecorder();

        this.$refs.theVideo.addEventListener('play', () => {
            this.timerCallback();
        });
    },

    methods: {
        animate() {
            this.x = (this.x + 1) % this.canvas.width;
            this.context.fillStyle = 'white';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillStyle = 'black';
            this.context.fillRect(this.x - 20, 0, 40, 40);
            if (this.isPlaying) {
                requestAnimationFrame(this.animate);
            }
        },

        initRecorder() {
            const stream = this.canvas.captureStream(); // grab our canvas MediaStream
            this.recorder = new MediaRecorder(stream); // init the recorder

            // every time the recorder has new data, we will store it in our array
            this.recorder.addEventListener('dataavailable', evt => {
                this.chunks.push(evt.data);
            });

            // only when the recorder stops, we construct a complete Blob from all the chunks
            this.recorder.addEventListener('stop', evt => {
                const blob = new Blob(this.chunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                this.isPlaying = false;
                this.isRecorded = true;
                this.chunks = [];
                this.createVideo(url);
                this.createDownloadLink(url);
                // URL.revokeObjectURL(url);
            });
        },

        startRecord() {
            this.isRecording = true;
            this.recorder.start();
        },

        stopRecord() {
            this.isRecording = false;
            this.recorder.stop();
        },

        createVideo(url) {
            this.$refs.theVideo.src = url;
        },

        createDownloadLink(url) {
            this.$refs.theLink.href = url;
        },

        timerCallback() {
            if (this.$refs.theVideo.paused
                || this.$refs.theVideo.ended) {
                return;
            }

            this.computeFrame();

            requestAnimationFrame(this.timerCallback);
        },

        computeFrame() {
            const video = this.$refs.theVideo;

            const width = video.videoWidth / 2;
            const height = video.videoHeight / 2;

            const ctx1 = this.$refs.canvas1.getContext('2d');
            const ctx2 = this.$refs.canvas2.getContext('2d');

            ctx1.drawImage(video, 0, 0, width, height);

            const frame = ctx1.getImageData(0, 0, width, height);
            const length = frame.data.length;
            const data = frame.data;
            for (let i = 0; i < length; i += 4) {
                const red = data[i + 0];
                const green = data[i + 1];
                const blue = data[i + 2];
                if (green > 100
                    && red > 100
                    && blue < 43) {
                    data[i + 3] = 0;
                }
            }

            ctx2.putImageData(frame, 0, 0);
        }
    }
}).mount('#app');
