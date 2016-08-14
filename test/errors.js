import test from 'ava';
import { NoMatchingResourceError } from '../lib/errors';

test("Exports a constructor", (t) => {
    t.is(typeof NoMatchingResourceError, "function");
});

test("NoMatchingResourceError is a valid error implementation", (t) => {
    const error = new NoMatchingResourceError("foo");

    t.is(error.name, "NoMatchingResourceError");
    t.is(error.message, "No matching resource configuration was found for foo");
    t.true("stack" in error);
});
