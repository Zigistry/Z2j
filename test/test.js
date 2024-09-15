import zon2json from "../dist/index";

const input = zon2json(
  `.{
    .name = "Zigistry",
    .version = "0.0.0",
    .minimum_zig_version = "0.13.0",
    .hello = .{1,2,3},
    .something = .{.path="something"},
    .paths = .{
        "build.zig",
        "build.zig.zon",
        "scripts",
    },
}`,
);
const expectedOutput = `{
    "name": "Zigistry",
    "version": "0.0.0",
    "minimum_zig_version": "0.13.0",
    "hello": [1, 2, 3],
    "something": {"path": "something"},
    "paths": ["build.zig", "build.zig.zon", "scripts" ]
}`;

function main() {
  const result = zon2json(input);
  return result == expectedOutput;
}

console.log(main());
