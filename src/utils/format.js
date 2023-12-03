export const formatPieData = (data) => {
    let a = {}
    a = data.reduce((count, item) => {
        if (count[item.code]) {
            count[item.code]++;
        } else {
            count[item.code] = 1;
        }
        return count;
    }, {});
    return a
}

export function generateRandomColors(count) {
    var colors = [];
    var colorSet = new Set();

    while (colorSet.size < count) {
        var color = getRandomColor();
        colorSet.add(color);
    }

    colorSet.forEach(function (color) {
        colors.push(color);
    });

    return colors;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';

    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}