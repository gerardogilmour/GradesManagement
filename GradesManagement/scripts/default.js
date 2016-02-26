/// <reference path="jquery-1.12.0.js" />

(function () {
    this.gradesControl = this.gradesControl || {};
    var ns = this.gradesControl;

    var alumns = [];
    var assigments = [];
    var tutors = [];

    //PROTOTYPES
    var Assigment = function (description, grade) {
        this.description = description || "";
        this.grade = grade || "0.0";
    }

    var Alumn = function (name, lastName, tutor) {
        this.name = name || "Juan";
        this.lastName = lastName || "Perez";
        this.assigments = [];
        // this.tutor = [];
        this.tutor = tutor || "";

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



    var Tutor = function (name, lastName) {     //****************************************YOOOOOOOOOOOOOOOOOOOOOOOO
        this.name = name || "Juan";
        this.lastName = lastName || "Perez";

        this.getFullName = function () {
            return this.name + " " + this.lastName;
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
                var grade = alumns[i].assigments[j].grade;
                html += "<td class='" + (grade < 6 ? "failed" : "") + "'>" + alumns[i].assigments[j].grade + "</td>";
            }

            html += "<td>" + alumns[i].calculateFinalGrade() + "</td>";
            html += "<td>" + alumns[i].tutor + "</td>";
            html += "<td><a href='#' data-action='edit' data-index='" + i + "'>Edit</a></td>";
            html += "<td><a href='#' data-action='delete' data-index='" + i + "'>Delete</a></td>";
            html += "<td><a href='#' data-action='add' data-index='" + i + "'>Add Tutor</a></td>";              //*********************YOOOOOOOOOOOOOOOOOOOOOOOOOO
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
        html += "<th>Tutor</th>";
        html += "<th colspan='4'>Actions</th>";                                              //************************************YOOOOOOOOOOOOOOOOOOOOOOOOOOO
        $("#row-header").html(html);
    }

    function updateRow(rowIndex, alumn) {
        var html = "<td>" + alumn.getFullName() + "</td>";
        for (var i = 0; i < alumn.assigments.length; i++) {
            var grade = alumn.assigments[i].grade;
            html += "<td class=' " + (grade < 6 ? "failed" : "") + " '>" + alumn.assigments[i].grade + "</td>";
        }

        html += "<td>" + alumn.calculateFinalGrade() + "</td>";
        html += "<td><a href='#' data-action='edit' data-index='" + rowIndex + "'>Edit</a></td>";
        html += "<td><a href='#' data-action='delete' data-index='" + rowIndex + "'>Delete</a></td>";
        html += "<td><a href='#' data-action='add' data-index='" + rowIndex + "'>Add Tutor</a></td>";
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

    function assignTutor(data) {   //************** A ver si funciona sin agregar todos los parametros
        var alumn = alumns[data.index];
        //alert(data.name);
        //alumn.tutor = data.tutor;
        alumn.tutor = data.tutor;
        updateRow(data.index, alumn);
        hideaddEditModal();
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
                name: "assigments[" + i + "]",
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
        $("#cover").fadeOut().promise().done(function () {
            $("#editForm input").each(function () {
                $(this).val("");
            });
        });

    }

    
    function showTutorModal(index) {
        var option = '';
        for (var i = 1; i <= tutors.length; i++) {
            option += '<option value="' + i + '">' + tutors[i - 1].getFullName() + '</option>';
        }
        $('#slTutors').append(option);
        //**************************
        /*var alumn = alumns[index];
        $("#addEditForm #index3").val(index);
        $("#addEditForm #alumn").val(tutor.name + " " + alumn.lastName);

        /* var html = "";
         for (var i = 0; i < alumn.assigments.length ; i++) {
             html += generateFormInput({
                 id: "assigments[" + i + "]",
                 name: "assigments[" + i + "]",
                 index: i,
                 title: alumn.assigments[i].description,
                 value: alumn.assigments[i].grade
             });
         }
         $("#alumnGrades").html(html);*/
        $("#cover4").fadeTo(400, .5);
        $("#modalDialog4").fadeIn();


    }

    function hideTutorModal() {
        $("#modalDialog4").fadeOut().promise();
        $("#cover4").fadeOut().promise().done(function () {
            $("#addEditForm input").each(function () {
                $(this).val("");
            });
        });
    }


    function showAddEditModal(index) {
        var option = '';
        for (var i = 1; i <= tutors.length; i++) {
            option += '<option value="' + i + '">' + tutors[i - 1].getFullName() + '</option>';
        }
        $('#slTutors').append(option);
        //**************************
        var alumn = alumns[index];
        $("#addEditForm #index3").val(index);
        $("#addEditForm #alumn").val(alumn.name + " " + alumn.lastName);

        /* var html = "";
         for (var i = 0; i < alumn.assigments.length ; i++) {
             html += generateFormInput({
                 id: "assigments[" + i + "]",
                 name: "assigments[" + i + "]",
                 index: i,
                 title: alumn.assigments[i].description,
                 value: alumn.assigments[i].grade
             });
         }
         $("#alumnGrades").html(html);*/
        $("#cover3").fadeTo(400, .5);
        $("#modalDialog3").fadeIn();


    }

    function hideaddEditModal() {
        $("#modalDialog3").fadeOut().promise();
        $("#cover3").fadeOut().promise().done(function () {
            $("#addEditForm input").each(function () {
                $(this).val("");
            });
        });

    }




    function showAddModal(index) {
        var html = "";
        $("#alumnGrades2").html(html);
        $("#cover2").fadeTo(400, .5);
        $("#modalDialog2").fadeIn();
    }

    function hideAddModal() {
        $("#modalDialog2").fadeOut().promise();
        $("#cover2").fadeOut().promise().done(function () {
            $("#addForm input").each(function () {
                $(this).val("");
            });
        });

    }



    /*  function check() {
          alert($("#slTutors").prop('selectedIndex'));
          alert(document.getElementById("slTutors").value);
      }*/



    $(document).on("ready", function () {
        //INITIAL DATA
        assigments.push(new Assigment("Task 1"));
        assigments.push(new Assigment("Task 2"));
        generateColHeaders();

        var alumn1 = new Alumn("Yulianna", "Murillo", "Tutor1");
        alumn1.assigments.push(new Assigment("Task 1", "9.7"));
        alumn1.assigments.push(new Assigment("Task 2", "9.7"));
        alumns.push(alumn1);

        var alumn2 = new Alumn("Fabricio", "Lopez", "Tutor2");
        alumn2.assigments.push(new Assigment("Task 2", "9.45"));
        alumn2.assigments.push(new Assigment("Task 2", "10"));
        alumns.push(alumn2);

        var tutur1 = new Tutor("Alejandro", "Pérez");
        tutors.push(tutur1);

        var tutur2 = new Tutor("Maricela", "Martinez");
        tutors.push(tutur2);
        //alert(tutors.length);
        generateRows();
        createAssigment();



        //EVENT HANDLERS
        $('#btnAddTask').on('click', function (e) {
            $('#addTask').fadeToggle();
        });

        //ADD ALUMN
        $('#btnAddAlumn').on('click', function (e) {
            e.preventDefault();
            showAddModal($(this).data("index"));
        });


        $("#addForm").on("submit", function (e) {
            e.preventDefault();
            var alumn = new Alumn($("#name2").val(), $("#lastName2").val());
            for (var i = 0; i < assigments.length; i++) {
                alumn.assigments.push(assigments[i]);
            }
            alumns.push(alumn);
            generateRows();
        });

        //Edit Tutor
        $('#EditTu').on('click', function (e) {
            e.preventDefault();
            showTutorModal($(this).data("index"));
        });


        $("#editFormTu").on("submit", function (e) {
            e.preventDefault();
            var alumn = new Alumn($("#name2").val(), $("#lastName2").val());
            for (var i = 0; i < assigments.length; i++) {
                alumn.assigments.push(assigments[i]);
            }
            alumns.push(alumn);
            generateRows();
        });


        //ADD/EDIT TUTORS
        $("tbody#alumns").on("click", "[data-action='add']", function (e) {
            e.preventDefault();
            showAddEditModal($(this).data("index"));
        });



        //EXTRACT DATA FROM select-option
        $('#slTutors').bind('change', function () {
            var $this = $(this),
            $value = $this.val();   //Extraer indice de selección
            $("#addEditForm #name3").val(tutors[$value - 1].name);
            $("#addEditForm #lastName3").val(tutors[$value - 1].lastName);
        });


        $("#addEditForm").on("submit", function (e) {
            e.preventDefault();
            //$('#confirmar').on('click', function () {
            //var assigment = new Assigment($('#tarea').val());
            /*var option = '';
            for (var i = 1; i <= tutors.length; i++) {
                option += '<option value="' + i + '">' + tutors[i - 1].getFullName() + '</option>';
            }
            $('#slTutors').append(option);
            //**************************
            var alumn = alumns[index];
            $("#addEditForm #index3").val(index);
            $("#addEditForm #alumn").val(alumn.name + " " + alumn.lastName);
            */


            /*  var tutor = new Tutor($("#name3").val(), $("#lastName3").val());
              alumns.push()
              assigments.push(assigment);
              for (var i = 0; i < alumns.length; i++) {
                  alumns[i].assigments.push(assigment);
              }
              generateColHeaders();
              generateRows();*/
            var alumn = {
                assigments: []
            };
            var formArray = $(this).serializeArray();
            alert(formArray[2].value);
            alumn.index = formArray[1].value;
            //alumn.name = formArray[2].value;
            alumn.tutor = formArray[2].value;
            assignTutor(alumn);
            generateRows();

            /*for (var i = 0; i < formArray.length; i++) {
                switch (formArray[i].name) {
                    case "index3":
                        alert("caso 1: "+formArray[i].name);
                        break;
                    case "name3":
                        alert("caso 2: " + formArray[i].name);
                        break;
                    case "lastName3":
                        alert("caso 3: " + formArray[i].name);
                        break;
                    default:   //"slTutors"
                        alert("default: " + formArray[i].name);
                        break;
                }
            }*/
            // editAlumn(alumn);
            //});
            /*   var alumn = {
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
              editAlumn(alumn);*/
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
            alumns.splice($(this).data("index"), 1);
            generateRows();
        });

        $("#closeModal4").click(hideTutorModal);
        $("#closeModal3").click(hideaddEditModal);
        $("#closeModal2").click(hideAddModal);
        $("#closeModal").click(hideEditModal);
    });





})();

