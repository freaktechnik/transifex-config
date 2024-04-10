import freaktechnikConfigNode from "@freaktechnik/eslint-config-node";
import freaktechnikConfigTest from "@freaktechnik/eslint-config-test";

export default [
    ...freaktechnikConfigNode,
    ...freaktechnikConfigTest,
    {
        files: ["**/*.js"],
        rules: {
            "one-var": "off",
            "require-jsdoc": "warn",
        },
    },
];
