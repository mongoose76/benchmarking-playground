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

export default function() {
  let spinEvent = {
    "refId": 123456,
    "userId": __VU,
    "type": "spin",
    "value": Math.round(100 * Math.random())
  };

  let headers = {'Content-Type': 'application/json'};
  let url = 'http://127.0.0.1:3000/events';
  let res = http.post(url, JSON.stringify(spinEvent), {headers: headers});

  check(res, {
    'post event returns 201': (r) => r.status === 201,
  });

  if (__ITER % 100 === 0 && __VU % 50 === 0) {
    let redemptionEvent = {
      "refId": 123456,
      "userId": __VU,
      "type": "redeem"
    };
    let headers = {'Content-Type': 'application/json'};
    let url = 'http://127.0.0.1:3000/events';
    let res = http.post(url, JSON.stringify(redemptionEvent), {headers: headers});
    check(res, {
      'post event returns 201': (r) => r.status === 201,
    });
  }

  

  //url = 'http://127.0.0.1:3000/refs/123456';
  //res = http.get(url);
  //check(res, {
  //  'get ref by id returns 200': (r) => r.status === 200,
  //});

  sleep(1);
}