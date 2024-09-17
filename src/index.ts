function removeComments(input: string): string {
  return input.replace(/("(?:\\.|[^"\\])*")|\/\/.*|\/\*[\s\S]*?\*\//g, (match, stringMatch) => {
    if (stringMatch !== undefined) {
      return stringMatch;
    }
    return '';
  });
}

export function zon2json(input: string): string {
  input = removeComments(input);

  // Handle objects: Replace .{ with {
  input = input.replace(/\.{/g, '{');

  // Replace .field = "value" or .field: "value" with "field": "value"
  input = input.replace(/\.([a-zA-Z0-9_-]+)\s*(=|:)\s*/g, '"$1": ');

  // Remove the .@ prefix from fields
  input = input.replace(/\.@([a-zA-Z0-9_-]+)\s*(=|:)\s*/g, '"$1": ');

  // Handle arrays: Zon uses {.field = "value", ...} for objects
  // Replace Zon arrays in the format { value1, value2, ... } with [ value1, value2, ... ]
  input = input.replace(/\{([^:]+?)\}/g, (_, arrayContent: string) => {
    if (/:/.test(arrayContent)) {
      return `{${arrayContent}}`; // It's an object
    } else {
      const formattedArray = arrayContent.split(',').map(item => item.trim()).join(', ');
      return `[${formattedArray}]`; // It's an array
    }
  });

  // Remove commas after the last element in objects or arrays (JSON doesn't allow trailing commas)
  input = input.replace(/,(\s*[}\]])/g, '$1');

  return input;
}
