/// <reference path="jquery-1.12.0.js" />

(function () {
    this.gradesControl = this.gradesControl || {};
    var ns = this.gradesControl;

    var alumns = [];
    var assigments = [];

    //PROTOTYPES
    var Assigment = function (description, grade) {
        this.description = description || "";
        this.grade = grade || "0.0";
    }

    var Alumn = function (name, lastName) {
        this.name = name || "Juan";
        this.lastName = lastName || "Perez";
        this.assigments = [];

        this.getFullName = function () {
            return this.name + " " + this.lastName;
        }

        this.calculateFinalGrade = function () {
            var grade = 0;
            for (var i = 0; i < this.assigments.length; i++) {
                grade += Number(this.assigments[i].grade);
            }
            return (grade / this.assigments.length).toFixed(2);
        }
    };

    //TODO ADD CREATE ASSIGMENTS MODULE
    function createAssigment() {
        $('#confirmar').on('click', function () {
            var assigment = new Assigment($('#tarea').val());
            assigments.push(assigment);
            for (var i = 0; i < alumns.length; i++) {
                alumns[i].assigments.push(assigment);
            }
            generateColHeaders();
            generateRows();
        });
        

    };

    //TODO CREATE ADD ALUMN FUNCTION, EDIT ALUMN, DELETE ALUMN (SUGGESTED USE PROTOTYPES)

    function generateRows() {
        var html = "";
        for (var i = 0; i < alumns.length; i++) {
            html += "<tr data-index='" + i + "'>";
            html += "<td>" + alumns[i].getFullName() + "</td>";
            for (var j = 0; j < alumns[i].assigments.length; j++) {
                html += "<td>" + alumns[i].assigments[j].grade + "</td>";
            }

            html += "<td>" + alumns[i].calculateFinalGrade() + "</td>";
            html += "<td><a href='#' data-action='edit' data-index='" + i + "'>Edit</a></td>";
            html += "<td><a href='#' data-action='delete' data-index='" + i + "'>Delete</a></td>";
            html += "</tr>";
        }
        $("#alumns").html(html);
    }

    function generateColHeaders() {
        var html = "<th>Students</th>";
        for (var i = 0; i < assigments.length; i++) {
            html += "<th>" + assigments[i].description + "</th>";
        }
        html += "<th>Final Grade</th>";
        html += "<th colspan='2'>Actions</th>";
        $("#row-header").html(html);
    }

    function updateRow(rowIndex, alumn) {
        var html = "<td>" + alumn.getFullName() + "</td>";
        for (var i = 0; i < alumn.assigments.length; i++) {
            html += "<td>" + alumn.assigments[i].grade + "</td>";
        }

        html += "<td>" + alumn.calculateFinalGrade() + "</td>";
        html += "<td><a href='#' data-action='edit' data-index='" + rowIndex + "'>Edit</a></td>";
        html += "<td><a href='#' data-action='delete' data-index='" + rowIndex + "'>Delete</a></td>";
        $("tr[data-index='" + rowIndex + "']").html(html);
    }

    function generateFormInput(input) {
        var html = "<label for='" + input.id + "'>" + input.title + "</label>";
        html += "<input type='number' id='" + input.id + "' name='" + input.name + "' value='" + input.value + "'data-index='" + input.index + "' min='0' max='10' step='any' />";
        return "<div>" + html + "</div>";
    };

    function editAlumn(data) {
        var alumn = alumns[data.index];
        alumn.name = data.name;
        alumn.lastName = data.lastName;
        for (var i = 0; i < data.assigments.length; i++) {
            alumn.assigments[i].grade = data.assigments[i];
        }
        updateRow(data.index, alumn);
        hideEditModal();
    };

    function showEditModal(index) {
        var alumn = alumns[index];
        $("#editForm #index").val(index);
        $("#editForm #name").val(alumn.name);
        $("#editForm #lastName").val(alumn.lastName);

        var html = "";
        for (var i = 0; i < alumn.assigments.length ; i++) {
            html += generateFormInput({
                id: "assigments[" + i + "]",
                name: "assigments["+ i +"]",
                index: i,
                title: alumn.assigments[i].description,
                value: alumn.assigments[i].grade
            });
        }
        $("#alumnGrades").html(html);
        $("#cover").fadeTo(400, .5);
        $("#modalDialog").fadeIn();
    }

    function hideEditModal() {
        $("#modalDialog").fadeOut().promise();
        $("#cover").fadeOut().promise().done(function(){
            $("#editForm input").each(function () {
                $(this).val("");
            });
        });
        
    }

    $(document).on("ready", function () {
        //INITIAL DATA
        assigments.push(new Assigment("Task 1"));
        assigments.push(new Assigment("Task 2"));
        generateColHeaders();

        var alumn1 = new Alumn("Yulianna", "Murillo");
        alumn1.assigments.push(new Assigment("Task 1", "9.7"));
        alumn1.assigments.push(new Assigment("Task 2", "9.7"));
        alumns.push(alumn1);

        var alumn2 = new Alumn("Fabricio", "Lopez");
        alumn2.assigments.push(new Assigment("Task 2", "9.45"));
        alumn2.assigments.push(new Assigment("Task 2", "10"));
        alumns.push(alumn2);

        generateRows();
 
        createAssigment();
        //EVENT HANDLERS
        $('#btnAddTask').on('click', function (e) {
            $('#addTask').fadeToggle();
        });

        //EDIT ALUMN
        $("tbody#alumns").on("click", "[data-action='edit']", function (e) {
            e.preventDefault();
            showEditModal($(this).data("index"));
        });

        $("#editForm").on("submit", function (e) {
            e.preventDefault();
            var alumn = {
                assigments: []
            };
            var formArray = $(this).serializeArray();
            for (var i = 0; i < formArray.length; i++) {
                switch (formArray[i].name) {
                    case "index":
                        alumn.index = formArray[i].value;
                        break;
                    case "name":
                        alumn.name = formArray[i].value;
                        break;
                    case "lastName":
                        alumn.lastName = formArray[i].value;
                        break;
                    default:
                        alumn.assigments.push(formArray[i].value);
                        break;
                }
            }
            editAlumn(alumn);
        });

        //DELETE ALUMN
        $("tbody#alumns").on("click", "[data-action='delete']", function (e) {
            e.preventDefault();
            console.log($(this).data("index"));
            //TODO IMPLEMENT DELETE ALUMN FUNCTION
            //deleteAlumn($(this).data("index"));
        });

        $("#closeModal").click(hideEditModal);
    });
})();

