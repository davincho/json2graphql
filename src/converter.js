import pluralize from 'pluralize';
import json5 from 'json5';
import { camelCase } from 'lodash';

import {
  isNumber,
  isString,
  find,
  isArray,
  isObject,
  isBoolean,
  isInteger
} from 'lodash';

const firstCapitalCamelCase = value => {
  const camelVersion = camelCase(value);

  return camelVersion.charAt(0).toUpperCase() + camelVersion.substr(1);
};

const mappings = [
  { test: (value, key) => key === 'id', result: () => 'ID!' },
  {
    test: (value, key) =>
      value &&
      value.toLowerCase &&
      (value.toLowerCase() === 'true' || value.toLowerCase() === 'false'),
    result: () => 'Boolean'
  },
  { test: isInteger, result: () => 'Int' },
  { test: isNumber, result: () => 'Float' },
  { test: isBoolean, result: () => 'Boolean' },
  { test: isString, result: () => 'String' },
  {
    test: isArray,
    result: (value, key) =>
      `[${pluralize.singular(firstCapitalCamelCase(key))}]`
  },
  {
    test: isObject,
    result: (value, key) => `${pluralize.singular(firstCapitalCamelCase(key))}`
  }
];

export const convertObject = (source, name) => {
  const subTypes = [];

  const rows = Object.keys(source)
    .sort((a, b) => {
      if (a === 'id') {
        return -1;
      }

      return a.charCodeAt(0) < b.charCodeAt(0) ? -1 : 1;
    })
    .map(row => {
      const value = source[row];
      const mapping = find(mappings, mapping => mapping.test(value, row));

      if (isArray(value) && value.length > 0) {
        subTypes.push(
          convertObject(
            value[0],
            pluralize.singular(firstCapitalCamelCase(row))
          )
        );
      } else if (isObject(value)) {
        subTypes.push(
          convertObject(value, pluralize.singular(firstCapitalCamelCase(row)))
        );
      }

      return `${camelCase(row)}: ${
        mapping ? mapping.result(value, row) : 'String'
      }`;
    });

  const template = `type ${firstCapitalCamelCase(name)} { ${
    rows.length === 0 ? 'id: ID!' : rows.join(' ')
  } } ${subTypes.join(' ')}`;

  return template;
};

export const convertString = (string, name) => {
  return convertObject(json5.parse(string), name);
};
