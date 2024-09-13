function removeComments(input: string): string {
    // Match strings and comments separately
    return input.replace(/("(?:\\.|[^"\\])*")|\/\/.*|\/\*[\s\S]*?\*\//g, (match, stringMatch) => {
        // If it's a string, return it unchanged
        if (stringMatch !== undefined) {
            return stringMatch;
        }
        // Otherwise, it's a comment, so remove it
        return '';
    });
}

export function zon2json(input: string): string {
    input = removeComments(input);

    // input = input.replace(/\/\/.*$/gm, ''); // Remove single-line comments
    input = input.replace(/\.{/, '{');

    // Replace .field = "value" with "field": "value"
    input = input.replace(/\.([a-zA-Z0-9_-]+)\s*=\s*/g, '"$1": ');

    // Handle the @"raylib-zig" case
    input = input.replace(/\.\@"([\w\-\.]+)"\s*=\s*\./g, '"$1": ');

    // Replace arrays in the format .{ "value1", "value2", ... } with [ "value1", "value2", ... ]
    input = input.replace(/\.{\s*("[^"]*"\s*,?\s*)+\s*}/g, match => {
        return match
            .replace(/\.{/, '[')
            .replace(/}\s*$/, ']')
            .replace(/,\s*]/, ']'); // Remove the trailing comma before closing ]
    });

    // Remove extra dots before opening braces
    input = input.replace(/\.\s*\{/g, '{');

    // Remove commas after the last element in objects or arrays (JSON doesn't allow trailing commas)
    input = input.replace(/,(\s*[}\]])/g, '$1');
    return input;
}