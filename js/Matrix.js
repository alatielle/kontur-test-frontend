/**
 * @author Elena Rashkovan
 * @param Array.<number[]> array
 */
function Matrix(array) {

  var matrix = array;
  var rowsCount = array.length;
  var colsCount = array[0].length;

  this.getRow = function(index) {
    return matrix[index];
  };

  this.getColumn = function(index) {
    return matrix.map(function(row) {
      return row[index];
    });
  };

  this.getRowsCount = function() {
    return rowsCount;
  };

  this.getColsCount = function() {
    return colsCount;
  };

 /**
  * Multiplies matrices.
  * A.multiply(B)
  *
  * @param {Matrix} matrix
  * @return Array.<number[]> product
  */
  this.multiply = function(matrix) {
    var matrixRowsCount = matrix.getRowsCount();
    var matrixColsCount = matrix.getColsCount();
    if (colsCount != matrixRowsCount) {
      return;
    }
    var product = [];
    for (var i = 0; i < rowsCount; ++i) {
      product[i] = [];
      var row = this.getRow(i);
      for (var j = 0; j < matrixColsCount; ++j) {
        var column = matrix.getColumn(j);
        product[i][j] = getScalarProduct(row, column);
      }
    }
    return product;
  };

  /**
   * Calculates the scalar product of two vectors.
   *
   * @param {number[]} x
   * @param {number[]} y
   * @return {number} scalarProduct
   */
  function getScalarProduct(x, y) {
    if (x.length != y.length) {
      return;
    }
    var scalarProduct = 0;
    for (var i = 0; i < x.length; ++i) {
      scalarProduct += x[i] * y[i];
    }
    return scalarProduct;
  }
};
