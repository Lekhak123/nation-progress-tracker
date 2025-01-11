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
exports.get_all_indicators = exports.fetchSingleIndicator = exports.fetchCountrySummary = void 0;
var axios_1 = require("axios");
var indicatorsMap_json_1 = require("./indicatorsMap.json");
var parsedIndicatorsMap = indicatorsMap_json_1.default;
/**
 * Fetches data for multiple indicators for a given country.
 * @param country - The 3-letter country code.
 * @returns A promise that resolves to CountryStats.
 */
var fetchCountrySummary = function (country) { return __awaiter(void 0, void 0, void 0, function () {
    var principalIndicators, countryName, countryCode, failedIndicatorsList, fetchIndicator, results, organizedData_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                principalIndicators = Object.keys(parsedIndicatorsMap);
                countryName = '';
                countryCode = '';
                failedIndicatorsList = [];
                fetchIndicator = function (principal, indicator) { return __awaiter(void 0, void 0, void 0, function () {
                    var response, _a, data, firstValidEntry, error_2;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, axios_1.default.get("https://api.worldbank.org/v2/country/".concat(country, "/indicator/").concat(indicator, "?format=json&per_page=100"))];
                            case 1:
                                response = _b.sent();
                                if (!response.data || !Array.isArray(response.data)) {
                                    throw new Error("Invalid response structure for indicator ".concat(indicator));
                                }
                                if (response.data.length < 2) {
                                    throw new Error("Incomplete response for indicator ".concat(indicator));
                                }
                                _a = response.data, data = _a[1];
                                // Extract country information from the first valid entry
                                if (!countryName && data.length > 0) {
                                    firstValidEntry = data.find(function (entry) { return entry.value !== null; });
                                    if (firstValidEntry) {
                                        countryName = firstValidEntry.country.value;
                                        countryCode = firstValidEntry.countryiso3code;
                                    }
                                }
                                return [2 /*return*/, data];
                            case 2:
                                error_2 = _b.sent();
                                throw new Error("Failed to fetch indicator ".concat(indicator, ": ").concat(error_2.message));
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Promise.all(principalIndicators.map(function (principal) { return __awaiter(void 0, void 0, void 0, function () {
                        var indicators, indicatorEntries, dataPromises, settledResults, indicatorData, failedIndicators;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    indicators = parsedIndicatorsMap[principal];
                                    if (Object.keys(indicators).length === 0) {
                                        return [2 /*return*/, { principal: principal, data: {} }];
                                    }
                                    indicatorEntries = Object.entries(indicators);
                                    dataPromises = indicatorEntries.map(function (_a) {
                                        var indicatorCode = _a[0], _ = _a[1];
                                        return fetchIndicator(principal, indicatorCode);
                                    });
                                    return [4 /*yield*/, Promise.allSettled(dataPromises)];
                                case 1:
                                    settledResults = _a.sent();
                                    indicatorData = {};
                                    failedIndicators = [];
                                    indicatorEntries.forEach(function (_a, index) {
                                        var indicatorCode = _a[0], indicatorName = _a[1];
                                        var result = settledResults[index];
                                        if (result.status === 'fulfilled') {
                                            var dataEntries = result.value
                                                .filter(function (entry) { return entry.value !== null; })
                                                .map(function (entry) { return ({
                                                year: entry.date,
                                                value: entry.value
                                            }); });
                                            if (dataEntries.length > 0) {
                                                indicatorData[indicatorCode] = {
                                                    name: indicatorName,
                                                    data: dataEntries
                                                };
                                            }
                                        }
                                        else {
                                            failedIndicators.push(indicatorCode);
                                        }
                                    });
                                    if (failedIndicators.length > 0) {
                                        failedIndicatorsList.push({ principal: principal, indicators: failedIndicators });
                                    }
                                    return [2 /*return*/, { principal: principal, data: indicatorData }];
                            }
                        });
                    }); }))];
            case 2:
                results = _a.sent();
                organizedData_1 = {};
                results.forEach(function (result) {
                    organizedData_1[result.principal] = result.data;
                });
                if (!countryName || !countryCode) {
                    throw new Error('Country information could not be retrieved.');
                }
                return [2 /*return*/, {
                        country: countryName,
                        countryCode: countryCode,
                        indicators: organizedData_1,
                        failedIndicators: failedIndicatorsList
                    }];
            case 3:
                error_1 = _a.sent();
                throw new Error("Failed to fetch country data: ".concat(error_1.message));
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.fetchCountrySummary = fetchCountrySummary;
/**
 * Fetches data for a single indicator for a given country.
 * @param country - The 3-letter country code.
 * @param indicator - The indicator code.
 * @returns A promise that resolves to an array of DataEntry.
 * @throws Will throw an error if the fetch fails or the response is invalid.
 */
var fetchSingleIndicator = function (country, indicator) { return __awaiter(void 0, void 0, void 0, function () {
    var response, _a, data, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get("https://api.worldbank.org/v2/country/".concat(country, "/indicator/").concat(indicator, "?format=json&per_page=100"))];
            case 1:
                response = _b.sent();
                if (!response.data || !Array.isArray(response.data)) {
                    throw new Error("Invalid response structure for indicator ".concat(indicator));
                }
                if (response.data.length < 2) {
                    throw new Error("Incomplete response for indicator ".concat(indicator));
                }
                _a = response.data, data = _a[1];
                return [2 /*return*/, data];
            case 2:
                error_3 = _b.sent();
                throw new Error("Failed to fetch indicator ".concat(indicator, ": ").concat(error_3.message));
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.fetchSingleIndicator = fetchSingleIndicator;
/**
 * Fetches all indicators from the World Bank API.
 * @returns A promise that resolves to an array of indicators with id, name, sourceOrganization, and sourceNote.
 * @throws Will throw an error if fetching fails.
 */
var get_all_indicators = function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseUrl, perPage, currentPage, totalPages, allIndicators, response, _a, meta, indicators, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                baseUrl = 'https://api.worldbank.org/v2/indicator';
                perPage = 50;
                currentPage = 1;
                totalPages = 1;
                allIndicators = [];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                _b.label = 2;
            case 2: return [4 /*yield*/, axios_1.default.get("".concat(baseUrl, "?format=json&per_page=").concat(perPage, "&page=").concat(currentPage))];
            case 3:
                response = _b.sent();
                if (!response.data || !Array.isArray(response.data) || response.data.length < 2) {
                    throw new Error("Invalid response structure on page ".concat(currentPage));
                }
                _a = response.data, meta = _a[0], indicators = _a[1];
                indicators.forEach(function (indicator) {
                    allIndicators.push({
                        id: indicator.id,
                        name: indicator.name,
                        sourceOrganization: indicator.sourceOrganization,
                        sourceNote: indicator.sourceNote,
                    });
                });
                totalPages = meta.pages;
                currentPage++;
                _b.label = 4;
            case 4:
                if (currentPage <= totalPages) return [3 /*break*/, 2];
                _b.label = 5;
            case 5: return [2 /*return*/, allIndicators];
            case 6:
                error_4 = _b.sent();
                throw new Error("Failed to fetch all indicators: ".concat(error_4.message));
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.get_all_indicators = get_all_indicators;
