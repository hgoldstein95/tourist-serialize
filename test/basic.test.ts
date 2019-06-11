import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { suite, test } from "mocha";
import ser from "../index";

chai.use(chaiAsPromised);
const expect = chai.expect;

suite("tourist", () => {
  test("serialize link", () => {
    const link = { tour: "TOUR_ID", stop: "STOP_ID" };
    expect(ser.serializeLink(link)).to.equal(
      '{"tour":"TOUR_ID","stop":"STOP_ID"}',
    );
  });

  test("serialize stop", () => {
    const stop = {
      id: "STOP_ID",
      title: "Tour Stop",
      body: "A body.",
      line: 42,
      relPath: "/path/to/file",
      repository: "REPO",
      children: [{ tour: "TOUR_ID", stop: "STOP_ID" }],
    };
    expect(ser.serializeStop(stop)).to.equal(
      '{"id":"STOP_ID","title":"Tour Stop","body":"A body.","line":42,' +
        '"relPath":"/path/to/file","repository":"REPO",' +
        '"children":[{"tour":"TOUR_ID","stop":"STOP_ID"}]}',
    );
  });

  test("serialize tour", () => {
    const tour = {
      id: "TOUR_ID",
      title: "Tour",
      body: "Tour body.",
      stops: [],
      repositories: [["REPO", "COMMIT_HASH"] as [any, any]],
    };
    expect(ser.serializeTour(tour)).to.equal(
      '{"id":"TOUR_ID","title":"Tour","body":"Tour body.","stops":[],' +
        '"repositories":[["REPO","COMMIT_HASH"]]}',
    );
  });

  test("serialize index", () => {
    const index = { index: [["REPO", "/path/to/repo"] as [any, any]] };
    expect(ser.serializeIndex(index)).to.equal(
      '{"index":[["REPO","/path/to/repo"]]}',
    );
  });

  test("deserialize link", () => {
    const link = '{"tour":"TOUR_ID","stop":"STOP_ID"}';
    expect(ser.parseLink(link)).to.deep.equal({
      tour: "TOUR_ID",
      stop: "STOP_ID",
    });
  });

  test("deserialize stop", () => {
    const stop =
      '{"id":"STOP_ID","title":"Tour Stop","body":"A body.","line":42,' +
      '"relPath":"/path/to/file","repository":"REPO",' +
      '"children":[{"tour":"TOUR_ID","stop":"STOP_ID"}]}';
    expect(ser.parseStop(stop)).to.deep.equal({
      id: "STOP_ID",
      title: "Tour Stop",
      body: "A body.",
      line: 42,
      relPath: "/path/to/file",
      repository: "REPO",
      children: [{ tour: "TOUR_ID", stop: "STOP_ID" }],
    });
  });

  test("deserialize tour", () => {
    const tour =
      '{"id":"TOUR_ID","title":"Tour","body":"Tour body.","stops":[],' +
      '"repositories":[["REPO","COMMIT_HASH"]]}';
    expect(ser.parseTour(tour)).to.deep.equal({
      id: "TOUR_ID",
      title: "Tour",
      body: "Tour body.",
      stops: [],
      repositories: [["REPO", "COMMIT_HASH"]],
    });
  });

  test("deserialize index", () => {
    const index = '{"index":[["REPO","/path/to/repo"]]}';
    expect(ser.parseIndex(index)).to.deep.equal({
      index: [["REPO", "/path/to/repo"]],
    });
  });

  test("round-trip tour", () => {
    const tour = {
      id: "TOUR_ID",
      title: "Tour",
      body: "Tour body.",
      stops: [
        {
          id: "STOP_ID",
          title: "Tour Stop",
          body: "A body.",
          line: 42,
          relPath: "/path/to/file",
          repository: "REPO",
          children: [{ tour: "TOUR_ID", stop: "STOP_ID" }],
        },
      ],
      repositories: [["REPO", "COMMIT_HASH"] as [any, any]],
    };
    expect(ser.parseTour(ser.serializeTour(tour))).to.deep.equal(tour);
  });

  test("unhappy path", () => {
    expect(ser.parseTour("")).to.deep.equal({ kind: "json" });
    expect(ser.parseLink("{}")).to.deep.equal({
      kind: "logical",
      type: "Link",
    });
    expect(ser.parseStop("{}")).to.deep.equal({
      kind: "logical",
      type: "Stop",
    });
    expect(ser.parseTour("{}")).to.deep.equal({
      kind: "logical",
      type: "Tour",
    });
    expect(ser.parseIndex("{}")).to.deep.equal({
      kind: "logical",
      type: "Index",
    });
  });
});
