const video = document.getElementById('videoInput')
let faces = new Set();
let users = ['sanjay', 'shubham']
let content;
let count = [];
// import * as person from '../index.html';
// var json2xls = require('json2xls');
// import json2xls from '../../node_modules/json2xls';

const labels = ['Sanjay', 'Shubham', 'Manav', 'Manoti']
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models') //heavier/accurate version of tiny face detector
]).then(start)

function start() {
    console.log("started");
    document.body.append('Models Loaded')

    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )

    //video.src = '../videos/speech.mp4'
    console.log('video added')
    recognizeFaces()
}

async function recognizeFaces() {

    const labeledDescriptors = await loadLabeledImages()
    console.log(labeledDescriptors)
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7)


    video.addEventListener('play', async () => {
        console.log('Playing')
        const canvas = faceapi.createCanvasFromMedia(video)
        document.body.append(canvas)

        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)



        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()

            const resizedDetections = faceapi.resizeResults(detections, displaySize)

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

            const results = resizedDetections.map((d) => {
                return faceMatcher.findBestMatch(d.descriptor)
            })
            results.forEach((result, i) => {
                const box = resizedDetections[i].detection.box
                const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
                // console.log(result.toString());
                // faces.add(result.toString());
                let f = result.toString();
                const myArray = f.split(" ");

                if (myArray[0] == 'Sanjay' && count.length < 6) {
                    // if(count)
                    count.push('Sanjay');

                } else if (myArray[0] == 'Sanjay') {
                    alert('face detected user = ' + myArray[0]);
                    window.location.href = 'http://localhost:4000'
                }

                if (myArray[0] == 'unknown' && count1.length < 6) {
                    count1.push('unknown');
                } else if (myArray[0] === 'unknown') {
                    alert('unknown user');
                    window.location.href = 'http://localhost:3000/index.html'
                }

                // if (myArray[0] != 'unknown') {
                //     // console.log(faces);
                //     faces.add(myArray[0]);
                //     console.log(faces);
                //     content =JSON.stringify([...faces]);


                // }
                drawBox.draw(canvas)
            })
        }, 100)



    })
}

// const myTimeout = setTimeout(myStopFunction, 15000);

// function myStopFunction() {

// var xls = json2xls(content);

// fs.writeFileSync('data.xlsx', xls, 'binary');
// }

function loadLabeledImages() {

    // const labels = ['Prashant Kumar'] // for WebCam
    return Promise.all(
        labels.map(async (label) => {
            const descriptions = []
            for (let i = 1; i <= 2; i++) {
                const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                console.log(label + i + JSON.stringify(detections))
                descriptions.push(detections.descriptor)
            }
            document.body.append(label + ' Faces Loaded | ')
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}


export default content;