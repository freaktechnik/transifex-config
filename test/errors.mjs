import test from 'ava';
import {
    NoMatchingResourceError, MatchesSourceError
} from '../lib/errors.js';

test("Exports a constructor", (t) => {
    t.is(typeof NoMatchingResourceError, "function");
    t.is(typeof MatchesSourceError, "function");
});

test("NoMatchingResourceError is a valid error implementation", (t) => {
    const error = new NoMatchingResourceError("foo");

    t.is(error.name, "NoMatchingResourceError");
    t.is(error.message, "No matching resource configuration was found for foo");
    t.true("stack" in error);
});

test("MatchesSourceError is a valid error implementation", (t) => {
    const error = new MatchesSourceError("foo");

    t.is(error.name, "MatchesSourceError");
    t.is(error.message, "Resource foo matches source language resource");
    t.true("stack" in error);
});
