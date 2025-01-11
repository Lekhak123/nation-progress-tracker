"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_all_indicators = exports.getIndicatorStats = exports.get_country3letterCode = exports.getCountryStats = void 0;
var countryService_1 = require("./services/countryService");
Object.defineProperty(exports, "getCountryStats", { enumerable: true, get: function () { return countryService_1.getCountryStats; } });
Object.defineProperty(exports, "get_country3letterCode", { enumerable: true, get: function () { return countryService_1.get_country3letterCode; } });
Object.defineProperty(exports, "getIndicatorStats", { enumerable: true, get: function () { return countryService_1.getIndicatorStats; } });
Object.defineProperty(exports, "get_all_indicators", { enumerable: true, get: function () { return countryService_1.get_all_indicators; } });
