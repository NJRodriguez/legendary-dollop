const VALID_UNITS = { KILOGRAMS: 'kg', POUNDS: 'lb', OUNCES: 'oz' };
const convert = require('convert-units');

function convertUnit(value, unit, convertUnit) {
    return convert(value).from(VALID_UNITS[unit]).to(VALID_UNITS[convertUnit]);
}

module.exports = {VALID_UNITS, convertUnit}