module.exports = {
    isNumber(variable) {
        return !isNaN(parseFloat(variable)) && !isNaN(variable - 0)
    },
    isImage(originalFilename, mimetype) {
        if (originalFilename.match(/\.(jpg|jpeg|png)$/i) && mimetype.match(/\/(jpg|jpeg|png)$/i)) {
            return true;
        } else {
            return false;
        }
    }
}