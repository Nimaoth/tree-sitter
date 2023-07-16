mergeInto(LibraryManager.library, {
  tree_sitter_parse_callback: function(
    inputBufferAddress,
    index,
    row,
    column,
    lengthAddress
  ) {
    var INPUT_BUFFER_SIZE = 10 * 1024;
    var string = currentParseCallback(index, {row: row, column: column});
    if (typeof string === 'string') {
      setValue(lengthAddress, string.length, 'i32');
      stringToUTF16(string, inputBufferAddress, INPUT_BUFFER_SIZE);
    } else if (typeof string === 'object' && string.constructor === Array) {
      setValue(lengthAddress, string.length, 'i32')
      let dataToWrite = Int8Array.from(string).subarray(0, Math.min(string.length, INPUT_BUFFER_SIZE))
      HEAP8.set(dataToWrite, inputBufferAddress)
    } else {
      setValue(lengthAddress, 0, 'i32');
    }
  },

  tree_sitter_log_callback: function(isLexMessage, messageAddress) {
    if (currentLogCallback) {
      const message = UTF8ToString(messageAddress);
      currentLogCallback(message, isLexMessage !== 0);
    }
  }
});
