const {unlinkSync} = require('fs');

module.exports = async path => {
	if (Object.prototype.toString.call(path) === '[object Object]') {
		Object.keys(path).forEach(file => unlinkSync(path[file]));
	} else {
		unlinkSync(path);
	}
};
