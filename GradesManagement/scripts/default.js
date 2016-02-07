/// <reference path="jquery-1.12.0.js" />

(function () {
    this.gradesControl = this.gradesControl || {};
    var ns = this.gradesControl;

    //TODO ADD CREATE ASSIGMENTS MODULE
    function createAssigment() {

    };

    //TODO CREATE ADD ALUMN FUNCTION, EDIT ALUMN, DELETE ALUMN (SUGGESTED USE PROTOTYPES)

    $(document).on("ready", function () {
        $('#btnAddTask').on('click', function (e) {
            $('#addTask').fadeToggle();
            
        });
        $('#btnConfirm').on('click', function () {
            

            $('thead>tr').append('<th>' + $('#tarea').val() + '</th>');

              $('tbody>tr').appendTo('<td></td>');
            
            $('#tarea').val('');
            alert('column added');
        });
    });
})();

