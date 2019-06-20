totalValues = [2, 5, 10, 15, 30, 45, 60, 90, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600];
totalNames = ["2 S","5 S","10 S"," 15 S","30 S"," 45 S"," 1 minute","1 M 30 S","2 M","3 M","4 M","5 M"," 6 M","7 M","8 M","9 M","10 M","11 M","12 M","13 M","14 M","15 M","16 M","17 M","18 M","19 M","20 M","25 M","30 M","35 M","40 M","45 M","50 M","55 M","1 Hour"];

incrementValues = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50, 60, 90, 120, 180, 240, 300, 600];
incrementNames = ["Half a second", "1 second", "2 S", "3 S", "4 S", "5 S", "6 S", "7 S", "8 S", "9 S", "10 S", "15 S", "20 S", "25 S", "30 S", "40 S", "50 S", "1 minute", "1 minute 30 S", "2 M", "3 M", "4 M", "5 M", "10 M"];

//init
$(document).ready(function () {
    //menu options

    $('#instant-game-btn').click(function () {
        //call function to start instant game here
    });

    $('#lobby-create-btn').click(function () {
        $('#lobby-create').modal('show')
    });

    $('#lobby-join-btn').click(function () {
        $('#lobby-join').modal('show')
    });

    //create lobby menu
    $('#preset').on('changed.bs.select', function (_, clickedIndex, _, _) {
        if (clickedIndex === 0 || clickedIndex == null) {
            $("#variant,#time-control").show();
        } else {
            $("#variant,#time-control").hide();
        }
    })

    //sliders
    $('#total-time').slider({
        formatter: function(value) {
        return totalNames[value].replace("S", "seconds").replace("M", "minutes");
    }});
    $('#increment-time').slider({
        formatter: function(value) {
        return incrementNames[value].replace("S", "seconds").replace("M", "minutes");
    }});
    
    //landing pop up
    $('#start-select').modal('show')

    //default selector options
    $('#preset').selectpicker('val', '1');
    $('#variant-selector').selectpicker('val', '1');
    $('#time-control-selector').selectpicker('val', '1');
});

//tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})



