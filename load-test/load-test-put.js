import http from 'k6/http';
import { sleep, check } from 'k6';

let vus = __ENV.VUS;
export let options = {
  stages: [
    { duration: "5s", target: vus }, // simulate ramp-up of traffic from 1 to max users over 30 s.
    { duration: "30s", target: vus }, // stay at max users for 30 s
  ],
  thresholds: {
    'http_req_duration': ['p(99)<100'], // 99% of requests must complete below 100ms
  }
};

function postEvent(event) {
  let headers = {'Content-Type': 'application/json'};
  let url = 'http://127.0.0.1:3000/events';
  return http.post(url, JSON.stringify(event), {headers: headers});
}

const refIds = ['A', 'B', 'C', 'D'];

export default function() {
  var refId = refIds[Math.floor(refIds.length * Math.random())];
  let userId = __VU;

  let spinEvent = {
    "refId": refId,
    "userId": userId,
    "type": "spin",
    "value": Math.round(100 * Math.random())
  };

  let res = postEvent(spinEvent);

  check(res, {
    'post event returns 201': (r) => r.status === 201,
  });

  if (__ITER % 100 === 0 && __VU % 50 === 0) {
    let redemptionEvent = {
      "refId": refId,
      "userId": userId,
      "type": "redeem"
    };

    let res = postEvent(redemptionEvent);
    
    check(res, {
      'post event returns 201': (r) => r.status === 201,
    });
  }

  let url = 'http://127.0.0.1:3000/refs';
  res = http.get(url);
  check(res, {
    'get refs returns 200': (r) => r.status === 200,
  });

  sleep(1);
}