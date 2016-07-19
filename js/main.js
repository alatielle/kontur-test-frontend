var main = function() {

  var MIN_SIZE = 2;
  var MAX_SIZE = 10;
  var MAX_VALUE = 10;

  var acceptedNumber = /^[+-]?\d*\.?\d+$/;

  var sidebar = document.querySelector(".controls");
  var errMsg = document.querySelector(".controls__error-msg");
  var matrixForm = document.forms.matrixForm;
  var matrixA = document.getElementById("matrixA");
  var matrixB = document.getElementById("matrixB");
  var matrixC = document.getElementById("matrixC");
  var choiceA = document.getElementById("choiceA");
  var choiceB = document.getElementById("choiceB");
  var calcBtn = document.getElementById("calcBtn");
  var swapBtn = document.getElementById("swapBtn");
  var addRowBtn = document.getElementById("addRowBtn");
  var addColBtn = document.getElementById("addColBtn");
  var delRowBtn = document.getElementById("delRowBtn");
  var delColBtn = document.getElementById("delColBtn");

  createMatrix("matrixA", 4, 2);
  createMatrix("matrixB", 2, 3);
  createMatrix("matrixC", 4, 3, true);
  restoreBtnStates(matrixA);

 /* EVENT LISTENERS*/

  matrixForm.addEventListener("input", function() {
    sidebar.classList.add("controls--edited");
  });
  matrixForm.onpropertychange = function() {
    sidebar.classList.add("controls--edited");
  }

  choiceA.addEventListener("click", function() {
    restoreBtnStates(matrixA);
  });

  choiceB.addEventListener("click", function() {
    restoreBtnStates(matrixB);
  });

  calcBtn.addEventListener("click", multiplyMatrices);

  swapBtn.addEventListener("click", swapMatrices);

  addRowBtn.addEventListener("click", addRowAndProcessMatrices);

  delRowBtn.addEventListener("click", delRowAndProcessMatrices);

  addColBtn.addEventListener("click", addColAndProcessMatrices);

  delColBtn.addEventListener("click", delColAndProcessMatrices);

 /* HANDLER FUNCTIONS */

  function multiplyMatrices() {
    var valuesA = createValuesArray(matrixA);
    var valuesB = createValuesArray(matrixB);
    if (!valuesA || !valuesB) {
      return;
    }
    var firstMatrix = new Matrix(valuesA);
    var secondMatrix = new Matrix(valuesB);
    var result = firstMatrix.multiply(secondMatrix);
    for (var i = 0; i < result.length; ++i) {
      for (var j = 0; j < result[i].length; ++j) {
        var cell = matrixC.rows[i].cells[j];
        cell.firstElementChild.value = result[i][j];
      }
    }
  }

  function swapMatrices() {
    var cellsA = matrixA.lastElementChild;
    var cellsB = matrixB.lastElementChild;
    replacePlaceholder(cellsA, "a", "b");
    replacePlaceholder(cellsB, "b", "a");
    matrixA.appendChild(cellsB);
    matrixB.appendChild(cellsA);

    var selectedMatrix = choiceA.checked ? matrixA : matrixB;
    restoreBtnStates(selectedMatrix);

    adjustOutputSize();
    clearOutput();
    checkMultiplicability();
  }

  function addRowAndProcessMatrices() {
    if (choiceA.checked) {
      addRow(matrixA);
      restoreBtnStates(matrixA);
      addRow(matrixC, true);
      clearOutput();
    }
    if (choiceB.checked) {
      addRow(matrixB);
      restoreBtnStates(matrixB);
      checkMultiplicability();
    }
  }

  function delRowAndProcessMatrices() {
    if (choiceA.checked) {
      removeRow(matrixA);
      restoreBtnStates(matrixA);
      removeRow(matrixC);
      clearOutput();
    }
    if (choiceB.checked) {
      removeRow(matrixB);
      restoreBtnStates(matrixB);
      checkMultiplicability();
    }
  }

  function addColAndProcessMatrices() {
    if (choiceA.checked) {
      addColumn(matrixA);
      restoreBtnStates(matrixA);
      checkMultiplicability();
    }
    if (choiceB.checked) {
      addColumn(matrixB);
      restoreBtnStates(matrixB);
      addColumn(matrixC, true);
      clearOutput();
    }
  }

  function delColAndProcessMatrices() {
    if (choiceA.checked) {
      removeColumn(matrixA);
      restoreBtnStates(matrixA);
      checkMultiplicability();
    }
    if (choiceB.checked) {
      removeColumn(matrixB);
      restoreBtnStates(matrixB);
      removeColumn(matrixC);
      clearOutput();
    }
  }

  function validateInput() {
    if (!this.value) {
      this.classList.remove("matrix__element--error");
      return;
    }
    if (!this.value.match(acceptedNumber)) {
      this.classList.add("matrix__element--error");
      return;
    } else {
      this.classList.remove("matrix__element--error");
    }
    if (+this.value > MAX_VALUE) {
      this.value = MAX_VALUE;
    }
    if (+this.value < -MAX_VALUE) {
      this.value = -MAX_VALUE;
    }
  }

 /* ADDITIONAL FUNCTIONS */

 /**
  * Composes an array of matrix values, which is
  * further used as an argument for Matrix Object
  *
  * @param {Element} matrix
  * @return Array.<number[]> valuesArray
  */
  function createValuesArray(matrix) {
    var rowsCount = matrix.rows.length;
    var colsCount = matrix.rows[0].cells.length;
    var valuesArray = [];
    for (var i = 0; i < rowsCount; ++i) {
      valuesArray[i] = [];
      for (var j = 0; j < colsCount; ++j) {
        var cell = matrix.rows[i].cells[j];
        var value = cell.firstElementChild.value;
        if (!value.match(acceptedNumber)) {
          return;
        }
        valuesArray[i][j] = parseFloat(value, 10);
      }
    }
    return valuesArray;
  }

 /**
  * Adds HTML layout for a matrix row
  *
  * @param {Element} matrix
  * @param {boolean} [disableFlag]
  */
  function addRow(matrix, disableFlag) {
    var tbody = matrix.lastElementChild;
    var rowsCount = matrix.rows.length;
    var colsCount = matrix.rows[0].cells.length;
    if (rowsCount < MAX_SIZE) {
      var tr = document.createElement("tr");
      for (var j = 1; j <= colsCount; ++j) {
        var cell = createCell(matrix, rowsCount + 1, j, disableFlag);
        tr.appendChild(cell);
      }
      tbody.appendChild(tr);
    }
  }

 /**
  * Removes HTML layout for a matrix row
  *
  * @param {Element} matrix
  */
  function removeRow(matrix) {
    var tbody = matrix.lastElementChild;
    if (matrix.rows.length > MIN_SIZE) {
      tbody.removeChild(tbody.lastElementChild);
    }
  }

 /**
  * Adds HTML layout for a matrix column
  *
  * @param {Element} matrix
  * @param {boolean} [disableFlag]
  */
  function addColumn(matrix, disableFlag) {
    var rowsCount = matrix.rows.length;
    var colsCount = matrix.rows[0].cells.length;
    if (colsCount < MAX_SIZE) {
      for (var i = 1; i <= rowsCount; ++i) {
        var cell = createCell(matrix, i, colsCount + 1, disableFlag);
        matrix.rows[i - 1].appendChild(cell);
      }
    }
  }

 /**
  * Removes HTML layout for a matrix column
  *
  * @param {Element} matrix
  */
  function removeColumn(matrix) {
    var rowsCount = matrix.rows.length;
    var colsCount = matrix.rows[0].cells.length;
    if (colsCount > MIN_SIZE) {
      for (var i = 0; i < rowsCount; ++i) {
        matrix.rows[i].removeChild(matrix.rows[i].lastElementChild);
      }
    }
  }

 /**
  * Sets proper attributes for Add & Delete
  * buttons based on matrix size
  *
  * @param {Element} matrix
  */
  function restoreBtnStates(matrix) {
    var rowsCount = matrix.rows.length;
    var colsCount = matrix.rows[0].cells.length;

    addRowBtn.setAttribute("disabled", "");
    delRowBtn.setAttribute("disabled", "");
    addColBtn.setAttribute("disabled", "");
    delColBtn.setAttribute("disabled", "");

    if (rowsCount > MIN_SIZE) {
      delRowBtn.removeAttribute("disabled");
    }
    if (rowsCount < MAX_SIZE) {
      addRowBtn.removeAttribute("disabled");
    }
    if (colsCount > MIN_SIZE) {
      delColBtn.removeAttribute("disabled");
    }
    if (colsCount < MAX_SIZE) {
      addColBtn.removeAttribute("disabled");
    }
  }

 /**
  * Checks if matrices A and B can be
  * multiplied and adjusts controls accordingly
  */
  function checkMultiplicability() {
    var rowsCount = matrixB.rows.length;
    var colsCount = matrixA.rows[0].cells.length;

    if (rowsCount != colsCount) {
      sidebar.classList.add("controls--error");
      errMsg.classList.remove("visually-hidden");
      calcBtn.setAttribute("disabled", "");
    } else {
      sidebar.classList.remove("controls--error");
      errMsg.classList.add("visually-hidden");
      calcBtn.removeAttribute("disabled");
    }
  }

 /**
  * Adjusts size of matrix C
  */
  function adjustOutputSize() {
    var rowsCount = matrixA.rows.length;
    var colsCount = matrixB.rows[0].cells.length;

    while (matrixC.rows.length > rowsCount) {
      removeRow(matrixC);
    }
    while (matrixC.rows.length < rowsCount) {
      addRow(matrixC, true);
    }
    while (matrixC.rows[0].cells.length > colsCount) {
      removeColumn(matrixC);
    }
    while (matrixC.rows[0].cells.length < colsCount) {
      addColumn(matrixC, true);
    }
  }

 /**
  * Clears values of matrix C
  */
  function clearOutput() {
    var inputs = matrixC.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; ++i) {
      inputs[i].value = "";
    }
  }

 /**
  * Replaces a letter in a placeholder of given
  * cells with a new one
  * placeholder="a1,1" -> placeholder="b1,1"
  *
  * @param {Element} cells
  * @param {string} letter
  * @param {string} newLetter
  */
  function replacePlaceholder(cells, letter, newLetter) {
    var inputs = cells.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; ++i) {
      inputs[i].placeholder = inputs[i].placeholder.replace(letter, newLetter);
    }
  }

 /**
  * Composes HTML layout for a matrix cell
  * with given indexes.
  * <td><input></td>
  *
  * @param {Element} matrix
  * @param {number} i
  * @param {number} j
  * @param {boolean} [disableFlag]
  * @return {Element} td
  */
  function createCell(matrix, i, j, disableFlag) {
    var td = document.createElement("td");
    var input = document.createElement("input");
    input.className = "matrix__element";
    input.setAttribute("type", "text");
    input.onchange = validateInput;
    input.setAttribute("placeholder", matrix.name + i + "," + j);
    if (disableFlag == true) {
      input.setAttribute("disabled", "");
    }
    td.appendChild(input);
    return td;
  }

 /**
  * Creates HTML layout for a matrix with a given id.
  *
  * @param {string} id
  * @param {number} rowsCount
  * @param {number} colsCount
  * @param {boolean} [disableFlag]
  */
  function createMatrix(id, rowsCount, colsCount, disableFlag) {
    var matrix = document.getElementById(id);
    matrix.name = id.charAt(id.length - 1).toLowerCase();
    var tbody = document.createElement("tbody");
    for (var i = 1; i <= rowsCount; ++i) {
      var tr = document.createElement("tr");
      for (var j = 1; j <= colsCount; ++j) {
        var cell = createCell(matrix, i, j, disableFlag);
        tr.appendChild(cell);
      }
      tbody.appendChild(tr);
    }
    matrix.appendChild(tbody);
  }
};
