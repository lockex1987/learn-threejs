const settings = {
    message: 'dat.GUI',
    checkbox: true,
    colorA: '#FF00B4',
    colorB: '#22CBFF',
    step5: 10,
    range: 50,
    options: 'Option 1',
    speed: 0,
    func() {
        console.log(this.range);
    },
    justgooddesign() {
        window.location = 'https://www.justgooddesign.com';
    },
    field1: 'Field 1',
    field2: 'Field 2',
    color0: '#ffae23', // CSS string
    color1: [0, 128, 255], // RGB array
    color2: [0, 128, 255, 0.3], // RGB with alpha
    color3: { h: 350, s: 0.9, v: 0.3 } // Hue, saturation, value
};

let timeout = 0;

function delayInit() {
    clearTimeout(timeout);
    timeout = setTimeout(init, 180);
}

function init() {
    console.log('init');
    onResize();
    $('canvas').css('background-image', 'url("http://placehold.it/500x300&text=' + settings.message + '")');
}


// "url('http://placehold.it/300x300&text=sss'" + settings.message + ")");
// http://workshop.chromeexperiments.com/examples/gui/#8--Custom-Placement
// var gui = new dat.GUI({ autoPlace: false });
// var customContainer = document.getElementById('#datContainer');
// customContainer.appendChild(gui.domElement);

const gui = new dat.GUI();

function initGui() {
    gui.add(settings, 'message').onChange(function (value) {
        init();
    });
    gui.add(settings, 'step5', 0, 255).step(5);
    gui.add(settings, 'checkbox').onChange(function (value) {
        init();
    });
    gui.add(settings, 'range', 1, 100).onChange(function (value) {
        init();
    });
    gui.add(settings, 'options', ['Option 1', 'Option 2', 'Option 3']);
    gui.add(settings, 'speed', { Low: 0, Med: 0.5, High: 1 });
    gui.addColor(settings, 'colorA').onChange(function (value) {
        init();
    });
    gui.addColor(settings, 'colorB').onChange(function (value) {
        init();
    });
    gui.add(settings, 'func');
    gui.open();

    const f1 = gui.addFolder('Fields');
    f1.add(settings, 'field1');
    f1.add(settings, 'field2');
    f1.open();

    const f2 = gui.addFolder('Colors');
    f2.addColor(settings, 'color0');
    f2.addColor(settings, 'color1');
    f2.addColor(settings, 'color2');
    f2.addColor(settings, 'color3');
    f2.open();

    const f3 = gui.addFolder('Just Good Design');
    f3.add(settings, 'justgooddesign');
    f3.open();
}



initGui();






// update display outside of gui
// http://workshop.chromeexperiments.com/examples/gui/#10--Updating-the-Display-Manually
function updateGUI(targetGui) {
    for (const i in targetGui.__controllers) {
        targetGui.__controllers[i].updateDisplay();
    }
}

// updateGUI(gui);

$('#content').append("<div id='output' />");

function onResize() {
    const windowW = $('#container').width(); // window.innerWidth;
    const windowH = $('#container').height(); // window.innerHeight;
    $('#output').html('<p>' + windowW + ', ' + windowH + '</p>');

    const canvas = $('#canvas');
    canvas.width(windowW);
    canvas.height(windowH);
    const context = canvas.get(0).getContext('2d');
    context.canvas.width = windowW;
    context.canvas.height = windowH;

    if (settings.checkbox) {
        const myGradient = context.createLinearGradient(0, 0, windowW / 2, 0);
        myGradient.addColorStop(0, settings.colorA);
        myGradient.addColorStop(1, settings.colorB);
        context.fillStyle = myGradient;
        context.fillRect(0, 0, windowW, 100);
    } else {
        context.fillStyle = settings.colorA;
        context.fillRect(0, 0, windowW, 100);
        context.fillStyle = settings.colorB;
        context.fillRect(0, 100, windowW, 15);
    }
}

$(window).bind('resize', delayInit);
init();
