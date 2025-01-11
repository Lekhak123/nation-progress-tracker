"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_all_indicators = exports.getIndicatorStats = exports.getCountryStats = exports.get_country3letterCode = void 0;
var apiHelper_1 = require("../utils/apiHelper");
Object.defineProperty(exports, "get_all_indicators", { enumerable: true, get: function () { return apiHelper_1.get_all_indicators; } });
var ISO_3166_1_alpha_3_codes_json_1 = require("../utils/ISO_3166-1_alpha-3_codes.json");
/**
 * Retrieves the 3-letter country codes for a given country name.
 * Returns an array of matching country codes. If no matches are found, returns an empty array.
 * @param country - The name of the country.
 * @returns An array of 3-letter country codes.
 */
var get_country3letterCode = function (country) {
    var lowerCaseCountry = country.toLowerCase().trim();
    var matches = ISO_3166_1_alpha_3_codes_json_1.default
        .filter(function (c) { return c.name.toLowerCase().includes(lowerCaseCountry); })
        .slice(0, 5) // Limit to first 5 matches to prevent excessive results
        .map(function (c) { return c.code; });
    return matches;
};
exports.get_country3letterCode = get_country3letterCode;
/**
 * Retrieves statistics for a given 3-letter country code.
 * @param countryCode - The 3-letter country code.
 * @returns A Promise that resolves to CountryStats.
 * @throws Will throw an error if the country code is invalid or if data fetching fails.
 */
var getCountryStats = function (countryCode) { return __awaiter(void 0, void 0, void 0, function () {
    var upperCaseCode, isValidCode, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                upperCaseCode = countryCode.toUpperCase().trim();
                isValidCode = ISO_3166_1_alpha_3_codes_json_1.default.some(function (c) { return c.code === upperCaseCode; });
                if (!isValidCode) {
                    throw new Error("Invalid country code \"".concat(countryCode, "\". Please provide a valid 3-letter country code."));
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, apiHelper_1.fetchCountrySummary)(upperCaseCode)];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data];
            case 3:
                error_1 = _a.sent();
                throw new Error("Failed to retrieve country stats for code \"".concat(countryCode, "\": ").concat(error_1.message));
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getCountryStats = getCountryStats;
/**
 * Retrieves data for a specific indicator for a given 3-letter country code.
 * @param countryCode - The 3-letter country code.
 * @param indicatorCode - The indicator code.
 * @returns A Promise that resolves to IndicatorStats.
 * @throws Will throw an error if the country code or indicator code is invalid or if data fetching fails.
 */
var getIndicatorStats = function (countryCode, indicatorCode) { return __awaiter(void 0, void 0, void 0, function () {
    var upperCaseCode, trimmedIndicatorCode, countryEntry, dataEntries, firstValidEntry, indicatorName, processedData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                upperCaseCode = countryCode.toUpperCase().trim();
                trimmedIndicatorCode = indicatorCode.trim();
                countryEntry = ISO_3166_1_alpha_3_codes_json_1.default.find(function (c) { return c.code === upperCaseCode; });
                if (!countryEntry) {
                    throw new Error("Invalid country code \"".concat(countryCode, "\". Please provide a valid 3-letter country code."));
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, apiHelper_1.fetchSingleIndicator)(upperCaseCode, trimmedIndicatorCode)];
            case 2:
                dataEntries = _a.sent();
                if (dataEntries.length === 0) {
                    throw new Error("No data available for indicator \"".concat(indicatorCode, "\" in country \"").concat(countryCode, "\"."));
                }
                firstValidEntry = dataEntries.find(function (entry) { return entry.value !== null; });
                if (!firstValidEntry || !firstValidEntry.indicator.value) {
                    throw new Error("Indicator \"".concat(indicatorCode, "\" does not have a valid name in the API response."));
                }
                indicatorName = firstValidEntry.indicator.value;
                processedData = dataEntries
                    .filter(function (entry) { return entry.value !== null; })
                    .map(function (entry) { return ({
                    year: entry.date,
                    value: entry.value,
                }); })
                    .sort(function (a, b) { return Number(a.year) - Number(b.year); });
                if (processedData.length === 0) {
                    throw new Error("No valid data available for indicator \"".concat(indicatorCode, "\" in country \"").concat(countryCode, "\"."));
                }
                return [2 /*return*/, {
                        country: countryEntry.name,
                        countryCode: countryEntry.code,
                        indicatorCode: trimmedIndicatorCode,
                        indicatorName: indicatorName,
                        data: processedData,
                    }];
            case 3:
                error_2 = _a.sent();
                throw new Error("Failed to retrieve indicator \"".concat(indicatorCode, "\" for country \"").concat(countryCode, "\": ").concat(error_2.message));
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getIndicatorStats = getIndicatorStats;
