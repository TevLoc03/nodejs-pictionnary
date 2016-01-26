/**
 * Created by Tev on 26/01/2016.
 */
var sizes = [8, 20, 44, 90];
var size, color;
var commands = [];

var setColor = function() {
    color = document.getElementById('color').value;
};

var setSize = function() {
    size = sizes[document.getElementById('size').value];
};

window.onload = function() {
    var canvas    = document.getElementById('myCanvas');
    canvas.width  = 350;
    canvas.height = 350;
    var context   = canvas.getContext('2d');

    setSize();
    setColor();

    document.getElementById('size').onchange  = setSize;
    document.getElementById('color').onchange = setColor;

    var isDrawing = false;

    var startDrawing = function(e) {
        isDrawing = true;
    };

    var stopDrawing = function(e) {
        isDrawing = false;
    };

    var draw = function(e) {
        if (isDrawing) {
            var rect = canvas.getBoundingClientRect();
            commands.push({
                command : "draw",
                x : e.clientX - rect.left,
                y : e.clientY - rect.top,
                size: size / 2,
                color: color
            });
            context.beginPath();
            context.fillStyle = color;
            context.arc(e.clientX - rect.left, e.clientY - rect.top, size / 2, 0, 2 * Math.PI);
            context.fill();
            context.closePath();
        }
    };

    canvas.onmousedown = startDrawing;
    canvas.onmouseout  = stopDrawing;
    canvas.onmouseup   = stopDrawing;
    canvas.onmousemove = draw;

    document.getElementById('restart').onclick = function() {
        commands.push({
            command : "clear"
        });

        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    document.getElementById('validate').onclick = function() {
        document.getElementById('commands').value = JSON.stringify(commands);
        document.getElementById('picture').value = canvas.toDataURL();
    };

    $("#my-tools").draggable();
};