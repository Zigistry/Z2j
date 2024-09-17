function removeComments(input: string): string {
  return input.replace(/("(?:\\.|[^"\\])*")|\/\/.*|\/\*[\s\S]*?\*\//g, (match, stringMatch) => {
    if (stringMatch !== undefined) {
      return stringMatch;
    }
    return '';
  });
}

export default function zon2json(input: string): string {
  input = removeComments(input);

  // Replace .{ with {
  input = input.replace(/\.{/g, '{');

  // Replace .field = "value" or .field: "value" with "field": "value"
  input = input.replace(/\.([a-zA-Z0-9_-]+)\s*(=|:)\s*/g, '"$1": ');

  // Remove the .@ prefix and handle it correctly
  input = input.replace(/\.@([a-zA-Z0-9_-]+)\s*(=|:)\s*/g, '"$1": ');

  // Remove unnecessary dots before braces
  input = input.replace(/\.\s*\{/g, '{');

  // Handle .@"key" as "key"
  input = input.replace(/\.@"([a-zA-Z0-9_-]+)"\s*(=|:)\s*/g, '"$1": ');

  // Convert Zon-style arrays to JSON arrays
  input = input.replace(/\{([^:]+?)\}/g, (_, arrayContent: string) => {
    if (/:/.test(arrayContent)) {
      return `{${arrayContent}}`; // It's an object, leave it as is
    } else {
      // Handle Zon arrays: format content as JSON array
      const formattedArray = arrayContent.split(',').map(item => item.trim()).join(', ');
      return `[${formattedArray}]`; // Convert to JSON array
    }
  });

  // Remove trailing commas in objects or arrays
  input = input.replace(/,(\s*[}\]])/g, '$1');

  return input;
}
