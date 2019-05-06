
secondClick = false;
fClickX = 0;
fClickY = 0;
function clicked(el){
    var coord = el.id.split(" ")
    x = coord[0]
    y = coord[1]

    if(secondClick){
        if(legalMove()) {
            send([fClickX, fClickY, x, y]);
        }
        secondClick = false;
    } else {
        fClickX = x
        fClickY = y
        secondClick = true;
    }
}

function legalMove(x1, y1, x2, y2){
    return true;
}