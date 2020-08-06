import http from 'k6/http';
import { sleep, check } from 'k6';

let config = JSON.parse(open("config.json"));

let VUS = config.VUS;
export let options = {
  stages: [
    { duration: "60s", target: VUS }, // ramp-up stage
    { duration: "120s", target: VUS }, // load test stage
  ],
  thresholds: {
    'http_req_duration': ['p(99)<100'], // 99% of requests must complete below 100ms
  },
  throw: true,
};

const BASE_URL = config.BASE_URL || "http://127.0.0.1:3000";
const TEST_TYPE = config.TEST_TYPE || "full";
const refIds = ['A', 'B', 'C', 'D'];

export function setup() {
  console.log(`BASE_URL: ${BASE_URL}`);
  console.log(`TEST TYPE: ${TEST_TYPE}`);
}

export default function(data) {
  switch (TEST_TYPE) {
    case "simple":
      runSimpleTest();
      break;
    case "full":
      runFullTest();
      break;
    default:
      throw Error("Test type an only be full or simple");
  }
  sleep(1);
}

export function teardown(data) {
  // executed once at end of the test
}

function runSimpleTest() {
  let url = `${BASE_URL}/jackpots`;
  let res = http.get(url);
  check(res, {
    'get jackpots returns 200': (r) => r.status === 200,
  });
}

function runFullTest() {
  var refId = refIds[Math.floor(refIds.length * Math.random())];
  let userId = __VU;

  postContributeEvent(refId, userId);

  if (__ITER % 100 === 0 && __VU % 50 === 0) {
    postRedemptionEvent(refId, userId);
  }

  let url = `${BASE_URL}/jackpots`;
  let res = http.get(url);
  check(res, {
    'get jackpots returns 200': (r) => r.status === 200,
  });
}

function postEvent(event) {
  let headers = {'Content-Type': 'application/json'};
  let url = `${BASE_URL}/events`;
  return http.post(url, JSON.stringify(event), {headers: headers});
}

function postContributeEvent(refId, userId) {
  let contributeEvent = {
    "refId": refId,
    "userId": userId,
    "type": "contribute",
    "value": Math.round(100 * Math.random())
  };

  let res = postEvent(contributeEvent);

  check(res, {
    'post contribute event returns 201': (r) => r.status === 201,
  });
}

function postRedemptionEvent(refId, userId) {
  let redemptionEvent = {
    "refId": refId,
    "userId": userId,
    "type": "redeem"
  };

  let res = postEvent(redemptionEvent);
  
  check(res, {
    'post redemption event returns 201': (r) => r.status === 201,
  });
}