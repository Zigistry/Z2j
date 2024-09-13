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

    // Replace .{ for objects with lookahead to ensure it's not for arrays
    input = input.replace(/\.{(?=\s*\.)/g, '{'); // Only replace if followed by another dot (object fields)

    // Replace .field = "value" with "field": "value"
    input = input.replace(/\.([a-zA-Z0-9_-]+)\s*=\s*/g, '"$1": ');

    // Handle the @"raylib-zig" case
    input = input.replace(/\.\@"([\w\-\.]+)"\s*=\s*\./g, '"$1": ');

    // Replace Zon arrays in the format .{ 1, 2, 3 } with [1, 2, 3]
    input = input.replace(/\.{\s*([^\{\}]*)\s*}/g, (_, arrayContent:string) => {
        const formattedArray = arrayContent.split(',').map(item => item.trim()).join(', ');
        return `[${formattedArray}]`;
    });

    // Handle edge case where there are nested objects after arrays
    input = input.replace(/\.\s*\{/g, '{');

    // Remove commas after the last element in objects or arrays (JSON doesn't allow trailing commas)
    input = input.replace(/,(\s*[}\]])/g, '$1');

    return input;
}
